FROM node:18.17.0-alpine AS base


# Stage 1: Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock ./

RUN apk add --no-cache --virtual .build-deps \
    python3 py3-pip make g++ \
    && yarn install --frozen-lockfile --non-interactive --network-timeout 600000 \
    && apk del .build-deps

# Stage 2: Build the application
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .


ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Stage 3: Create the production image
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001


COPY --from=builder --chown=nextjs:nodejs /app/dist/public ./apps/esp/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/dist/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/dist/.next/static ./dist/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "apps/esp/server.js"]
