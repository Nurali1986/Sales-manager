#!/bin/sh
set -e

echo "Running Prisma DB push to ensure schema is synced..."
npx prisma db push --accept-data-loss || true

echo "Starting Next.js application on port ${PORT:-3000}..."
exec npm start -- -p ${PORT:-3000}
