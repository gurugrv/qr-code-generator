import React from 'react';
import { useQRCode } from '../context/QRCodeContext';
import QRForm from './QRForm';
import QRPreview from './QRPreview';

const MainContent: React.FC = () => {
  const { state } = useQRCode();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Input Data
          </h2>
          <QRForm />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            QR Code Preview
          </h2>
          <QRPreview />
        </div>
      </div>
    </div>
  );
};

export default MainContent;