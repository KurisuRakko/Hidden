#!/bin/sh
set -eu

echo "Running database migrations (waiting for PostgreSQL if needed)..."
attempt=1
until npm run prisma:deploy; do
  if [ "$attempt" -ge 20 ]; then
    echo "Database migrations failed after ${attempt} attempts. The web container will exit."
    exit 1
  fi

  attempt=$((attempt + 1))
  echo "Database not ready yet. Retrying in 3 seconds..."
  sleep 3
done

echo "Seeding default data..."
npm run seed

echo "Ensuring MinIO bucket exists (waiting for storage if needed)..."
attempt=1
until npm run storage:init; do
  if [ "$attempt" -ge 20 ]; then
    echo "MinIO initialization failed after ${attempt} attempts. The web container will exit."
    exit 1
  fi

  attempt=$((attempt + 1))
  echo "Storage not ready yet. Retrying in 3 seconds..."
  sleep 3
done

echo "Starting Hidden web application..."
exec npm run start -- --hostname 0.0.0.0
