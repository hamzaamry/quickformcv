FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL=https://quickformcv.com/api-server/api/v0
ARG NEXT_PUBLIC_APP_URL=https://quickformcv.com
ARG NEXTAUTH_URL=https://quickformcv.com

ENV DOCKER_BUILD=true \
    NODE_ENV=production \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
    NEXTAUTH_URL=${NEXTAUTH_URL}
RUN pnpm run build

FROM node:20-slim AS runner

RUN apt-get update && apt-get install -y \
    chromium \
    dumb-init \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

WORKDIR /app

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs --home /app --shell /bin/bash nextjs

RUN mkdir -p /app/.next /app/public /app/tmp /home/nextjs/.cache && \
    chown -R nextjs:nodejs /app && \
    chown -R nextjs:nodejs /home/nextjs && \
    chmod 755 /app && \
    chmod 755 /app/.next && \
    chmod 755 /app/public && \
    chmod 777 /app/tmp && \
    chmod 755 /home/nextjs/.cache

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

RUN chown -R nextjs:nodejs /app && \
    find /app -type d -exec chmod 755 {} \; && \
    find /app -type f -exec chmod 644 {} \; && \
    chmod +x /app/server.js

# Environment variables
ENV NODE_ENV=production \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PUPPETEER_CACHE_DIR=/app/tmp \
    XDG_CACHE_HOME=/home/nextjs/.cache \
    XDG_DATA_HOME=/home/nextjs/.local/share \
    HOME=/home/nextjs \
    PORT=3000 \
    HOSTNAME="0.0.0.0" \
    DOCKER_BUILD=true

RUN mkdir -p /home/nextjs/.local/share && \
    chown -R nextjs:nodejs /home/nextjs/.local

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]