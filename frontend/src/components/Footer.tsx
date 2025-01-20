import React from 'react';

const Footer: React.FC = () => {
  const version = 'v1.0.0'; // This could be imported from a config file

  return (
    <footer 
      className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <nav 
            className="flex space-x-6" 
            aria-label="Footer navigation"
          >
            <a
              href="/help"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Visit Help Center"
            >
              Help Center
            </a>
            <a
              href="/privacy"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Read Privacy Policy"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Read Terms of Service"
            >
              Terms of Service
            </a>
          </nav>
          <div 
            className="text-sm text-gray-500 dark:text-gray-400"
            aria-label="Application version"
          >
            <span>QR Code Generator {version}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
