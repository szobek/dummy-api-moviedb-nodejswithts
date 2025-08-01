import knex from 'knex';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();


const knexConfig = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  migrations: {
      directory: path.join(__dirname, '../db/migrations'),
      extension: 'ts',
  },
  seeds: {
    directory: path.join(__dirname, '../db/seeds'),
  },
};

const db = knex(knexConfig);

// A kapcsolat tesztelése
db.raw('SELECT 1').then(() => {
  console.log('MySQL connected');
})
.catch((e) => {
  console.log('MySQL not connected');
  console.error(e);
});

export default db;