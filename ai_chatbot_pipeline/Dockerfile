FROM python:3.10-slim

# Prevent Python from writing .pyc files & enable logs immediately
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# System dependencies (only if needed for ML libs)
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency file first (for caching)
COPY libraries/requirements.txt ./requirements.txt

# Upgrade pip + install deps
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy full project
COPY . .

# Expose port (if running API, e.g., FastAPI)
EXPOSE 8000

# Default command (adjust if using FastAPI/uvicorn)
CMD ["python", "main.py"]