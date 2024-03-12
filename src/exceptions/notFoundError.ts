import { ERROR_NAMES } from './errorConstants';

export class NotFoundException extends Error {
  constructor(message: string = 'Not found') {
    super(message);
    this.name = ERROR_NAMES.NOT_FOUND_EXCEPTION;
  }
}
