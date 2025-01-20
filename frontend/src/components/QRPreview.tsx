import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/store';
import DownloadOptions from './DownloadOptions';
import {
  selectLoading,
  selectError,
  selectQRCode,
  selectFgColor,
  selectBgColor,
  selectSize,
  selectDownloadSize,
  setDownloadSize,
  generateQR
} from '../features/qrConfig/qrConfigSlice';

const QRPreview: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const qrCode = useAppSelector(selectQRCode);
  const fgColor = useAppSelector(selectFgColor);
  const bgColor = useAppSelector(selectBgColor);
  const size = useAppSelector(selectSize);
  const downloadSize = useAppSelector(selectDownloadSize);

  const type = useAppSelector(state => state.qrConfig.type);
  const content = useAppSelector(state => state.qrConfig.contentByType[type]);

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const resizeObserver = new ResizeObserver(() => {
      // Empty callback to prevent the warning
    });

    resizeObserver.observe(img);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const qrContainerRef = useRef<HTMLDivElement>(null);

  const previewRef = useRef<HTMLDivElement>(null);

  // Focus management when QR code is generated
  useEffect(() => {
    if (qrCode && previewRef.current) {
      previewRef.current.focus();
    }
  }, [qrCode]);

  if (loading) {
    return (
    <div 
      className="flex flex-col items-center justify-center min-h-[400px]"
      role="status"
      aria-live="polite"
    >
      <div 
        className="w-80 h-80 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl flex items-center justify-center p-8 relative overflow-hidden border border-gray-100 dark:border-gray-700"
        aria-label="Loading QR Code"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 animate-pulse"></div>
        <div className="relative flex flex-col items-center space-y-6">
          <div className="animate-spin rounded-full h-20 w-20 border-[6px] border-blue-500/20 border-t-blue-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]"></div>
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium tracking-wide">Generating QR Code...</div>
        </div>
      </div>
    </div>
    );
  }

  if (error) {
    return (
      <div 
        className="flex flex-col items-center"
        role="alert"
        aria-live="assertive"
      >
        <div className="w-80 h-80 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl flex items-center justify-center p-8 relative overflow-hidden border border-red-100 dark:border-red-900/30">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10"></div>
          <div className="relative text-center space-y-4">
            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-red-600 dark:text-red-400 font-medium">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!qrCode) {
    return (
      <div 
        className="flex flex-col items-center"
        role="status"
        aria-label="QR Code Preview Empty State"
      >
        <div className="w-80 h-80 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl flex items-center justify-center p-8 relative overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800"></div>
          <div className="relative text-center space-y-4">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-gray-500 dark:text-gray-400 font-medium">
              Please enter content to generate a QR code
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col items-center space-y-8 w-full max-w-2xl mx-auto"
      ref={previewRef}
      tabIndex={-1}
      role="region"
      aria-label="QR Code Preview"
    >
      <div 
        ref={qrContainerRef} 
        className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700"
        role="img"
        aria-label="Generated QR Code Preview"
      >
        <img
          ref={imgRef}
          src={qrCode}
          alt="Generated QR Code"
          className="aspect-square w-64 h-64 object-contain mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-xl"
          style={{ backgroundColor: bgColor }}
          data-testid="qr-code-preview"
          loading="eager"
        />
      </div>
      <div className="w-full max-w-md space-y-6 px-4 animate-fadeIn">
        {qrCode && <DownloadOptions qrCodeRef={qrContainerRef} />}
      </div>
    </div>
  );
};

export default QRPreview;
