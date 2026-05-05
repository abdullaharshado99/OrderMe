import os
import requests
import logging
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor
from ai_chatbot_pipeline.ai_pipeline.config import RAGConfig

class Downloading:
    def __init__(self):
        self.error = None
        self.local_file_path = ""

    async def download_file_from_s3(self, url: str, file_name: str, chunk_size: int=8192, threads: int=10) -> tuple[str, str | None] | str:
        try:
            target_directory = RAGConfig.directory_textual

            if not os.path.exists(target_directory):
                os.makedirs(target_directory)

            local_file_path = os.path.join(target_directory, file_name)

            file_exists = os.path.exists(local_file_path)
            downloaded_bytes = os.path.getsize(local_file_path) if file_exists else 0

            headers = {"Range": f"bytes={downloaded_bytes}-"} if file_exists else {}
            response = requests.head(url)
            total_size = int(response.headers.get("content-length", 0))

            if downloaded_bytes >= total_size:
                logging.warning(f"File already downloaded: {local_file_path}")
                return self.local_file_path, self.error

            def download():
                with requests.get(url, headers=headers, stream=True) as resp:
                    resp.raise_for_status()
                    mode = "ab" if file_exists else "wb"
                    with open(local_file_path, mode) as file, tqdm(
                            total=total_size,
                            initial=downloaded_bytes,
                            unit="B",
                            unit_scale=True,
                            bar_format="{l_bar}{bar}| {n_fmt}/{total_fmt} [{elapsed}<{remaining}]",
                            desc="Downloading",
                    ) as progress:
                        for chunk in resp.iter_content(chunk_size=chunk_size):
                            if chunk:
                                file.write(chunk)
                                progress.update(len(chunk))

            with ThreadPoolExecutor(max_workers=threads) as executor:
                future = executor.submit(download)
                future.result()

        except Exception as e:
            logging.error(e)

        return self.local_file_path, self.error

if __name__ == "__main__":
    new_file_name = "deep_learning.txt"
    new_file_url = "https://hivephi.s3.us-east-2.amazonaws.com/happhi-saas-311%2F1742362689230%2Fdeep_learning.txt"

    data = Downloading()
    file_path, err = data.download_file_from_s3(url=new_file_url, file_name=new_file_name)