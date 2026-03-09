# Використовуємо легкий образ Node.js
FROM node:18-alpine

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь вихідний код
COPY . .

# Білдимо NestJS проєкт
RUN npm run build

# Відкриваємо стандартний порт NestJS
EXPOSE 3000

# Запускаємо скомпільований застосунок
CMD ["npm", "run", "start:prod"]

## ---- Build stage ----
#FROM node:20-alpine AS builder
#WORKDIR /app
#
## Copy lockfiles first for caching
#COPY package.json package-lock.json ./
#
## Deterministic install (fails if lock not in sync)
#RUN npm ci
#
## Copy source
#COPY . .
#
## Build Nest -> dist/
#RUN npm run build
#
## ---- Artifact stage (just compiled output) ----
#FROM scratch AS artifact
#COPY --from=builder /app/dist /dist
#COPY --from=builder /app/package.json /package.json
