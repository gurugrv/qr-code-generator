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