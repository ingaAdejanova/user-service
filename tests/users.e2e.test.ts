import { FastifyInstance } from 'fastify';
import { createServer } from '../src/server';

let app: FastifyInstance;

beforeAll(async () => {
  app = await createServer();
});

afterAll(async () => {
  await app.close();
});

describe('User Controller', () => {
  it('should create a new user', async () => {
    const userData = { name: 'John Doe', email: 'john@example.com' };

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: userData,
    });

    expect(response.statusCode).toBe(201);

    const newUser = JSON.parse(response.body);

    expect(newUser).toHaveProperty('id');
    expect(newUser).toHaveProperty('created_at');
    expect(newUser.name).toBe(userData.name);
    expect(newUser.email).toBe(userData.email);
  });
});
