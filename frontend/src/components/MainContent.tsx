import React, { useRef } from 'react';
import { useAppSelector } from '../store/store';
import { selectQRConfig } from '../features/qrConfig/qrConfigSlice';
import type { RootState } from '../store/store';
import QRForm from './QRForm';
import QRPreview from './QRPreview';
import CustomizationPanel from './CustomizationPanel';
import DownloadOptions from './DownloadOptions';

const MainContent: React.FC = () => {
  const qrCodeRef = useRef<HTMLImageElement | null>(null);
  const qrCode = useAppSelector(state => state.qrConfig.qrCode);
  
  const handleImageRefChange = React.useCallback((ref: HTMLImageElement | null) => {
    if (qrCodeRef.current !== ref) {
      // Clear old ref before setting new one
      if (qrCodeRef.current) {
        qrCodeRef.current = null;
      }
      // Set new ref after a small delay to ensure cleanup
      setTimeout(() => {
        qrCodeRef.current = ref;
      }, 0);
    }
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 md:p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 sm:gap-8 lg:gap-12 mb-8 lg:mb-12">
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
              <QRForm />
            </div>
          </div>
          
          <CustomizationPanel />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
            <QRPreview onImageRefChange={handleImageRefChange} />
          </div>
          
          {qrCode && qrCodeRef.current && (
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
