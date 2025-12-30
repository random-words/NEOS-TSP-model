# ---- Build image ----
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# system deps (если нужны pyomo/pandas)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
 && rm -rf /var/lib/apt/lists/*

# install deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy source code (monorepo → только python-сервис)
COPY math_models ./math_models
COPY wineapp ./wineapp

# python import path
ENV PYTHONPATH=/app

# image готов, ничего не запускаем
