import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    migrations: {
      directory: './src/db/migrations',
      extension: 'ts'
    },
    seeds: {
      directory: './src/db/seeds',
      extension: 'ts'
    }
  },
};

export default config;