# syntax=docker/dockerfile:1.6

# ---- Build stage ----
FROM node:24-alpine AS builder

WORKDIR /app

# Native build deps for better-sqlite3 (only used in this stage)
RUN apk add --no-cache python3 make g++ \
    && corepack enable \
    && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY astro.config.mjs svelte.config.js tsconfig.json ./
COPY src ./src
COPY public ./public

RUN pnpm build

# Deploy only prod dependencies (resolves pnpm symlink issues in multi-stage builds)
RUN pnpm deploy --filter=. --prod --legacy /prod

# ---- Runtime stage ----
FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4321 \
    SQLITE_DB_PATH=/data/cogisoft.db

COPY --from=builder /prod/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

RUN mkdir -p /data
VOLUME ["/data"]

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
