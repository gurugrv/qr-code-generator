import React from 'react';
import QRTypeSelector from './QRTypeSelector';

const Sidebar: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-full">
      <QRTypeSelector />
    </div>
  );
};

export default Sidebar;