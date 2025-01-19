import { HttpError } from './HttpError';
import { ErrorCode } from './errorCodes';

export class QRGenerationError extends HttpError {
  constructor(
    message: string,
    options?: {
      details?: Record<string, unknown>;
      metadata?: Record<string, unknown>;
      links?: { [key: string]: string };
    }
  ) {
    super(500, ErrorCode.QR_GENERATION_FAILED, message, options);
    Object.setPrototypeOf(this, QRGenerationError.prototype);
  }
}