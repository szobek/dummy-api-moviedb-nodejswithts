mysqld &

# Vár, amíg az adatbázis feláll
echo "Waiting for MySQL to start..."
sleep 10

npx knex migrate:latest --knexfile ./knexfile.js
npx knex seed:run --knexfile ./knexfile.js

node dist/src/server.js
