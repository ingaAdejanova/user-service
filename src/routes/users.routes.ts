import { FastifyInstance, FastifyPluginCallback } from 'fastify';

import {
  createUserSchema,
  getUsersSchema,
  getUserSchema,
  updateUserSchema,
  deleteUserSchema
} from '../modules/users/users-schema';
import {
  createUserHandler,
  getUsersHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler
} from '../modules/users/users.controller';

export const userRoutes: FastifyPluginCallback = (app: FastifyInstance, opts, done) => {
  app.post('/users', createUserSchema, createUserHandler);
  app.get('/users', getUsersSchema, getUsersHandler);
  app.get('/users/:userId', getUserSchema, getUserHandler);
  app.patch('/users/:userId', updateUserSchema, updateUserHandler);
  app.delete('/users/:userId', deleteUserSchema, deleteUserHandler);

  done();
};
