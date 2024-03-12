import { createUser as createUserInDb, getUsers, getUserById, updateUserById, deleteUserById } from './users.repo';
import { User } from './users.dt';
import { BadRequestException } from '../../exceptions';

export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  try {
    return await createUserInDb(userData);
  } catch (error) {
    throw new BadRequestException('Failed to create user');
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    return await getUsers();
  } catch (error) {
    throw new BadRequestException('Failed to fetch users');
  }
}

export async function getUser(userId: string): Promise<User | undefined> {
  try {
    return await getUserById(userId);
  } catch (error) {
    throw new BadRequestException('Failed to fetch user');
  }
}

export async function updateUser(userId: string, userData: Partial<User>): Promise<User | undefined> {
  try {
    return await updateUserById(userId, userData);
  } catch (error) {
    throw new BadRequestException('Failed to update user');
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    return await deleteUserById(userId);
  } catch (error) {
    throw new BadRequestException('Failed to delete user');
  }
}
