import React from 'react';
import { Link } from 'react-router-dom';
import { CogIcon, QuestionMarkCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import AppLogo from './AppLogo';
import Tooltip from './Tooltip';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDarkMode }) => {
  return (
    <header 
      className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <AppLogo />
          <div className="flex items-center space-x-6">
            <nav 
              className="flex items-center space-x-4"
              role="navigation"
              aria-label="Main navigation"
            >
              <Tooltip content="Manage your profile and preferences">
                <Link
                  role="menuitem"
                  to="/profile"
                  className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  aria-label="Profile"
                >
                  <UserCircleIcon className="w-6 h-6" />
                </Link>
              </Tooltip>
              <Tooltip content="Configure application settings">
                <Link
                  role="menuitem"
                  to="/settings"
                  className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  aria-label="Settings"
                >
                  <CogIcon className="w-6 h-6" />
                </Link>
              </Tooltip>
              <Tooltip content="View help documentation and guides">
                <Link
                  role="menuitem"
                  to="/help"
                  className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  aria-label="Help"
                >
                  <QuestionMarkCircleIcon className="w-6 h-6" />
                </Link>
              </Tooltip>
            </nav>
            <Tooltip content={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-pressed={darkMode}
                role="switch"
              >
                <span className="text-xl transform transition-transform duration-300">
                  {darkMode ? '☀️' : '🌙'}
                </span>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
