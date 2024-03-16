import db from '../../db';
import { encodeCursor, decodeCursor } from './utils';
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
  const { name } = userData;
  const query = 'UPDATE users SET name = $1 WHERE id = $2 RETURNING *';
  const { rows } = await db.query(query, [name, userId]);
  return rows[0];
}

export async function deleteUserById(userId: string): Promise<boolean> {
  const query = 'DELETE FROM users WHERE id = $1';
  await db.query(query, [userId]);
  return true;
}

export async function getUsers(limit: number, nextCursor?: string): Promise<PaginationResult<User>> {
  let query = 'SELECT * FROM users';
  const values: any[] = [];

  if (nextCursor) {
    const { created_at, id } = decodeCursor(nextCursor);
    query += ' WHERE (created_at > $1) OR (created_at = $1 AND id > $2)';
    values.push(created_at, id);
  }

  query += ` ORDER BY created_at ASC, id ASC LIMIT $${values.length + 1}`;
  values.push(limit + 1);

  const { rows } = await db.query(query, values);

  let nextCursorResult: string | null = null;

  if (rows.length >= limit) {
    rows.pop();
    const lastRow = rows[rows.length - 1];
    nextCursorResult = encodeCursor(lastRow.created_at, lastRow.id);
  }

  return { data: rows, next_cursor: nextCursorResult };
}
