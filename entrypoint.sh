#!/bin/sh

echo "Waiting for MySQL to be ready..."

# Vár, amíg az adatbázis elérhető
until mysql -h "$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1" "$DB_NAME"; do
  echo "Still waiting for MySQL..."
  sleep 2
done

echo "MySQL is up - running migrations..."

npx knex migrate:latest --knexfile ./knexfile.js
npx knex seed:run --knexfile ./knexfile.js

echo "Starting server..."
exec node dist/src/server.js
