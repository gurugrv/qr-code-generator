import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import MainContent from './MainContent';
import Footer from './Footer';
import SkipLink from './SkipLink';
import { RootState } from '../store/store';
import { toggleDarkMode } from '../features/ui/uiSlice';

const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <div 
      className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}
      role="application"
    >
      <SkipLink />
      <Header 
        darkMode={darkMode} 
        onToggleDarkMode={handleToggleDarkMode}
      />
      
      <main 
        id="main-content"
        className="flex-grow bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
        role="main"
        tabIndex={-1}
      >
        <div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          role="region"
          aria-label="Main content area"
        >
          {children || <MainContent />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppLayout;
