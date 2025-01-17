import React from 'react';
import { QRCodeProvider } from '../context/QRCodeContext';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const QRCodeGenerator: React.FC = () => {
  return (
    <QRCodeProvider>
      <div className="grid grid-cols-[300px_1fr] min-h-[calc(100vh-160px)] gap-6">
        <Sidebar />
        <MainContent />
      </div>
    </QRCodeProvider>
  );
};

export default QRCodeGenerator;