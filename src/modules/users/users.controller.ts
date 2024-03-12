import { FastifyRequest, FastifyReply, FastifyInstance, FastifyPluginCallback } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { createUserSchema, getUsersSchema, getUserSchema, updateUserSchema, deleteUserSchema } from './users-schema';
import { createUser, getAllUsers, getUser, updateUser, deleteUser } from './users.service';
import { ERROR_MAPINGS } from '../../exceptions';

const userController: FastifyPluginCallback = (app: FastifyInstance, opts, done) => {
  app.post('/users', createUserSchema, createUserHandler);
  app.get('/users', getUsersSchema, getUsersHandler);
  app.get('/users/:userId', getUserSchema, getUserHandler);
  app.patch('/users/:userId', updateUserSchema, updateUserHandler);
  app.delete('/users/:userId', deleteUserSchema, deleteUserHandler);

  app.setErrorHandler((error: Error, request: FastifyRequest, reply: FastifyReply) => {
    errorHandler(error, reply);
  });

  done();
};

async function createUserHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const { name, email } = request.body as { name: string; email: string };
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

async function getUserHandler(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply,
): Promise<void> {
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

async function updateUserHandler(
  request: FastifyRequest<{ Params: { userId: string }; Body: { name?: string; email?: string } }>,
  reply: FastifyReply,
): Promise<void> {
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

async function deleteUserHandler(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const { userId } = request.params;
    const deletedUser = await deleteUser(userId);
    if (!deletedUser) {
      reply.status(StatusCodes.NOT_FOUND).send({ error: 'User not found' });
      return;
    }
    reply.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function errorHandler(error: any, reply: FastifyReply): Promise<void> {
  const errorType = (error as Error).constructor.name;
  const statusCode = ERROR_MAPINGS[errorType] || StatusCodes.INTERNAL_SERVER_ERROR;
  const errorMessage = statusCode === StatusCodes.INTERNAL_SERVER_ERROR ? 'Internal server error' : error.message;

  reply.status(statusCode).send({ error: errorMessage });
}

export default userController;
