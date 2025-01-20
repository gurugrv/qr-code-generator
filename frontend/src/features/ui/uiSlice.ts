import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

interface UIState {
  darkMode: boolean;
  navigation: {
    currentPath: string;
    previousPath: string | null;
    isMenuOpen: boolean;
  };
}

const initialState: UIState = {
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  navigation: {
    currentPath: window.location.pathname,
    previousPath: null,
    isMenuOpen: false,
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.navigation.previousPath = state.navigation.currentPath;
      state.navigation.currentPath = action.payload;
    },
    toggleMenu: (state) => {
      state.navigation.isMenuOpen = !state.navigation.isMenuOpen;
    },
    setMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.navigation.isMenuOpen = action.payload;
    },
  },
});

// Actions
export const {
  toggleDarkMode,
  setDarkMode,
  setCurrentPath,
  toggleMenu,
  setMenuOpen,
} = uiSlice.actions;

// Selectors
export const selectDarkMode = (state: RootState) => state.ui.darkMode;
export const selectNavigation = (state: RootState) => state.ui.navigation;
export const selectIsMenuOpen = (state: RootState) => state.ui.navigation.isMenuOpen;
export const selectCurrentPath = (state: RootState) => state.ui.navigation.currentPath;
export const selectPreviousPath = (state: RootState) => state.ui.navigation.previousPath;

export default uiSlice.reducer;
