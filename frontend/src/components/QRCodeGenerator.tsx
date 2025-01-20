import React from 'react';
import { useAppDispatch } from '../store/store';
import ErrorBoundary from './ErrorBoundary';
import Navbar from './Navbar';
import MainContent from './MainContent';

const QRCodeGenerator: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col min-h-[calc(100vh-160px)] gap-6">
      <div className="w-full">
        <ErrorBoundary
          name="QRNavbar"
          dispatch={dispatch}
          fallback={
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">
                Failed to load navigation controls. Some features may be unavailable.
              </p>
            </div>
          }
        >
          <Navbar />
        </ErrorBoundary>
      </div>
      
      <div className="flex-1">
        <ErrorBoundary
          name="QRMainContent"
          dispatch={dispatch}
          fallback={
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">
                Failed to load QR code preview. Please try refreshing the page.
              </p>
            </div>
          }
        >
          <MainContent />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
