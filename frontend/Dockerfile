# ──────────────────────────────────────────────────────────────────────
# StadiumPilot AI – Frontend Dockerfile
# ──────────────────────────────────────────────────────────────────────
FROM node:20-slim AS base

WORKDIR /app

# ──────────────────────────────────────────────
# Dependencies stage
# ──────────────────────────────────────────────
FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ──────────────────────────────────────────────
# Build stage
# ──────────────────────────────────────────────
FROM deps AS builder

COPY . .

# Build arguments for environment
ARG VITE_API_BASE_URL=http://localhost:8000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ──────────────────────────────────────────────
# Production stage – serve via nginx
# ──────────────────────────────────────────────
FROM nginx:alpine AS production

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
