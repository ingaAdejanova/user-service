import fastify from 'fastify';
import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { createUserSchema, getUsersSchema, getUserSchema, updateUserSchema, deleteUserSchema } from './users-schema';
import { createUser, getAllUsers, getUser, updateUser, deleteUser } from './users.service';
import { BadRequestException, NotFoundException, ERROR_MAPINGS } from '../../exceptions';

export function configureRoutes(): void {
  fastify.post('/users', createUserSchema, createUserHandler);
  fastify.get('/users', getUsersSchema, getUsersHandler);
  fastify.get('/users/:userId', getUserSchema, getUserHandler);
  fastify.patch('/users/:userId', updateUserSchema, updateUserHandler);
  fastify.delete('/users/:userId', deleteUserSchema, deleteUserHandler);
}

async function createUserHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const { name, email } = request.body;

    const newUser = await createUser({ name, email });

    reply.status(StatusCodes.CREATED).send(newUser);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function getUsersHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const users = await getAllUsers();

    reply.status(StatusCodes.OK).send(users);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function getUserHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const { userId } = request.params;
    const user = await getUser(userId);

    if (!user) {
      reply.status(StatusCodes.NOT_FOUND).send({ error: 'User not found' });
      return;
    }

    reply.status(StatusCodes.OK).send(user);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateUserHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const { userId } = request.params;
    const { name, email } = request.body;

    const updatedUser = await updateUser(userId, { name, email });

    if (!updatedUser) {
      reply.status(StatusCodes.NOT_FOUND).send({ error: 'User not found' });
      return;
    }

    reply.status(StatusCodes.OK).send(updatedUser);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function deleteUserHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const { userId } = request.params;

    const deletedUser = await deleteUser(userId);

    if (!deletedUser) {
      reply.status(StatusCodes.NOT_FOUND).send({ error: 'User not found' });
      return;
    }

    reply.status(StatusCodes.NO_CONTENT).send();
  } catch (error: Error) {
    errorHandler(error, reply);
  }
}

async function errorHandler(error: Error, reply: FastifyReply): Promise<void> {
  const errorType = error.constructor.name;
  const statusCode = ERROR_MAPINGS[errorType] || StatusCodes.INTERNAL_SERVER_ERROR;

  reply.status(statusCode).send({ error: error.message });
}
