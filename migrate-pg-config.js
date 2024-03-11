require('dotenv').config();

module.exports = {
  driver: 'pg',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  schema: 'public',
  migrationsTable: 'migrations',
  dir: 'migrations',
};
