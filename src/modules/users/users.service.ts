import { createUser as createUserInDb, getUsers, getUserById, updateUserById, deleteUserById } from './users.repo';
import { BadRequestException, NotFoundException, ERROR_MAPINGS } from '../../exceptions';
import { User } from './users.dt';

export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User | undefined> {
  try {
    return await createUserInDb(userData);
  } catch (error) {
    new BadRequestException('Failed to create user');
  }
}

export async function getAllUsers(): Promise<User[] | undefined> {
  try {
    return await getUsers();
  } catch (error) {
    new BadRequestException('Failed to fetch users');
  }
}

export async function getUser(userId: string): Promise<User | undefined> {
  try {
    return await getUserById(userId);
  } catch (error) {
    new BadRequestException('Failed to fetch user');
  }
}

export async function updateUser(userId: string, userData: Partial<User>): Promise<User | undefined> {
  try {
    return await updateUserById(userId, userData);
  } catch (error) {
    new BadRequestException('Failed to update user');
  }
}

export async function deleteUser(userId: string): Promise<boolean | undefined> {
  try {
    return await deleteUserById(userId);
  } catch (error) {
    new BadRequestException('Failed to delete user');
  }
}
