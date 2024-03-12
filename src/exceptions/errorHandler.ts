import { FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { ERROR_MAPINGS } from './errorConstants';

export async function errorHandler(error: any, reply: FastifyReply): Promise<void> {
  const errorType = (error as Error).constructor.name;
  const statusCode = ERROR_MAPINGS[errorType] || StatusCodes.INTERNAL_SERVER_ERROR;
  const errorMessage = statusCode === StatusCodes.INTERNAL_SERVER_ERROR ? 'Internal server error' : error.message;

  reply.status(statusCode).send({ error: errorMessage });
}
