import { FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { ERROR_MAPINGS } from './errorConstants';

export async function errorHandler(error: any, reply: FastifyReply): Promise<void> {
  const validationErrors = error?.validation;

  if (!!validationErrors?.length) {
    const { message, instancePath } = validationErrors[0];
    const field = instancePath?.substring(1);

    reply.status(StatusCodes.BAD_REQUEST).send({ error: `${field} ${message}` });
  } else {
    const errorType = (error as Error).constructor.name;
    const statusCode = ERROR_MAPINGS[errorType] || StatusCodes.INTERNAL_SERVER_ERROR;
    const errorMessage = error.message;

    reply.status(statusCode).send({ error: errorMessage });
  }
}
