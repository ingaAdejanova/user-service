import { FastifyInstance } from 'fastify';
import { createServer } from '../src/server';
import { StatusCodes } from 'http-status-codes';

let app: FastifyInstance;
let testUserId: string;

const USER_DATA = { name: 'John Doe', email: 'john@example.com' };

beforeAll(async () => {
  app = await createServer();
});

afterAll(async () => {
  await app.close();
});

const createUser = async (userData: any) => {
  const response = await app.inject({
    method: 'POST',
    url: '/users',
    payload: userData,
  });
  return JSON.parse(response.body);
};

const getUserById = async (userId: string) => {
  const response = await app.inject({
    method: 'GET',
    url: `/users/${userId}`,
  });
  return JSON.parse(response.body);
};

beforeEach(async () => {
  const { id } = await createUser(USER_DATA);
  testUserId = id;
});

describe('User Controller', () => {
  describe('GET /users/:userId', () => {
    it('should get user by ID', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/users/${testUserId}`,
      });

      expect(response.statusCode).toBe(StatusCodes.OK);

      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('created_at');
      expect(body.name).toBe(USER_DATA.name);
      expect(body.email).toBe(USER_DATA.email);
    });

    it('should return 404 if user not found', async () => {
      const userId = '6c750950-2518-4368-ad42-84bf2b8949d9';

      const response = await app.inject({
        method: 'GET',
        url: `/users/${userId}`,
      });

      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);

      const body = JSON.parse(response.body);
      expect(body).toEqual({ error: 'User not found' });
    });
  });

  describe('PATCH /users/:userId', () => {
    it('should update user by ID', async () => {
      const newName = 'Jane Doe';

      const response = await app.inject({
        method: 'PATCH',
        url: `/users/${testUserId}`,
        payload: { name: newName },
      });

      expect(response.statusCode).toBe(StatusCodes.OK);

      const updatedUser = await getUserById(testUserId);

      expect(updatedUser.name).toBe(newName);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = { name: 'Sara Doe', email: 'sara@example.com' };

      const response = await app.inject({
        method: 'POST',
        url: '/users',
        payload: newUser,
      });

      expect(response.statusCode).toBe(StatusCodes.CREATED);

      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('created_at');
      expect(body.name).toBe(newUser.name);
      expect(body.email).toBe(newUser.email);
    });
  });

  describe('GET /users', () => {
    it('should fetch users with default page size', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/users',
      });

      expect(response.statusCode).toBe(StatusCodes.OK);

      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('next_cursor');
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should delete user by ID', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/users/${testUserId}`,
      });

      expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);

      const deletedUser = await getUserById(testUserId);
      expect(deletedUser).toEqual({ error: 'User not found' });
    });
  });
});
