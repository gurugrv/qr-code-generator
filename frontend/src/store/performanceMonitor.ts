import type { Middleware } from '@reduxjs/toolkit';

export const createPerformanceMonitor = (): Middleware => store => next => (action: unknown) => {
  const typedAction = action as { type: string };
  const start = performance.now();
  const result = next(action);
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Action ${typedAction.type} took ${(end - start).toFixed(2)}ms`);
  }

  return result;
};