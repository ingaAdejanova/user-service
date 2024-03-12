import pool from '../../db';
import { User } from './users';

export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const { name, email } = userData;
  const createdAt = new Date();
  const { rows } = await pool.query('INSERT INTO users (name, email, created_at) VALUES ($1, $2, $3) RETURNING *', [
    name,
    email,
    createdAt,
  ]);
  return rows[0];
}

export async function getUsers(): Promise<User[]> {
  const { rows } = await pool.query('SELECT * FROM users');
  return rows;
}

export async function getUserById(userId: string): Promise<User | undefined> {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  return rows[0];
}

export async function updateUserById(userId: string, userData: Partial<User>): Promise<User | undefined> {
  const { name, email } = userData;
  const { rows } = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [
    name,
    email,
    userId,
  ]);
  return rows[0];
}

export async function deleteUserById(userId: string): Promise<boolean> {
  await pool.query('DELETE FROM users WHERE id = $1', [userId]);
  return true;
}
