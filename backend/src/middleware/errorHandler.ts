import { Request, Response, NextFunction } from 'express';
import { logError } from '../utils/logger';
import {
  HttpError,
  ValidationError,
  QRGenerationError,
  VCardValidationError,
  VCardGenerationError,
  VCardSecurityError
} from '../errors';
import { ErrorCode } from '../errors/errorCodes';
import { ErrorResponse } from '../errors/errorTypes';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const correlationId = Array.isArray(req.headers['x-correlation-id'])
    ? req.headers['x-correlation-id'][0]
    : req.headers['x-correlation-id'] || 'none';
  
  if (err instanceof HttpError) {
    const response: ErrorResponse = {
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
      timestamp: err.timestamp.toISOString(),
      correlationId,
      ...(err.details && { details: err.details }),
      ...(err.metadata && { metadata: err.metadata }),
      ...(err.links && { links: err.links }),
    };

    logError(err, {
      correlationId,
      url: req.originalUrl,
      method: req.method,
      statusCode: err.statusCode,
      stackTrace: err.stack,
      ...err.metadata,
    });

    return res.status(err.statusCode).json(response);
  }

  // Handle unexpected errors
  const unexpectedError = new HttpError(
    500,
    ErrorCode.INTERNAL_ERROR,
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message,
    {
      metadata: {
        stackTrace: err.stack,
        correlationId,
      }
    }
  );

  logError(unexpectedError, {
    correlationId,
    url: req.originalUrl,
    method: req.method,
    statusCode: 500,
    stackTrace: err.stack,
  });

  res.status(500).json({
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: unexpectedError.message,
    timestamp: unexpectedError.timestamp.toISOString(),
    correlationId,
  });
};