import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setFgColor, setBgColor, setSize, generateQR, selectQRConfig } from '../features/qrConfig/qrConfigSlice';
import ColorPicker from './ColorPicker';
import LogoUploader from './LogoUploader';
import { useDebounce } from '../hooks/useDebounce';

const CustomizationPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.qrConfig.loading);
  const fgColor = useAppSelector((state) => state.qrConfig.fgColor);
  const bgColor = useAppSelector((state) => state.qrConfig.bgColor);
  const size = useAppSelector((state) => state.qrConfig.size);

  const debouncedFgColor = useDebounce(fgColor, 500);
  const debouncedBgColor = useDebounce(bgColor, 500);
  const debouncedSize = useDebounce(size, 500);

  const { contentByType, type, qrCode } = useAppSelector(selectQRConfig);
  const content = contentByType[type];

  useEffect(() => {
    if (content) {
      dispatch(generateQR());
    }
  }, [debouncedFgColor, debouncedBgColor, debouncedSize, dispatch, content]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border-2 border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">Customize QR Code</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorPicker
            label="Foreground Color"
            value={fgColor}
            onChange={(color: string) => dispatch(setFgColor(color))}
            disabled={loading}
          />
          <ColorPicker
            label="Background Color"
            value={bgColor}
            onChange={(color: string) => dispatch(setBgColor(color))}
            disabled={loading}
          />
        </div>
        

        <div className="pt-4 border-t-2 border-gray-100 dark:border-gray-700">
          <LogoUploader
            onUpload={(logo: string) => {
              // Logo handling will be implemented in a future update
              console.log('Logo upload not yet implemented');
            }}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
