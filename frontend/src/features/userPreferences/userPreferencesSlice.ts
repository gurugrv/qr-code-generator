import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';

interface UserPreferencesState {
  darkMode: boolean;
  fontSize: number;
  language: string;
  showTutorial: boolean;
}

const initialState: UserPreferencesState = {
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  fontSize: 16,
  language: 'en',
  showTutorial: true,
};

export const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setShowTutorial: (state, action: PayloadAction<boolean>) => {
      state.showTutorial = action.payload;
    },
  },
});

export const { toggleDarkMode, setFontSize, setLanguage, setShowTutorial } =
  userPreferencesSlice.actions;

export const selectDarkMode = (state: RootState) => state.userPreferences.darkMode;
export const selectUserPreferences = (state: RootState) => state.userPreferences;

export default userPreferencesSlice.reducer;