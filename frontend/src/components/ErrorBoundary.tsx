import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { reportError } from '../services/errorReporting';
import { showToast } from '../features/toast/toastSlice';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  dispatch?: (action: any) => void;
  name?: string; // Component identifier for better error tracking
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorCount: number; // Track error frequency
  lastError?: number; // Timestamp of last error
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private readonly ERROR_THRESHOLD = 3; // Max errors before showing permanent error
  private readonly ERROR_TIMEOUT = 5000; // Time window for counting errors (ms)
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorCount: 0,
      lastError: undefined
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const now = Date.now();
    const isWithinTimeWindow = this.state.lastError && 
      (now - this.state.lastError) < this.ERROR_TIMEOUT;
    
    // Update error count if within time window, otherwise reset
    const newErrorCount = isWithinTimeWindow ? 
      this.state.errorCount + 1 : 1;

    this.setState({
      errorCount: newErrorCount,
      lastError: now
    });

    // Report error with enhanced context
    reportError({
      message: error.message,
      code: 'REACT_BOUNDARY_ERROR',
      stack: error.stack,
      action: 'componentDidCatch',
      state: {
        componentName: this.props.name || 'UnnamedComponent',
        componentStack: errorInfo.componentStack,
        errorCount: newErrorCount,
        timeWindow: isWithinTimeWindow ? 
          `${Math.round((now - (this.state.lastError || 0)) / 1000)}s` : 'new window'
      }
    });

    if (this.props.dispatch) {
      this.props.dispatch(showToast({
        id: uuidv4(),
        type: 'error',
        message: `Error in ${this.props.name || 'component'}: ${error.message}`,
      }));
    }
  }

  handleReset = () => {
    // Only reset if not exceeding error threshold
    if (this.state.errorCount < this.ERROR_THRESHOLD) {
      this.setState({ 
        hasError: false, 
        error: undefined
      });
    }
  };

  render() {
    if (this.state.hasError) {
      // Use provided fallback or default error UI
      return this.props.fallback || (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg shadow">
          <h2 className="font-bold text-lg">
            {this.state.errorCount >= this.ERROR_THRESHOLD
              ? "Too many errors occurred"
              : "Something went wrong"}
          </h2>
          <p className="mt-2 text-sm">
            {this.state.errorCount >= this.ERROR_THRESHOLD
              ? "Please refresh the page to continue."
              : "An error occurred in the application."}
          </p>
          {this.state.error && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm font-medium">
                Error details
              </summary>
              <div className="mt-2 p-2 bg-red-100 rounded">
                <p className="text-sm font-medium">
                  {this.props.name && `Component: ${this.props.name}`}
                </p>
                <pre className="mt-1 text-xs overflow-auto">
                  {this.state.error.message}
                </pre>
              </div>
            </details>
          )}
          {this.state.errorCount < this.ERROR_THRESHOLD && (
            <button
              onClick={this.handleReset}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium transition-colors"
            >
              Try again
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
