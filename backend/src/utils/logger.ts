import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ErrorMetadata } from '../errors/errorTypes';

const { combine, timestamp, printf, colorize, json } = winston.format;

const devFormat = printf(({ level, message, timestamp, stack, metadata }) => {
  const base = `${timestamp} [${level}]: ${stack || message}`;
  return metadata ? `${base}\n${JSON.stringify(metadata, null, 2)}` : base;
});

const prodFormat = combine(
  timestamp(),
  json()
);

const createTransport = (type: 'error' | 'access') => new DailyRotateFile({
  filename: `logs/${type}-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: type === 'error' ? 'error' : 'info',
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: process.env.NODE_ENV === 'production' ? prodFormat : combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    devFormat
  ),
  transports: [
    createTransport('error'),
    createTransport('access'),
    new winston.transports.Console({
      format: combine(colorize(), devFormat),
    }),
  ],
});

export const logError = (
  error: Error,
  metadata?: ErrorMetadata
) => {
  logger.error(error.message, {
    stack: error.stack,
    metadata: {
      ...metadata,
      name: error.name,
    }
  });
};

export const logRequest = (
  message: string,
  metadata?: Record<string, unknown>
) => {
  logger.info(message, { metadata });
};

export default logger;