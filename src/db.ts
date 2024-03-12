require('dotenv').config();

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_URL,
});

export async function query(sql: string, params?: any[]): Promise<any> {
  try {
    return pool.query(sql, params);
  } catch (error) {
    console.error('Error executing SQL query:', error);
    throw error;
  }
}

export default {
  pool,
  query,
};
