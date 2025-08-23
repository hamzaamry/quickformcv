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

ENV DOCKER_BUILD=true \
    NODE_ENV=production \
    NEXT_PUBLIC_API_URL=https://quickformcv.com/api-server \
    NEXT_PUBLIC_APP_URL=https://quickformcv.com \
    NEXTAUTH_URL=https://quickformcv.com
RUN pnpm run build

FROM node:20-alpine AS runner

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init \
    su-exec \
    && rm -rf /var/cache/apk/*

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs --home /app --shell /bin/sh nextjs

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
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_CACHE_DIR=/app/tmp \
    XDG_CACHE_HOME=/home/nextjs/.cache \
    XDG_DATA_HOME=/home/nextjs/.local/share \
    HOME=/home/nextjs \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

RUN mkdir -p /home/nextjs/.local/share && \
    chown -R nextjs:nodejs /home/nextjs/.local

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]