import { HttpError } from './HttpError';
import { ErrorCode } from './errorCodes';

export interface ErrorMetadata {
  requestId?: string;
  userId?: string;
  resourceId?: string;
  context?: Record<string, unknown>;
  stackTrace?: string;
  additionalInfo?: Record<string, unknown>;
  correlationId?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  timestamp?: string;
}

export interface ErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  timestamp: string;
  correlationId: string;
  details?: Record<string, unknown>;
  metadata?: ErrorMetadata;
  links?: { [key: string]: string };
}

// vCard specific error types
export class VCardValidationError extends HttpError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super(400, ErrorCode.VCARD_VALIDATION_ERROR, message, { details });
    this.name = 'VCardValidationError';
  }
}

export class VCardGenerationError extends HttpError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super(500, ErrorCode.VCARD_GENERATION_ERROR, message, { details });
    this.name = 'VCardGenerationError';
  }
}

export class VCardSecurityError extends HttpError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super(403, ErrorCode.VCARD_SECURITY_ERROR, message, { details });
    this.name = 'VCardSecurityError';
  }
}