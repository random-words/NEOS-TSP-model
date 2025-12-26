# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Copy lockfiles first for caching
COPY package.json package-lock.json ./

# Deterministic install (fails if lock not in sync)
RUN npm ci

# Copy source
COPY . .

# Build Nest -> dist/
RUN npm run build

# ---- Artifact stage (just compiled output) ----
FROM scratch AS artifact
COPY --from=builder /app/dist /dist
COPY --from=builder /app/package.json /package.json
