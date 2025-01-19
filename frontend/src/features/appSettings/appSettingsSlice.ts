import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';

interface AppSettingsState {
  apiUrl: string;
  enableAnalytics: boolean;
  enableErrorReporting: boolean;
  debugMode: boolean;
}

const initialState: AppSettingsState = {
  apiUrl: process.env.REACT_APP_API_URL || 'https://api.qr-code-generator.com',
  enableAnalytics: false,
  enableErrorReporting: true,
  debugMode: process.env.NODE_ENV === 'development',
};

export const appSettingsSlice = createSlice({
  name: 'appSettings',
  initialState,
  reducers: {
    setApiUrl: (state, action: PayloadAction<string>) => {
      state.apiUrl = action.payload;
    },
    toggleAnalytics: (state) => {
      state.enableAnalytics = !state.enableAnalytics;
    },
    toggleErrorReporting: (state) => {
      state.enableErrorReporting = !state.enableErrorReporting;
    },
    toggleDebugMode: (state) => {
      state.debugMode = !state.debugMode;
    },
  },
});

export const {
  setApiUrl,
  toggleAnalytics,
  toggleErrorReporting,
  toggleDebugMode,
} = appSettingsSlice.actions;

export const selectAppSettings = (state: RootState) => state.appSettings;

export default appSettingsSlice.reducer;