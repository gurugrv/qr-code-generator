import React from 'react';

const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        fixed top-4 left-4 z-50
        bg-white dark:bg-gray-800
        text-blue-600 dark:text-blue-400
        px-4 py-2
        rounded-lg shadow-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500
        transform transition-transform duration-200
        hover:scale-105
      "
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
