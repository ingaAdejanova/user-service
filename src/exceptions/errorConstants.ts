import { StatusCodes } from 'http-status-codes';

export const ERROR_NAMES = {
  BAD_REQUEST_EXCEPTION: 'BadRequestException',
  NOT_FOUND_EXCEPTION: 'NotFoundException',
};

export const ERROR_MAPINGS = {
  [ERROR_NAMES.BAD_REQUEST_EXCEPTION]: StatusCodes.BAD_REQUEST,
  [ERROR_NAMES.NOT_FOUND_EXCEPTION]: StatusCodes.NOT_FOUND,
};
