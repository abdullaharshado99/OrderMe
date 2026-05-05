import os
import asyncio
import logging
import traceback
from typing import List, Any
from jose import jwt, JWTError
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.executors.pool import ThreadPoolExecutor
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ai_chatbot_pipeline.ai_pipeline.config import RAGConfig
from ai_chatbot_pipeline.ai_pipeline.query_rag import Query
from ai_chatbot_pipeline.ai_pipeline.doc_chunking import Chunk
from ai_chatbot_pipeline.ai_pipeline.support_functions import Functions
from ai_chatbot_pipeline.ai_pipeline.vector_storage import VectorDB
from ai_chatbot_pipeline.ai_pipeline.media_download_cloud import Downloading
from ai_chatbot_pipeline.ai_pipeline.data_extraction import DocumentProcessor

load_dotenv()

logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(sync_app: FastAPI):
    job_stores = {"default": MemoryJobStore()}
    executors = {"default": ThreadPoolExecutor(15)}
    job_defaults = {"coalesce": False, "max_instances": 10}
    scheduler = BackgroundScheduler(jobstores=job_stores, executors=executors, job_defaults=job_defaults)

    print("Starting the scheduler...")
    scheduler.start()

    sync_app.state.scheduler = scheduler

    yield

    print("Stopping the scheduler...")
    scheduler.shutdown(wait=False)


def get_scheduler():
    return app.state.scheduler


app = FastAPI(lifespan=lifespan)

SECRET_KEY = os.getenv("JWT_SECRET", "default_secret_key")
ALGORITHM = "HS256"


class QueryResponse(BaseModel):
    file_ids: List[str]


class QueryInput(BaseModel):
    query: str


class DatabaseName(BaseModel):
    name: str


class FileId(BaseModel):
    id: str


class DelFileId(BaseModel):
    del_id: List[str]


class UserId(BaseModel):
    id: str


class FileUrl(BaseModel):
    url: str


class FileName(BaseModel):
    name: str


security = HTTPBearer()


def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> tuple[dict[str, Any], str]:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload, token
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


async def run_pipeline_background(file_url: str, file_name: str, file_id: str, db_name: str, user_id: str, token: str):
    error_list = []

    try:
        logging.info(f"Pipeline execution started for file {file_name} ({file_id}) \n")

        logging.info(f"Step 1: Downloading file {file_name}: ({file_id}) from S3 bucket \n")
        file_path, error = await Downloading.download_file_from_s3(None, file_url, file_name)

        if error:
            error_list.append(error)
            Functions.send_data_to_mongodb_as_webhook(file_id=[file_id], db=db_name, status=RAGConfig.AIPipelineStatusEnum["FAILED"],
                                            access_token=token, total_tags={}, errors_list=error_list)
            raise ValueError(f"Downloading failed for file: {file_name} {file_id}! \n")

        logging.info(f"Step 2: Loading data for {file_name} ({file_id}) \n")
        documents, error = await DocumentProcessor.load_all_data(None, file_id, file_path)

        if not documents:
            error_list.append(error)
            error_list.append(RAGConfig.AIPipelineFailureReasonEnum["CONTENT_EXTRACTION_FAILED"])
            Functions.send_data_to_mongodb_as_webhook(file_id=[file_id], db=db_name, status=RAGConfig.AIPipelineStatusEnum["FAILED"],
                                            access_token=token, total_tags={}, errors_list=error_list)
            raise ValueError("No new data inserted during loading. \n\n")

        logging.info(f"Step 3: Generating chunks for {file_name} ({file_id}) \n")
        chunks, metadata, error = await Chunk.generated_chunk(None, documents)

        if not chunks or not metadata:
            error_list.append(error)
            error_list.append(RAGConfig.AIPipelineFailureReasonEnum["CHUNKING_FAILED"])

            Functions.send_data_to_mongodb_as_webhook(file_id=[file_id], db=db_name, status=RAGConfig.AIPipelineStatusEnum["PARTIAL"],
                                            access_token=token, total_tags={}, errors_list=error_list)
            raise ValueError("Failed to generate chunks or metadata. \n\n")

        logging.info(f"Step 4: Inserting data into milvus database for {file_name} ({file_id}) \n")
        file_ids, content, summary, error= await VectorDB.insert_data_into_milvus_db(chunks, metadata, db_name, user_id, documents)
        if not summary or not error:
            error_list.append(error)
            Functions.send_data_to_mongodb_as_webhook(file_id=[file_id], db=db_name, status=RAGConfig.AIPipelineStatusEnum["PARTIAL"],
                                            access_token=token, errors_list=error_list, content=content, summary=summary)
            raise ValueError("Failed to inserting data into milvus database. \n\n")
        Functions.send_data_to_mongodb_as_webhook(file_id=[file_id], db=db_name, status=RAGConfig.AIPipelineStatusEnum["COMPLETED"],
                                        access_token=token, errors_list=[], content=content, summary=summary)
        logging.info(f"Pipeline execution completed for {file_name} ({file_id}) \n\n")

    except Exception as e:
        error_trace = traceback.format_exc()
        logging.error(f"Error in pipeline execution for file {file_name} ({file_id}): {e}\nTraceback: {error_trace} \n\n")


@app.get("/")
async def welcome_message():
    return {"message": "Welcome to the Document Processing API!"}


@app.post("/run-data-pipeline/")
async def run_data_pipeline(
        file_url: FileUrl,
        file_name: FileName,
        file_id: FileId,
        db_name: DatabaseName,
        user_id: UserId,
        auth_tuple: tuple[dict[str, Any], str] = Depends(verify_jwt_token)
):
    user, token = auth_tuple

    asyncio.create_task(
        run_pipeline_background(file_url.url, file_name.name, file_id.id, db_name.name, user_id.id, token))

    return {"message": "Pipeline request received. Execution will start when a step is available."}


@app.post("/execute-query/", response_model=QueryResponse)
async def execute_query(user_id: UserId,
                        db_name: DatabaseName,
                        user_query: QueryInput,
                        auth_tuple: tuple[dict[str, Any], str] = Depends(verify_jwt_token)
                        ):
    try:
        file_ids: List[str] = Query.query_rag(user_id.id, db_name.name, user_query.query)
        return {"file_ids": file_ids}
    except Exception as e:
        logging.error(f"Error in query execution: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


@app.post("/delete-milvus-records/")
async def delete_milvus_record_from_collection(
        db_name: DatabaseName,
        user_id: UserId,
        file_id: DelFileId,
        auth_tuple: tuple[dict[str, Any], str] = Depends(verify_jwt_token)
):
    try:
        response = VectorDB.delete_milvus_records(db_name.name, user_id.id, file_id.del_id)
        return JSONResponse(status_code=200, content={"message": response})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/delete-milvus-collection/")
async def delete_collection(
        db_name: DatabaseName,
        user_id: UserId,
        auth_tuple: tuple[dict[str, Any], str] = Depends(verify_jwt_token)
):
    try:
        response = VectorDB.delete_milvus_collection(db_name.name, user_id.id)
        return JSONResponse(status_code=200, content={"message": response})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

