FROM python:3.11-slim

WORKDIR /app

# Копіюємо requirements.txt з папки engine_api
COPY ./engine_api/requirements.txt .

# Встановлюємо залежності
RUN pip install --no-cache-dir -r requirements.txt

# Копіюємо ОБИДВІ папки всередину контейнера
COPY ./engine_api ./engine_api
COPY ./math_models ./math_models

# Змінюємо робочу директорію на ту, де лежить manage.py
WORKDIR /app/engine_api

EXPOSE 8000

# Запускаємо сервер
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

## ---- Build image ----
#FROM python:3.11-slim
#
#ENV PYTHONDONTWRITEBYTECODE=1
#ENV PYTHONUNBUFFERED=1
#
#WORKDIR /app
#
## system deps (если нужны pyomo/pandas)
#RUN apt-get update && apt-get install -y --no-install-recommends \
#    build-essential \
# && rm -rf /var/lib/apt/lists/*
#
## install deps
#COPY requirements.txt .
#RUN pip install --no-cache-dir -r requirements.txt
#
## copy source code (monorepo → только python-сервис)
#COPY math_service ./math_models
#COPY wineapp ./wineapp
#
## python import path
#ENV PYTHONPATH=/app
#
## image готов, ничего не запускаем
