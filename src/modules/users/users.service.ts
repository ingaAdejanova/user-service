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

export async function getAllUsers(limit?: number, nextCursor?: string): Promise<PaginationResult<User>> {
  try {
    return getUsers(limit, nextCursor);
  } catch (error) {
    throw new BadRequestException('Failed to fetch users');
  }
}
