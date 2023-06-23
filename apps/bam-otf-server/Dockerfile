FROM node:18-alpine AS base
# TODO: uncomment this line when we have a production-ready build
# ENV NODE_ENV=production

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm install -g pnpm
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=bam-otf-server --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN npm install -g pnpm
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# 👇 ignoring husky install?
RUN pnpm install --ignore-scripts

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

ARG REDIS_URL
ENV REDIS_URL=$REDIS_URL

ARG POSTGRES_URL
ENV POSTGRES_URL=$POSTGRES_URL

ARG BITCOIN_CORE_URL
ENV BITCOIN_CORE_URL=$BITCOIN_CORE_URL

ARG PRICE_DATA_SERVER_TOR_URL
ENV PRICE_DATA_SERVER_TOR_URL=$PRICE_DATA_SERVER_TOR_URL

ARG PRICE_DATA_SERVER_CLEARNET_URL
ENV PRICE_DATA_SERVER_CLEARNET_URL=$PRICE_DATA_SERVER_CLEARNET_URL

ARG WEBHOOK_URL
ENV WEBHOOK_URL=$WEBHOOK_URL

ARG WEBHOOK_SECRET
ENV WEBHOOK_SECRET=$WEBHOOK_SECRET

RUN pnpm build --filter=bam-otf-server...
RUN pnpm prisma generate

EXPOSE 3000
CMD pnpm -C apps/bam-otf-server start