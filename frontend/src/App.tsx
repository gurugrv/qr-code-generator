import React from 'react';
import QRCodeGenerator from './components/QRCodeGenerator';
import { useAppDispatch, useAppSelector } from './store/store';
import { toggleDarkMode } from './features/userPreferences/userPreferencesSlice';
import ToastsContainer from './components/Toasts';
import { CogIcon, QuestionMarkCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import AppLogo from './components/AppLogo';
import Header from './components/Header';

function App() {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(state => state.userPreferences.darkMode);

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <QRCodeGenerator />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
              © 2025 QR Code Generator. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
      <ToastsContainer />
    </>
  );
}

export default App;
