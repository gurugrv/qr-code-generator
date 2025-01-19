import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from './store';
import { showErrorToast } from '../components/Toasts';
import { reportError } from '../services/errorReporting';
import { retryAction, setGlobalError } from '../features/error/errorSlice';
import { captureException } from '@sentry/react';

interface ErrorPayload {
  status: number;
  data: {
    message?: string;
    code?: string;
    retryable?: boolean;
  };
}

const errorMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: unknown) => {
  const typedAction = action as { type: string };
  
  // Handle global errors
  const handleGlobalError = (error: unknown) => {
    const { dispatch } = store as { dispatch: AppDispatch };
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    // Capture error with Sentry
    captureException(error, {
      extra: {
        action: typedAction.type,
        state: store.getState(),
      },
    });

    // Set global error state
    dispatch(setGlobalError({
      message: errorMessage,
      stack: errorStack,
      code: 'GLOBAL_ERROR',
    }));

    // Show error toast
    dispatch(showErrorToast({
      message: 'A critical error occurred',
      code: 'CRITICAL_ERROR',
    }));
  };
  // Handle rejected actions from RTK Query
  if (isRejectedWithValue(action)) {
    const payload = action.payload as ErrorPayload;
    const { dispatch } = store as { dispatch: AppDispatch };
    
    // Log error to external service
    reportError({
      message: typeof payload.data?.message === 'string' ? payload.data.message : 'Unknown error',
      code: typeof payload.data?.code === 'string' ? payload.data.code : 'UNKNOWN',
      status: typeof payload.status === 'number' ? payload.status : 500,
      action: action.type
    });

    // Show user-friendly error message
    dispatch(showErrorToast({
      message: payload.data?.message || 'Something went wrong',
      code: payload.data?.code,
    }));

    // Handle retryable errors
    if (payload.data?.retryable) {
      dispatch(retryAction({
        originalAction: action.meta.arg,
        retryCount: 0,
      }));
    }
  }

  // Handle regular action errors
  try {
    return next(action);
  } catch (error) {
    handleGlobalError(error);
    
    // Re-throw error to maintain Redux error handling
    throw error;
  }
};

export default errorMiddleware;
