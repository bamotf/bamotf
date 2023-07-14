#!/bin/bash

DIR="$(cd "$(dirname "$0")" && pwd)"

# Extract the hostname
DB_HOSTNAME=$(echo "$POSTGRES_URL" | awk -F'[@:]' '{print $4}')

# Extract the port
DB_PORT=$(echo "$POSTGRES_URL" | awk -F'[@:]' '{print $5}')

echo '🟡 - Waiting for database to be ready...'
$DIR/wait-for-it.sh "${DB_HOSTNAME}:${DB_PORT}" -- echo '🟢 - Database is ready!'

# Apply migratrions
pnpm prisma migrate deploy

# Apply seed data
pnpm prisma db seed

# Start the server
pnpm -C apps/server start