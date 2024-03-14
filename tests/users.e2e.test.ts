import request from 'supertest';
import { FastifyInstance } from 'fastify';
import { createServer } from '../src/index';

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

    const response = await request(app.server).post('/users').send(userData).expect(201);

    const newUser = response.body;

    expect(newUser).toHaveProperty('id');
    expect(newUser).toHaveProperty('created_at');
    expect(newUser.name).toBe(userData.name);
    expect(newUser.email).toBe(userData.email);
  });
});
