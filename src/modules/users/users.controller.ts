import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { createUser, getAllUsers, getUser, updateUser, deleteUser } from './users.service';
import { errorHandler } from '../../exceptions';
import { UserPayload, UserParams } from './users.dt';

const USER_NOT_FOUND_MESSAGE = 'User not found';

export async function createUserHandler(
  request: FastifyRequest<{ Body: UserPayload }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const { name, email } = request.body;
    const newUser = await createUser({ name, email });

    reply.status(StatusCodes.CREATED).send(newUser);
  } catch (error) {
    errorHandler(error, reply);
  }
}

export async function getUsersHandler(
  request: FastifyRequest<{ Querystring: { paga_size?: string; next_cursor?: string } }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const { paga_size, next_cursor } = request.query;
    const users = await getAllUsers(paga_size, next_cursor);

    reply.status(StatusCodes.OK).send(users);
  } catch (error) {
    errorHandler(error, reply);
  }
}

export async function getUserHandler(
  request: FastifyRequest<{ Params: UserParams }>,
  reply: FastifyReply
): Promise<void> {
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

export async function updateUserHandler(
  request: FastifyRequest<{ Params: UserParams; Body: UserPayload }>,
  reply: FastifyReply
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

export async function deleteUserHandler(
  request: FastifyRequest<{ Params: UserParams }>,
  reply: FastifyReply
): Promise<void> {
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
