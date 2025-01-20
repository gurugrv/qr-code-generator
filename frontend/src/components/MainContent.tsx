import React, { useRef } from 'react';
import { useAppSelector } from '../store/store';
import { selectQRConfig } from '../features/qrConfig/qrConfigSlice';
import type { RootState } from '../store/store';
import QRForm from './QRForm';
import QRPreview from './QRPreview';
import CustomizationPanel from './CustomizationPanel';
import DownloadOptions from './DownloadOptions';

const MainContent: React.FC = () => {
  const qrCodeRef = useRef<HTMLImageElement>(null);
  const qrCode = useAppSelector(state => state.qrConfig.qrCode);

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 md:p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 sm:gap-8 lg:gap-12 mb-8 lg:mb-12">
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">Input Data</h3>
              <QRForm />
            </div>
          </div>
          
          <CustomizationPanel />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
            <QRPreview onImageRefChange={(ref) => {
              if (qrCodeRef.current !== ref) {
                qrCodeRef.current = ref;
              }
            }} />
          </div>
          
          {qrCode && (
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
              <DownloadOptions qrCodeRef={qrCodeRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
