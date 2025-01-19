interface ErrorReport {
  message: string;
  code?: string;
  status?: number;
  action?: string;
  stack?: string;
  timestamp?: number;
  state?: unknown;
}

export const reportError = (error: ErrorReport) => {
  // Create a single, complete error report
  const errorDetails = {
    message: error.message,
    code: error.code,
    status: error.status,
    action: error.action,
    state: error.state,
    timestamp: new Date().toISOString(),
    stack: error.stack || new Error().stack,
    url: window.location.href
  };

  if (process.env.NODE_ENV === 'production') {
    // Replace with actual error reporting service integration
    console.log('[Error Report]:', errorDetails);
  } else {
    // Single consolidated error log for development
    console.error('[Error Report]:', errorDetails);
  }
};

export const initErrorReporting = () => {
  // Initialize error handlers for both production and development
  window.addEventListener('error', (event) => {
    reportError({
      message: event.message,
      stack: event.error?.stack,
      state: {
        url: window.location.href,
        timestamp: new Date().toISOString()
      }
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    reportError({
      message: error?.message || 'Unhandled promise rejection',
      stack: error?.stack,
      state: {
        url: window.location.href,
        timestamp: new Date().toISOString(),
        reason: error instanceof Error ? undefined : error // Only include non-Error reasons
      }
    });
  });

  // Add console.error interceptor for development
  if (process.env.NODE_ENV === 'development') {
    const originalConsoleError = console.error;
    // Track if we're already reporting to prevent recursion
    let isReporting = false;
    
    console.error = (...args) => {
      // Safe stringify function with size limit
      const safeStringify = (obj: unknown, limit = 10000) => {
        try {
          const str = JSON.stringify(obj, (key, value) => {
            if (typeof value === 'object' && value !== null) {
              if (Object.keys(value).length > 100) {
                return '[Large Object]';
              }
            }
            return value;
          });
          return str.length > limit ? str.slice(0, limit) + '...' : str;
        } catch (e) {
          return '[Stringify Error]';
        }
      };

      // Only report if not already in a reporting cycle
      if (!isReporting) {
        isReporting = true;
        try {
          const errorMessage = args.map(arg =>
            typeof arg === 'string' ? arg :
            arg instanceof Error ? arg.message :
            safeStringify(arg)
          ).join(' ');
          
          // Call original console.error first to maintain proper stack trace
          originalConsoleError.apply(console, args);
          
          // Then report the error
          reportError({
            message: errorMessage,
            state: {
              args: args.map(arg => safeStringify(arg))
            }
          });
        } finally {
          isReporting = false;
        }
      } else {
        // If already reporting, just call original console.error
        originalConsoleError.apply(console, args);
      }
    };
  }
};
