import os
import logging
from dotenv import load_dotenv

load_dotenv()

LOG_COLORS = {
    'DEBUG': '\033[94m',  # Blue
    'INFO': '\033[92m',  # Green
    'WARNING': '\033[93m',  # Yellow
    'ERROR': '\033[91m',  # Red
    'CRITICAL': '\033[95m'  # Magenta
}
RESET = '\033[0m'


class ColorFormatter(logging.Formatter):
    def format(self, record):
        log_color = LOG_COLORS.get(record.levelname, RESET)
        record.levelname = f"{log_color}{record.levelname}{RESET}"
        record.msg = f"{log_color}{record.msg}{RESET}"
        return super().format(record)


handler = logging.StreamHandler()
formatter = ColorFormatter('%(levelname)s: %(message)s')
handler.setFormatter(formatter)

logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(handler)
logging.basicConfig(level=logging.INFO)

class RAGConfig:
    openai_key = os.getenv("OPENAI_API_KEY")

    os.environ["LANGCHAIN_TRACKING_V2"] = "true"
    os.environ["OPENAI_API_KEY"] = openai_key
    os.environ["LANGCHAIN_PROJECT"] = "Langchain"

    uri: str = os.getenv("MILVUS_URI")
    token: str = os.getenv("MILVUS_TOKEN")

    webhook_url = os.getenv("NODE_APP_BASE_URL") + "/webhook/ai-rag"

    dimensions: int = 512
    gpt_model: str = "gpt-4o"  # Or "gpt-3.5-turbo", "gpt-4"
    emb_model: str = "text-embedding-3-small"
    gpt_tok_model: str = "gpt2"

    audio_model: str = "whisper-1"

    # File upload settings
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    directory_textual: str = "data/documents"
    directory_images: str = "data/images"
    directory_audio: str = "data/audios"
    directory_videos: str = "data/videos"
    audio_output_path: str = "data/temp-audio"

    AIPipelineFailureReasonEnum = {
        "TAGS_CONSOLIDATION_FAILED": "tags_consolidation_failed",
        "TAGS_FETCHING_FAILED": "tags_fetching_failed",
        "UNSUPPORTED_FILE_TYPE": "unsupported_file_type",
        "EMPTY_FILE_TYPE": "empty_file_type",
        "UNSUPPORTED_ENCODING_TYPE": "unsupported_encoding_type",
        "FILE_CORRUPTED": "file_corrupted",
        "FILE_TAMPERED": "file_tampered",
        "EXTENSION_TAMPERED": "extension_tampered",
        "CONTENT_EXTRACTION_FAILED": "content_extraction_failed",
        "CHUNKING_FAILED": "chunking_failed",
        "TAGGING_FAILED": "tagging_failed",
        "SUMMARY_FAILED": "summary_failed",
        "EMBEDDING_FAILED": "embedding_failed",
        "MILVUS_STORAGE_FAILED": "milvus_storage_failed",
        "MONGODB_STORAGE_FAILED": "mongodb_storage_failed",
        "UNKNOWN_ERROR": "unknown_error"
    }

    AIPipelineStatusEnum = {
        "PENDING": "pending",
        "IN_PROGRESS": "in-progress",
        "COMPLETED": "completed",
        "FAILED": "failed",
        "PARTIAL": "partial",
        "RETRYING": "retrying"
    }

    # Chunking settings
    CHUNK_SIZE = 1024
    CHUNK_OVERLAP = 10

    COHERE_KEY = os.getenv("COHERE_KEY")

    CHROMA_KEY = os.getenv("CHROMA_CLOUD")
    TENANT_KEY = os.getenv("CHROMA_TENANT")
    CHROMA_DATABASE = os.getenv("CHROMA_DATABASE")
    CHROMA_COLLECTION = os.getenv("CHROMA_COLLECTION")

    # Search settings
    TOP_K_RESULTS = 1
    SIMILARITY_THRESHOLD = 0.5


