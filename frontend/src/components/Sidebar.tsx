import React from 'react';
import QRTypeSelector from './QRTypeSelector';

const Sidebar: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        QR Code Options
      </h2>
      <QRTypeSelector />
    </div>
  );
};

export default Sidebar;