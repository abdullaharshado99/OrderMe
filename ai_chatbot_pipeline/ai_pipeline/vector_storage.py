import os
import logging
from pymilvus import MilvusClient
from langchain_milvus import Milvus
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
from ai_chatbot_pipeline.ai_pipeline.config import RAGConfig
from ai_chatbot_pipeline.ai_pipeline.support_functions import Functions

class VectorDB:
    def __init__(self):
        self.config = RAGConfig()
        self.func = Functions()

    async def insert_data_into_milvus_db(self, chunks: list, metadata: list, db_name: str, user_id: str, file_data: list):

        summary_dict, content_dict, error = self.func.extract_summary_with_prompt(file_data)

        sources = [meta["source"] for meta in metadata]
        file_id = [meta["file_id"] for meta in metadata]
        content = "".join(content_dict[sources[0]])
        summary = summary_dict.get(sources[0])

        try:
            documents = [
                Document(
                    page_content=chunk + " " + summary + " " + os.path.basename(sources[0]),
                    metadata=chunk_metadata,
                )
                for chunk, chunk_metadata in zip(chunks, metadata)
            ]

            collection_name = f"{db_name.replace('-', '_')}_{user_id}"

            langchain_milvus_client = Milvus(
                collection_name=collection_name,
                embedding_function=OpenAIEmbeddings(model=self.config.emb_model),
                connection_args={
                    'uri': self.config.uri,
                    'token': self.config.token,
                },
                auto_id=True,
                enable_dynamic_field=False,
            )

            langchain_milvus_client.add_documents(
                documents=documents
            )
            logging.info(
                f"Successfully appended {len(chunks)} documents to the collection: {collection_name} of MilvusDB.")

        except Exception as e:
            error = self.config.AIPipelineFailureReasonEnum["MILVUS_STORAGE_FAILED"]
            logging.error(f"Failed to store data in milvus: {e}")

        return file_id, content, summary, error

    def delete_milvus_collection(self, db: str, user_id: str) -> str:

        collection_name = f"{db.replace('-', '_')}_{user_id}"

        try:
            client = MilvusClient(
                uri=self.config.uri,
                token=self.config.token
            )

            if client.has_collection(collection_name):
                client.drop_collection(collection_name)
                logging.info(f"Collection '{collection_name}' has been deleted.")
            else:
                logging.info(f"Collection '{collection_name}' does not exist.")

            message = f"All data deleted from Milvus collection: {collection_name}, and associated files removed."
            return message
        except Exception as e:
            raise e

    def delete_milvus_records(self, db: str, user_id: str, file_ids: list) -> str:

        collection_name = f"{db.replace('-', '_')}_{user_id}"

        if not file_ids:
            raise ValueError("Please provide file ids.")

        try:
            vector_store = MilvusClient(
                uri=self.config.uri,
                token=self.config.token,
            )

            file_ids_str = ", ".join(f'"{fid}"' for fid in file_ids)
            search_expr = f"file_id in [{file_ids_str}]"

            existing_records = vector_store.query(
                collection_name=collection_name,
                filter=search_expr,
                output_fields=["file_id"],
            )

            if not existing_records:
                error_message = f"No records found for file_ids {file_ids} in collection: {collection_name}"
                logging.warning(error_message)
                raise Exception(error_message)

            vector_store.delete(
                collection_name=collection_name,
                filter=search_expr,
            )

            message = f"Deleted all of the records associated with file_ids: {file_ids} from collection: {collection_name}"
            logging.info(message)
            return message

        except Exception as e:
            raise e

if __name__== "__main__":
    vec = VectorDB()
