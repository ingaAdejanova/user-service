import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import db from '../src/db';
import userController from '../src/modules/users/users.controller';
import { errorHandler } from './exceptions/errorHandler';

function createServer(): FastifyInstance {
  const fastify = Fastify({ logger: true });

  fastify.decorate('pg', db.pool);

  fastify.register(userController);

  fastify.setErrorHandler((error: Error, request: FastifyRequest, reply: FastifyReply) => {
    errorHandler(error, reply);
  });

  return fastify;
}

export { createServer };
