import dotenv from 'dotenv';
dotenv.config();

export default {
  driver: 'pg',
  connectionString: process.env.DB_CONNECTION_URL,
  schema: 'public',
  migrationsTable: 'migrations',
  dir: 'migrations'
};
