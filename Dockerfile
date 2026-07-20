FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat ffmpeg

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --include=optional && \
    npm install --no-save --legacy-peer-deps @tailwindcss/oxide-linux-x64-musl lightningcss-linux-x64-musl

FROM base AS deps-prod
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --omit=dev --include=optional && \
    npm install --no-save --legacy-peer-deps @tailwindcss/oxide-linux-x64-musl lightningcss-linux-x64-musl

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG DATABASE_URI
ENV DATABASE_URI=${DATABASE_URI:-postgresql://postgres:postgres@localhost:5432/sonsofmountains}
ENV PAYLOAD_SECRET=build-secret
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
RUN npm run build

FROM base AS migrator
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Strip the large ffmpeg binary — not needed for migrations
RUN rm -f node_modules/ffmpeg-static/ffmpeg node_modules/ffmpeg-static/ffmpeg.exe
RUN sed -i 's|import nextEnvImport from '"'"'@next/env'"'"';|import * as nextEnvImport from '"'"'@next/env'"'"';|' \
    node_modules/payload/dist/bin/loadEnv.js
COPY package.json package-lock.json tsconfig.json next.config.ts ./
COPY src/payload ./src/payload
COPY src/lib ./src/lib
COPY src/migrations ./src/migrations
COPY scripts ./scripts
CMD ["npm", "run", "migrate"]

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache su-exec
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_OPTIONS="--max-old-space-size=2048"

ENTRYPOINT ["docker-entrypoint.sh"]
