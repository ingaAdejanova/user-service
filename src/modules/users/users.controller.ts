import { FastifyRequest, FastifyReply, FastifyInstance, FastifyPluginCallback } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { createUserSchema, getUsersSchema, getUserSchema, updateUserSchema, deleteUserSchema } from './users-schema';
import { createUser, getAllUsers, getUser, updateUser, deleteUser } from './users.service';
import { errorHandler } from '../../exceptions';
import { UserPayload, UserParams } from './users.dt';

const USER_NOT_FOUND_MESSAGE = 'The requested user could not be found.';
const DEFAULT_PAGE_SIZE = 3;

const userController: FastifyPluginCallback = (app: FastifyInstance, opts, done) => {
  app.post('/users', createUserSchema, createUserHandler);
  app.get('/users', getUsersSchema, getUsersHandler);
  app.get('/users/:userId', getUserSchema, getUserHandler);
  app.patch('/users/:userId', updateUserSchema, updateUserHandler);
  app.delete('/users/:userId', deleteUserSchema, deleteUserHandler);

  done();
};

async function createUserHandler(request: FastifyRequest<{ Body: UserPayload }>, reply: FastifyReply): Promise<void> {
  try {
    const { name, email } = request.body;
    const newUser = await createUser({ name, email });

    reply.status(StatusCodes.CREATED).send(newUser);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function getUsersHandler(
  request: FastifyRequest<{ Querystring: { limit?: string; next_cursor?: string } }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const { limit, next_cursor } = request.query;
    const pageSize = limit ? parseInt(limit, 10) : DEFAULT_PAGE_SIZE;
    const users = await getAllUsers(pageSize, next_cursor);

    reply.status(StatusCodes.OK).send(users);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function getUserHandler(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply): Promise<void> {
  try {
    const { userId } = request.params;
    const user = await getUser(userId);

    if (!user) {
      reply.status(StatusCodes.NOT_FOUND).send({ error: USER_NOT_FOUND_MESSAGE });
      return;
    }

    reply.status(StatusCodes.OK).send(user);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateUserHandler(
  request: FastifyRequest<{ Params: UserParams; Body: UserPayload }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const { userId } = request.params;
    const { name, email } = request.body;
    const updatedUser = await updateUser(userId, { name, email });

    if (!updatedUser) {
      reply.status(StatusCodes.NOT_FOUND).send({ error: USER_NOT_FOUND_MESSAGE });
      return;
    }

    reply.status(StatusCodes.OK).send(updatedUser);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function deleteUserHandler(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply): Promise<void> {
  try {
    const { userId } = request.params;
    const deletedUser = await deleteUser(userId);

    if (!deletedUser) {
      reply.status(StatusCodes.NOT_FOUND).send({ error: USER_NOT_FOUND_MESSAGE });
      return;
    }

    reply.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    errorHandler(error, reply);
  }
}

export default userController;
