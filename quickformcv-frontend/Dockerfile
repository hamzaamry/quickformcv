FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat && npm install -g pnpm@10
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# The final image uses the system Chromium, so skip Puppeteer's own download
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
RUN npm install -g pnpm@10
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL=http://localhost:8000/api/v0
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ARG NEXTAUTH_URL=http://localhost:3000
ENV DOCKER_BUILD=true \
    NODE_ENV=production \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
    NEXTAUTH_URL=${NEXTAUTH_URL}
RUN pnpm run build

FROM node:20-alpine AS runner
# Chromium is used by Puppeteer for PDF export
RUN apk add --no-cache dumb-init chromium nss freetype harfbuzz ca-certificates ttf-freefont
WORKDIR /app

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

ENV NODE_ENV=production \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PORT=3000 \
    HOSTNAME=0.0.0.0

USER nextjs
EXPOSE 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]
