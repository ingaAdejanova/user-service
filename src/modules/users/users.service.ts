import { createUser as createUserInDb, getUsers, getUserById, updateUserById, deleteUserById } from './users.repo';
import { User, PaginationResult } from './users.dt';
import { BadRequestException } from '../../exceptions';

export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  try {
    return createUserInDb(userData);
  } catch (error) {
    throw new BadRequestException('Failed to create user');
  }
}

export async function getUser(userId: string): Promise<User | undefined> {
  try {
    return getUserById(userId);
  } catch (error) {
    throw new BadRequestException('Failed to fetch user');
  }
}

export async function updateUser(userId: string, userData: Partial<User>): Promise<User | undefined> {
  try {
    return updateUserById(userId, userData);
  } catch (error) {
    throw new BadRequestException('Failed to update user');
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    return deleteUserById(userId);
  } catch (error) {
    throw new BadRequestException('Failed to delete user');
  }
}

export async function getAllUsers({ cursor, pageSize = 2 }: any): Promise<PaginationResult<User>> {
  try {
    const users = await getUsers({ cursor, pageSize });
    return addPaginationCursors(users, pageSize, cursor);
  } catch (error) {
    throw new BadRequestException('Failed to fetch users');
  }
}

function addPaginationCursors(users: User[], pageSize: number, cursor?: string): PaginationResult<User> {
  let nextCursor = null;
  let prevCursor = null;

  if (users?.length > pageSize) {
    users.pop();
    nextCursor = encodeCursor(users[users.length - 1].id);
  }

  if (cursor) {
    prevCursor = cursor;
  }

  return {
    data: users,
    next_cursor: nextCursor,
    prev_cursor: prevCursor,
  };
}

function encodeCursor(id: string): string {
  return Buffer.from(id.toString()).toString('base64');
}
