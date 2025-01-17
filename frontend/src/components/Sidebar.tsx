import React from 'react';
import { useQRCode } from '../context/QRCodeContext';
import { QRCodeType } from '../types';
import QRTypeSelector from './QRTypeSelector';
import CustomizationPanel from './CustomizationPanel';

const Sidebar: React.FC = () => {
  const { state } = useQRCode();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        QR Code Options
      </h2>
      <QRTypeSelector />
      <CustomizationPanel />
    </div>
  );
};

export default Sidebar;