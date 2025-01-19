import { HttpError } from './HttpError';
import { ErrorCode } from './errorCodes';

export class ValidationError extends HttpError {
  constructor(
    message: string,
    options?: {
      details?: Record<string, unknown>;
      metadata?: Record<string, unknown>;
      links?: { [key: string]: string };
    }
  ) {
    super(400, ErrorCode.VALIDATION_ERROR, message, options);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}