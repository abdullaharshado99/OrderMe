import csv
import re, os
import shutil
import logging
import chardet
from typing import Any
from langchain_core.documents import Document
from ai_chatbot_pipeline.ai_pipeline.config import RAGConfig
from langchain_community.document_loaders import (
    PyPDFLoader, TextLoader, CSVLoader, Docx2txtLoader,
    UnstructuredExcelLoader, UnstructuredPowerPointLoader)


class DocumentProcessor:
    def __init__(self):
        self.data = []
        self.error = None
        self.textual_data = []

    def load_csv_safely(self, file_path: str) -> dict:

        with open(file_path, mode="r", errors="replace") as f:
            sample = [next(f) for _ in range(5)]

        sniffer = csv.Sniffer()
        contains_header = sniffer.has_header("\n".join(sample))

        csv_args = {"delimiter": ","}

        if not contains_header:
            with open(file_path, mode="r", errors="replace") as f:
                first_row = next(csv.reader(f, delimiter=","))
                num_columns = len(first_row)
                csv_args["fieldnames"] = [f"column_{i + 1}" for i in range(num_columns)]

        return csv_args

    def detect_encoding(self, file_path: str) -> str | None:
        with open(file_path, "rb") as f:
            raw_data = f.read()
            result = chardet.detect(raw_data)
            return result["encoding"]

    def extract_text_from_doc(self, file_path: str, file_id: str) -> tuple[list[Document], str]:
        print(file_path)
        try:
            file_loaders = {
                ".csv": CSVLoader,
                ".txt": TextLoader,
                ".docx": Docx2txtLoader,
                ".xls": UnstructuredExcelLoader,
                ".xlsx": UnstructuredExcelLoader,
                ".pptx": UnstructuredPowerPointLoader,
                ".pdf": lambda path: PyPDFLoader(path, extract_images=True)
            }

            file_extension = os.path.splitext(file_path)[1]
            print(f"the {file_extension=} and {file_path=}")
            loader_class = file_loaders.get(file_extension)

            if self.detect_encoding(file_path) not in ["ascii", "ISO-8859-1"] and file_extension == ".csv":
                self.error = RAGConfig.AIPipelineFailureReasonEnum["UNSUPPORTED_ENCODING_TYPE"]
                logging.error(f"The csv file: {file_path} is corrupted or either unsupported encoding!")

            if not loader_class:
                self.error = RAGConfig.AIPipelineFailureReasonEnum['UNSUPPORTED_FILE_TYPE']
                logging.error(f"Unsupported textual file type: {file_path}, Skipping...")

            loader = loader_class(file_path)
            loaded_data = loader.load()

            for entry in loaded_data:
                entry.metadata["file_id"] = file_id

            if file_extension == ".pdf":
                for entry in loaded_data:
                    metadata = entry.metadata
                    if "page" in metadata:
                        metadata["page"] += 1

            elif file_extension == ".csv":
                for index, entry in enumerate(loaded_data, start=2):
                    metadata = entry.metadata
                    metadata["row"] = index

            self.textual_data.extend(loaded_data)

        except Exception as e:
            logging.error(e)

        return self.textual_data, self.error

    def process_file(self, file_path: str, file_id: str) -> tuple[tuple[list[Document], str], str] | Any:
        try:
            directory_to_function = {
                RAGConfig.directory_textual: self.extract_text_from_doc,
            }

            for directory, function in directory_to_function.items():
                print(function)
                print(file_path)
                print(directory)
                # if directory in file_path or file_path.startswith(directory):
                result = function(file_path=file_path, file_id=file_id)
                return result, directory

            logging.warning(f"No processing function found for file: {file_path}")
            return []
        except Exception as e:
            raise e

    def clean_page_content(self, page_content: str) -> str:
        try:
            page_content = re.sub(r'\s+', ' ', page_content).strip()
            page_content = re.sub(r'[^a-zA-Z0-9\s.,!?\'\"-]', '', page_content)
            page_content = re.sub(r'(\b[a-zA-Z])\s(?=[a-zA-Z]\b)', r'\1', page_content)
            page_content = re.sub(r'\b([a-zA-Z])\s([a-zA-Z])\b', r'\1\2', page_content)

            page_content = re.sub(r'\s([.,!?])', r'\1', page_content)

            page_content = " ".join(page_content.split())

            return page_content
        except Exception as e:
            raise e

    async def load_all_data(self, file_id: str, file_path: str) -> tuple[list | Document, Any] | None:
        try:
            logging.info(f"Starting to load data from the file {file_path} ({file_id})")

            (file_data, error), directory = self.process_file(file_path, file_id)
            self.data.extend(file_data)

            for dat in self.data:
                if dat.page_content:
                    dat.page_content = self.clean_page_content(dat.page_content)
                else:
                    self.error = RAGConfig.AIPipelineFailureReasonEnum['EMPTY_FILE_TYPE']
                    logging.error("This file doesn't contain any data. Skipping....")

            if os.path.exists(directory):
                try:
                    shutil.rmtree(directory)
                except Exception as e:
                    raise e

            logging.info(f"Total data loaded: {len(self.data)}")

        except Exception as e:
            logging.error(e)

        return self.data, self.error

if __name__ == "__main__":
    new_file_id = "67da584196e2c42713db80b8"
    new_file_path = os.path.join(RAGConfig.BASE_DIR, "data/documents/Package.txt")
    data = DocumentProcessor()
    print(data.load_all_data(file_id=new_file_id, file_path=new_file_path))