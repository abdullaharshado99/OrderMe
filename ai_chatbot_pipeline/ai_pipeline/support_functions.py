import openai
import logging
import requests
import numpy as np
from transformers import GPT2TokenizerFast
from langchain_core.prompts import PromptTemplate
from ai_chatbot_pipeline.ai_pipeline.config import RAGConfig

class Functions:
    def __init__(self):
        self.config = RAGConfig()
        self.summary: dict = {}
        self.content: dict = {}
        self.error = None
        self.openai.api_key = self.config.openai_key
        self.tokenizer = GPT2TokenizerFast.from_pretrained(self.config.gpt_tok_model)

    def is_within_token_limit(self, text: str, max_tokens: int = 4000) -> bool:
        return len(self.tokenizer.encode(text, add_special_tokens=False)) <= max_tokens

    def extract_summary_with_prompt(self, data: list) -> tuple[dict, dict, str | None]:

        try:
            dynamic_prompt = PromptTemplate(
                input_variables=["document"],
                template=(
                    "You are an assistant skilled in summarizing text concisely and accurately. Generate a cleaned and precise summary. The text should be plain text and numbers (if bullets are needed to prefix with). No headings or bold texts or bullets. Do not use any special characters such as *, -, _, or any formatting symbols. Ensure the summary is under 350 words.\n\n Document: {document}\nSummary:"
                )
            )

            for doc in data:
                if doc.metadata:
                    metadata_key = doc.metadata.get("source")
                    if metadata_key not in self.content:
                        self.content[metadata_key] = []

                    self.content[metadata_key].append(doc.page_content)

            for metadata_key, pages in self.content.items():
                combined_content = " ".join(pages)

                if not self.is_within_token_limit(combined_content):
                    logging.warning(f"Document {metadata_key} exceeds token limit, truncating...")
                    tokens = self.tokenizer.encode(combined_content, add_special_tokens=False)
                    truncated_tokens = tokens[:4000]
                    combined_content = self.tokenizer.decode(truncated_tokens, skip_special_tokens=True)

                try:
                    prompt = dynamic_prompt.format(document=combined_content)

                    response = openai.chat.completions.create(
                        model=self.config.gpt_model,
                        messages=[
                            {"role": "system",
                             "content": "You are an assistant skilled in summarizing text concisely and accurately. Generate a cleaned and precise summary. The text should be plain text and numbers (if bullets are needed to prefix with). No headings or bold texts or bullets. Do not use any special characters such as *, -, _, or any formatting symbols. Ensure the summary is under 350 words.\n\n Document: {document}\nSummary:"},
                            {"role": "user", "content": prompt}
                        ],
                        max_tokens=200,
                        temperature=0.3,
                        top_p=1.0,
                        n=1,
                        stop=None
                    )

                    resp = response.choices[0].message.content.strip()
                    self.summary.update({metadata_key: resp})


                except openai.OpenAIError as e:
                    self.error = self.config.AIPipelineFailureReasonEnum["SUMMARY_FAILED"]

                    self.summary.update({metadata_key: "Error generating summary."})
                    logging.error(e)

        except Exception as e:
            self.error = self.config.AIPipelineFailureReasonEnum["SUMMARY_FAILED"]
            logging.error(e)

        return self.summary, self.content, self.error

    def cosine_similarity(self, vec1, vec2):
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

    def send_data_to_mongodb_as_webhook(self, file_id: list, db: str, status: str, access_token: str, total_tags: dict, errors_list: list, content: str="", summary: str=""):
        try:
            payload = {
                "fileId": file_id[0],
                "status": status,
                "content": content,
                "summary": summary,
                "tags": total_tags,
                "errors": errors_list
            }

            response = requests.post(
                self.config.webhook_url,
                json=payload,
                headers={
                    "Content-Type": "application/json",
                    "dbname": db,
                    "authorization": f"Bearer {access_token}"
                }
            )

            if response.status_code == 200:
                logging.info("Webhook executed successfully.")
            else:
                logging.error(f"Webhook failed with status {response.status_code}: {response.text}")
                raise f"Webhook failed with status {response.status_code}"

        except Exception as e:
            raise e










if __name__ == "__main__":

    new_file_url = "https://hivephi.s3.us-east-2.amazonaws.com/happhi-saas-311%2F1742362689230%2Fdeep_learning.txt"
    new_file_name = "deep_learning.txt"
    new_file_id = "67da584196e2c42713db80b8"
    file_db_name = "happhi-saas"
    new_user_id = "311"
    new_access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBwdWl4LmNvbS9hcGkvYWRtaW4vbG9naW4iLCJpYXQiOjE3NDI5Njk5ODIsImV4cCI6MTc0MzA1NjM4MiwibmJmIjoxNzQyOTY5OTgyLCJqdGkiOiJPN1ZYMlB4ckd4Z0Zxd3IwIiwic3ViIjoiMzExIiwicHJ2IjoiZGY4ODNkYjk3YmQwNWVmOGZmODUwODJkNjg2YzQ1ZTgzMmU1OTNhOSJ9.Jk4w1MCyAoJTnke9YixRWHlRA5ZFoR7_BmC4G_m4wtg"

    # query_rag(new_user_id, file_db_name, ")query")
    # delete_milvus_collection(file_db_name, new_user_id)
    # delete_milvus_record(file_db_name, new_user_id, new_file_id)
    # asyncio.run(pipeline(new_file_url, new_file_name, new_file_id, file_db_name, new_user_id, new_access_token))


