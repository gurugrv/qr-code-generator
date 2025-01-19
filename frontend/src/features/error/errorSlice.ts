import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../store/store';

interface GlobalError {
  message: string;
  code?: string;
  stack?: string;
  timestamp?: number;
}

interface ErrorState {
  retryQueue: Array<{
    originalAction: any;
    retryCount: number;
    lastAttempt: number;
  }>;
  globalError: GlobalError | null;
}

interface RetryActionPayload {
  originalAction: any;
  retryCount: number;
}

const initialState: ErrorState = {
  retryQueue: [],
  globalError: null,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    retryAction: (state, action: PayloadAction<RetryActionPayload>) => {
      state.retryQueue.push({
        originalAction: action.payload.originalAction,
        retryCount: action.payload.retryCount,
        lastAttempt: Date.now(),
      });
    },
    clearRetryQueue: (state) => {
      state.retryQueue = [];
    },
    setGlobalError: (state, action: PayloadAction<GlobalError>) => {
      state.globalError = {
        ...action.payload,
        timestamp: Date.now(),
      };
    },
    clearGlobalError: (state) => {
      state.globalError = null;
    },
  },
});

export const {
  retryAction,
  clearRetryQueue,
  setGlobalError,
  clearGlobalError
} = errorSlice.actions;

export const processRetryQueue = (): AppThunk => (dispatch, getState) => {
  const { retryQueue } = getState().error;
  
  retryQueue.forEach((item) => {
    if (item.retryCount < 3 && Date.now() - item.lastAttempt > 5000) {
      dispatch(item.originalAction);
      dispatch(retryAction({
        originalAction: item.originalAction,
        retryCount: item.retryCount + 1,
      }));
    }
  });
};

export default errorSlice.reducer;