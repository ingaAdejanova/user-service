import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import db from '../src/db';

import userController from '../src/modules/users/users.controller';
import { errorHandler } from './exceptions/errorHandler';

const fastify = Fastify({ logger: true });

fastify.decorate('pg', db.pool);

fastify.register(userController);

fastify.setErrorHandler((error: Error, request: FastifyRequest, reply: FastifyReply) => {
  errorHandler(error, reply);
});

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
