import { FastifyInstance } from 'fastify';
import { createServer } from '../src/server';
import { StatusCodes } from 'http-status-codes';

enum Method {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

let app: FastifyInstance;
let testUserId: string;

const USER_DATA = { name: 'John Doe', email: 'john@example.com' };

beforeAll(async () => {
  app = await createServer();
});

afterAll(async () => {
  await app.close();
});

const request = async (method: Method, url: string, payload?: any) => {
  const response = await app.inject({ method, url, payload });
  let body;
  try {
    body = JSON.parse(response.body);
  } catch (error) {
    body = null;
  }
  return { statusCode: response.statusCode, body };
};

const createUser = async (userData: { name: string; email: string }) => {
  const { statusCode, body } = await request(Method.POST, '/users', userData);
  return { statusCode, body };
};

const getUserById = async (userId: string) => {
  const { statusCode, body } = await request(Method.GET, `/users/${userId}`);
  return { statusCode, body };
};

beforeEach(async () => {
  const { body } = await createUser(USER_DATA);
  testUserId = body.id;
});

describe('User Controller', () => {
  describe('GET /users/:userId', () => {
    it('should get user by ID', async () => {
      const { statusCode, body } = await getUserById(testUserId);

      expect(statusCode).toBe(StatusCodes.OK);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('created_at');
      expect(body.name).toBe(USER_DATA.name);
      expect(body.email).toBe(USER_DATA.email);
    });

    it('should return 404 if user not found', async () => {
      const { statusCode, body } = await getUserById('6c750950-2518-4368-ad42-84bf2b8949d9');

      expect(statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(body).toEqual({ error: 'User not found' });
    });
  });

  describe('PATCH /users/:userId', () => {
    it('should update user by ID', async () => {
      const newName = 'Jane Doe';
      await request(Method.PATCH, `/users/${testUserId}`, { name: newName });

      const updatedUser = await getUserById(testUserId);
      expect(updatedUser.body.name).toBe(newName);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = { name: 'Sara Doe', email: 'sara@example.com' };
      const { statusCode, body } = await createUser(newUser);

      expect(statusCode).toBe(StatusCodes.CREATED);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('created_at');
      expect(body.name).toBe(newUser.name);
      expect(body.email).toBe(newUser.email);
    });
  });

  describe('GET /users', () => {
    it('should fetch users with default page size', async () => {
      const { statusCode, body } = await request(Method.GET, '/users');

      expect(statusCode).toBe(StatusCodes.OK);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('next_cursor');
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should delete user by ID', async () => {
      const { statusCode } = await request(Method.DELETE, `/users/${testUserId}`);
      expect(statusCode).toBe(StatusCodes.NO_CONTENT);

      const { body } = await getUserById(testUserId);
      expect(body).toEqual({ error: 'User not found' });
    });
  });
});
