import React from 'react';
import { useAppDispatch } from '../store/store';
import ErrorBoundary from './ErrorBoundary';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const QRCodeGenerator: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="grid grid-cols-[300px_1fr] min-h-[calc(100vh-160px)] gap-6">
      <ErrorBoundary 
        name="QRSidebar"
        dispatch={dispatch}
        fallback={
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">
              Failed to load sidebar controls. Some features may be unavailable.
            </p>
          </div>
        }
      >
        <Sidebar />
      </ErrorBoundary>
      
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
  );
};

export default QRCodeGenerator;
