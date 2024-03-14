import db from '../../db';
import { User, PaginationResult } from './users.dt';

export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const { name, email } = userData;
  const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
  const { rows } = await db.query(query, [name, email]);
  return rows[0];
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

export async function getUsers(limit = 10, nextCursor?: string): Promise<PaginationResult<User>> {
  let query = 'SELECT * FROM users';
  const values: any[] = [];

  if (nextCursor) {
    query += ' WHERE id > $1';
    values.push(nextCursor);
  }

  query += ` ORDER BY id ASC LIMIT $${nextCursor ? '2' : '1'}`;

  values.push(limit + 1);

  const { rows } = await db.query(query, values);

  let nextCursorResult = null;

  if (rows.length >= limit) {
    rows.pop();
    nextCursorResult = rows[rows.length - 1].id;
  }

  return { data: rows, next_cursor: nextCursorResult };
}
