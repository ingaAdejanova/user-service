import { ERROR_NAMES } from './constants';

export class BadRequestException extends Error {
  constructor(message: string = 'Bad request') {
    super(message);
    this.name = ERROR_NAMES.BAD_REQUEST_EXCEPTION;
  }
}
