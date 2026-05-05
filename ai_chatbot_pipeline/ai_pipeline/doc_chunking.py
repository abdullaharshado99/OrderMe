import logging
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
from ai_chatbot_pipeline.ai_pipeline.config import RAGConfig
from langchain_experimental.text_splitter import SemanticChunker
from langchain_text_splitters import RecursiveCharacterTextSplitter
from ai_chatbot_pipeline.ai_pipeline.data_extraction import DocumentProcessor


class Chunk:
    def __init__(self):
        self.all_chunks: list = []
        self.all_metadata: list = []
        self.error = None
        self.config = RAGConfig()
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.config.CHUNK_SIZE,
            chunk_overlap=self.config.CHUNK_OVERLAP,
            separators=["\n\n", "\n", " ", ""]
        )

    async def generated_chunk(self, documents: list[Document]) -> tuple[list, list, str|None]:
        try:
            text_splitter = SemanticChunker(OpenAIEmbeddings(), breakpoint_threshold_type="percentile")

            for doc in documents:
                text = doc.page_content
                doc_metadata = doc.metadata

                chunks = text_splitter.create_documents([text], metadatas=[doc_metadata])

                for chunk in chunks:
                    self.all_chunks.append(chunk.page_content)
                    self.all_metadata.append(chunk.metadata)

        except Exception as e:
            logging.error(e)

        return self.all_chunks, self.all_metadata, self.error

    def create_chunks(self, documents: list[Document]) -> tuple[list, list]:
        """Split text into chunks with metadata"""

        text_splitter = self.text_splitter

        all_chunks: list = []
        all_metadata: list = []

        try:

            for doc in documents:
                text = doc.page_content
                doc_metadata = doc.metadata

                chunks = text_splitter.create_documents([text], metadatas=[doc_metadata])

                for chunk in chunks:
                    all_chunks.append(DocumentProcessor.clean_page_content(None, page_content=chunk.page_content))
                    all_metadata.append(chunk.metadata)

        except Exception as e:
            print(e)

        return all_chunks, all_metadata

if __name__ == "__main__":
    chnk = Chunk()
