import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setFgColor, setBgColor, setSize, generateQR, selectQRConfig, resetConfig, setContent } from '../features/qrConfig/qrConfigSlice';
import ColorPicker from './ColorPicker';
import LogoUploader from './LogoUploader';
import { useDebounce } from '../hooks/useDebounce';
import Tooltip from './Tooltip';

const CustomizationPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.qrConfig.loading);
  const fgColor = useAppSelector((state) => state.qrConfig.fgColor);
  const bgColor = useAppSelector((state) => state.qrConfig.bgColor);
  const size = useAppSelector((state) => state.qrConfig.size);

  const { contentByType, type, qrCode } = useAppSelector(selectQRConfig);
  const content = contentByType[type];

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border-2 border-gray-100 dark:border-gray-700"
      role="region"
      aria-label="QR Code Customization Options"
    >
      <h3 
        className="text-lg font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100"
        id="customization-heading"
      >
        Customize QR Code
      </h3>
      <div 
        className="space-y-4 sm:space-y-6"
        role="group"
        aria-labelledby="customization-heading"
      >
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          role="group"
          aria-label="Color Selection"
        >
          <Tooltip content="Choose the color for the QR code pattern">
            <div role="group" aria-label="Foreground Color Selection">
              <ColorPicker
                label="Foreground Color"
                value={fgColor}
                onChange={(color: string) => dispatch(setFgColor(color))}
                disabled={loading}
              />
            </div>
          </Tooltip>
          <Tooltip content="Choose the color for the QR code background">
            <div role="group" aria-label="Background Color Selection">
              <ColorPicker
                label="Background Color"
                value={bgColor}
                onChange={(color: string) => dispatch(setBgColor(color))}
                disabled={loading}
              />
            </div>
          </Tooltip>
        </div>
        

        <div 
          className="pt-4 sm:pt-6 border-t-2 border-gray-100 dark:border-gray-700 space-y-4 sm:space-y-6"
          role="group"
          aria-label="Additional Customization Options"
        >
          <Tooltip content="Add your logo or image to the center of the QR code">
            <div role="group" aria-label="Logo Upload">
              <LogoUploader disabled={loading} />
            </div>
          </Tooltip>
          
          <div className="flex gap-4">
            <Tooltip content="Reset all customizations to default settings">
              <button
                onClick={async () => {
                  const currentContent = contentByType[type];
                  dispatch(resetConfig());
                  dispatch(setContent(currentContent));
                  dispatch(generateQR(currentContent));
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const currentContent = contentByType[type];
                    dispatch(resetConfig());
                    dispatch(setContent(currentContent));
                    dispatch(generateQR(currentContent));
                  }
                }}
                disabled={loading}
                className="
                  w-full py-4 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-white text-base sm:text-lg
                  bg-gradient-to-r from-red-500 to-red-600
                  hover:from-red-600 hover:to-red-700
                  active:from-red-700 active:to-red-800
                  disabled:from-gray-400 disabled:to-gray-500
                  transform transition-all duration-200
                  hover:scale-[1.02] active:scale-[0.98]
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
                  shadow-md hover:shadow-lg
                  disabled:cursor-not-allowed
                  flex items-center justify-center space-x-2
                  min-h-[48px] sm:min-h-[44px]
                "
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset</span>
                <span className="sr-only">QR code customizations</span>
              </button>
            </Tooltip>
            <Tooltip content="Generate QR code with current customization settings">
              <button
                onClick={() => {
                  dispatch(generateQR(content));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dispatch(generateQR(content));
                  }
                }}
                disabled={loading || !content}
                className="
                  w-full py-4 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-white text-base sm:text-lg
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
                  min-h-[48px] sm:min-h-[44px]
                "
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Apply Changes</span>
                <span className="sr-only">to QR code customization</span>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
