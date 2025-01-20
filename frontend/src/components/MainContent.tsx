import React from 'react';
import { useAppSelector } from '../store/store';
import { selectQRConfig } from '../features/qrConfig/qrConfigSlice';
import QRForm from './QRForm';
import QRPreview from './QRPreview';
import CustomizationPanel from './CustomizationPanel';

const MainContent: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 mb-12">
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">Input Data</h3>
              <QRForm />
            </div>
          </div>
          
          <CustomizationPanel />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
            <QRPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
