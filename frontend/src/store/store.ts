import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import type { ThunkAction, Action } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { createLogger } from 'redux-logger';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import { createErrorTracker } from './errorTracker';
import { createPerformanceMonitor } from './performanceMonitor';
import errorReducer from '../features/error/errorSlice';
import toastReducer from '../features/toast/toastSlice';
import qrConfigReducer from '../features/qrConfig/qrConfigSlice';
import userPreferencesReducer from '../features/userPreferences/userPreferencesSlice';
import appSettingsReducer from '../features/appSettings/appSettingsSlice';
import errorMiddleware from './errorMiddleware';

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    }
  };
};

const getStorage = () => {
  try {
    // Test if localStorage is available
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return storage;
  } catch (e) {
    // If localStorage is not available, use a noop storage
    console.warn('localStorage not available, falling back to noop storage');
    return createNoopStorage();
  }
};

const persistConfig = {
  key: 'root',
  version: 1,
  storage: getStorage(),
  whitelist: ['qrConfig', 'userPreferences', 'appSettings'],
  timeout: 2000, // Add timeout to prevent hanging
  serialize: true, // Ensure data is properly serialized
  debug: process.env.NODE_ENV !== 'production', // Enable debug in development
};

// Versioned root reducer to handle state migrations
const rootReducer = (state: any, action: any) => {
  const combined = combineReducers({
    qrConfig: qrConfigReducer,
    userPreferences: userPreferencesReducer,
    appSettings: appSettingsReducer,
    error: errorReducer,
    toast: toastReducer,
  });

  // Handle state migrations
  if (state?._persist?.version === 1) {
    // Migration from version 1 to 2
    return {
      ...combined(state, action),
      _persist: {
        ...state._persist,
        version: 2
      }
    };
  }

  return combined(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Initialize store with error handling
const initializeStore = () => {
  try {
    const store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }).concat(
          createLogger({
            collapsed: true,
            duration: true,
            timestamp: true,
            predicate: () => process.env.NODE_ENV !== 'production'
          }),
          createErrorTracker(),
          createPerformanceMonitor(),
          errorMiddleware
        ),
      devTools: process.env.NODE_ENV !== 'production',
    });

    const persistor = persistStore(store);

    // Monitor rehydration status
    persistor.subscribe(() => {
      const { bootstrapped } = persistor.getState();
      if (bootstrapped) {
        try {
          // Verify store state is valid after rehydration
          store.getState();
        } catch (error) {
          const { reportError } = require('../services/errorReporting');
          reportError({
            message: 'Invalid store state after rehydration',
            stack: error instanceof Error ? error.stack : undefined,
            state: { persistedState: store.getState() }
          });
          // Clear persisted state if invalid
          persistor.purge().catch(purgeErr => {
            reportError({
              message: 'Error purging store',
              stack: purgeErr instanceof Error ? purgeErr.stack : undefined
            });
          });
        }
      }
    });

    return { store, persistor };
  } catch (error) {
    const { reportError } = require('../services/errorReporting');
    reportError({
      message: 'Failed to initialize store',
      stack: error instanceof Error ? error.stack : undefined
    });
    // Fallback to a basic store without persistence
    return {
      store: configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(errorMiddleware),
        devTools: process.env.NODE_ENV !== 'production',
      }),
      persistor: null
    };
  }
};

export const { store, persistor } = initializeStore();

export type RootState = ReturnType<typeof rootReducer>;
export type PersistedState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
