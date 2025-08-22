# Minimal, production-ready image for FastAPI app based on Debian slim
# Chooses Python 3.11 for widest prebuilt wheel availability (smaller images, faster installs)
FROM python:3.11-slim AS runtime

# Environment for smaller/faster Python
ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1 \
  PIP_NO_CACHE_DIR=1 \
  PIP_DISABLE_PIP_VERSION_CHECK=1

# Workdir
WORKDIR /app

# System certs for HTTPS; avoid build tools to keep image small
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Pre-copy requirements for better layer caching
COPY requirements.txt ./
RUN python -m pip install --upgrade pip \
  && pip install --no-cache-dir --prefer-binary -r requirements.txt

# Copy app source
COPY . .

# Create non-root user
RUN useradd -m appuser \
  && chown -R appuser:appuser /app
USER appuser

# Expose FastAPI default port
EXPOSE 8000

# Start the server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
