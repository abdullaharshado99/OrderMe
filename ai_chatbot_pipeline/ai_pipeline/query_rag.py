from langchain_milvus import Milvus
from langchain_openai import OpenAIEmbeddings
from ai_chatbot_pipeline.ai_pipeline.config import RAGConfig


class Query:
    def __init__(self):
        self.config = RAGConfig()

    def query_rag(self, user_id: str, db: str, *args: str) -> list[str]:

        collection_name = f"{db.replace('-', '_')}_{user_id}"
        query = args[0]
        try:
            milvus_client = Milvus(
                collection_name=collection_name,
                embedding_function=OpenAIEmbeddings(model=self.config.emb_model),
                connection_args={
                    'uri': self.config.uri,
                    'token': self.config.token,
                }
            )

            results = milvus_client.similarity_search_with_score(query, k=100)

            file_ids = [doc[0].metadata['file_id'] for doc in results if doc[1] < 1.2]

            return file_ids

        except Exception as ce:
            raise ce