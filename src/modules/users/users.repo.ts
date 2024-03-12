import db from '../../db';
import { User } from './users.dt';

export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const { name, email } = userData;
  const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
  const { rows } = await db.query(query, [name, email]);
  return rows[0];
}

export async function getUsers(): Promise<User[]> {
  const query = 'SELECT * FROM users';
  const { rows } = await db.query(query);
  return rows;
}

export async function getUserById(userId: string): Promise<User> {
  const query = 'SELECT * FROM users WHERE id = $1';
  const { rows } = await db.query(query, [userId]);
  return rows[0];
}

export async function updateUserById(userId: string, userData: Partial<User>): Promise<User> {
  const { name, email } = userData;
  const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *';
  const { rows } = await db.query(query, [name, email, userId]);
  return rows[0];
}

export async function deleteUserById(userId: string): Promise<boolean> {
  const query = 'DELETE FROM users WHERE id = $1';
  await db.query(query, [userId]);
  return true;
}
