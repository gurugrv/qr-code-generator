import { Middleware } from '@reduxjs/toolkit';
import { reportError } from '../services/errorReporting';

export const createErrorTracker = (): Middleware => store => next => (action: unknown) => {
  const typedAction = action as { type: string };
  try {
    return next(action);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Ignore ResizeObserver loop errors as they are non-critical
    if (!errorMessage.includes('ResizeObserver loop completed with undelivered notifications')) {
      reportError({
        message: `Redux error: ${errorMessage}`,
        action: typedAction.type,
        stack: error instanceof Error ? error.stack : undefined,
        state: store.getState()
      });
    }
    throw error;
  }
};