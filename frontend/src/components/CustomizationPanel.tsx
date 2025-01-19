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

  const { contentByType, type, qrCode } = useAppSelector(selectQRConfig);
  const content = contentByType[type];

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
        

        <div className="pt-4 border-t-2 border-gray-100 dark:border-gray-700 space-y-4">
          <LogoUploader disabled={loading} />
          
          <button
            onClick={() => dispatch(generateQR())}
            disabled={loading || !content}
            className="
              w-full py-2 px-4 rounded-lg font-medium text-white
              bg-gradient-to-r from-green-500 to-green-600
              hover:from-green-600 hover:to-green-700
              active:from-green-700 active:to-green-800
              disabled:from-gray-400 disabled:to-gray-500
              transform transition-all duration-200
              hover:scale-[1.02] active:scale-[0.98]
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
              shadow-md hover:shadow-lg
              disabled:cursor-not-allowed
              flex items-center justify-center space-x-2
            "
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Apply Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
