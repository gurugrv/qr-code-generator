import { ErrorCode } from './errorCodes';
import { ErrorMetadata } from './errorTypes';

export class HttpError extends Error {
  statusCode: number;
  code: ErrorCode;
  timestamp: Date;
  details?: Record<string, unknown>;
  metadata?: ErrorMetadata;
  links?: { [key: string]: string };

  constructor(
    statusCode: number,
    code: ErrorCode,
    message: string,
    options?: {
      details?: Record<string, unknown>;
      metadata?: ErrorMetadata;
      links?: { [key: string]: string };
    }
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date();
    this.details = options?.details;
    this.metadata = options?.metadata;
    this.links = options?.links;
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      code: this.code,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
      ...(this.details && { details: this.details }),
      ...(this.metadata && { metadata: this.metadata }),
      ...(this.links && { links: this.links }),
    };
  }
}