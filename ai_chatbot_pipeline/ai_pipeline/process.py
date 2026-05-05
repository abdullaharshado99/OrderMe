import os
import asyncio
from ai_chatbot_pipeline.ai_pipeline.config import RAGConfig
from ai_chatbot_pipeline.ai_pipeline.doc_chunking import Chunk
from ai_chatbot_pipeline.ai_pipeline.vector_storage import VectorDB
from ai_chatbot_pipeline.ai_pipeline.media_download_cloud import Downloading
from ai_chatbot_pipeline.ai_pipeline.data_extraction import DocumentProcessor


class Process:
    def __init__(self, file_id, file_path, db_name, user_id):
        self.chunking = Chunk()
        self.config = RAGConfig()
        self.vector_store = VectorDB()
        self.downloading = Downloading()
        self.doc_processor = DocumentProcessor()

        self.new_file_id = file_id
        self.new_file_path = file_path
        self.new_db_name = db_name
        self.new_user_id = user_id


    def process_and_store_document(self):
        """Process a document and store in vector DB"""

        doc, error = asyncio.run(self.doc_processor.load_all_data(file_id=self.new_file_id, file_path=self.new_file_path))
        chunks, metadata, chunk_error = asyncio.run(self.chunking.generated_chunk(doc))
        file_ids, content, summary, vector_error = asyncio.run(self.vector_store.insert_data_into_milvus_db(chunks, metadata, self.new_db_name, self.new_user_id, doc))

        return {
            'status': 'success',
            'chunks_created': len(chunks),
            'file_id': file_ids,
            'content': content,
            'summary': summary,
            'error': error,
            'chunk_error': chunk_error,
            'vector_error': vector_error
        }

if __name__ == "__main__":
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    proc = Process("67da584196e2c42713db80b8", os.path.join(BASE_DIR, "data/documents/Package.txt"), "arnasol", "101")
    print(proc.process_and_store_document())