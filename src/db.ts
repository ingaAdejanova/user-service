import dotenv from 'dotenv';
import { Pool, QueryResult } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_URL
});

async function query(sql: string, params?: any[]): Promise<QueryResult> {
  try {
    return pool.query(sql, params);
  } catch (error) {
    console.error('Error executing SQL query:', error);
    throw error;
  }
}

export default {
  pool,
  query
};
