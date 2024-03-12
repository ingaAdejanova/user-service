require('dotenv').config();

module.exports = {
  driver: 'pg',
  connectionString: process.env.DB_CONNECTION_URL,
  schema: 'public',
  migrationsTable: 'migrations',
  dir: 'migrations',
};
