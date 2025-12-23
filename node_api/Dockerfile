# ---------- Build stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Install deps first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy source + build
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM node:22-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# Copy only what is needed to run
COPY package*.json ./
# Install only production deps
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Nest default port (change if your app uses another one)
EXPOSE 3000

CMD ["node", "dist/main"]
