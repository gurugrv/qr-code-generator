import React, { useEffect } from 'react';
import AppLayout from './AppLayout';
import QRCodeGenerator from './QRCodeGenerator';
import ToastsContainer from './Toasts';
import { useAppSelector } from '@store/store';
import type { RootState } from '@store/store';

function App() {
  const darkMode = useAppSelector(state => state.userPreferences.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      <AppLayout>
        <QRCodeGenerator />
      </AppLayout>
      <ToastsContainer />
    </>
  );
}

export default App;