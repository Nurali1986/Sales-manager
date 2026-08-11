#!/bin/sh
set -e

echo "Running Prisma DB push to ensure schema is synced..."
npx prisma db push --accept-data-loss

echo "Starting Next.js application..."
exec npm start
