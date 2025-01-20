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

interface QRPreviewProps {
  onImageRefChange?: (ref: HTMLImageElement | null) => void;
}

const QRPreview: React.FC<QRPreviewProps> = ({ onImageRefChange }) => {
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
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Keep track of the last valid QR code
  const [lastValidQRCode, setLastValidQRCode] = useState<string | null>(null);
  
  useEffect(() => {
    if (qrCode) {
      setLastValidQRCode(qrCode);
    }
  }, [qrCode]);

  // Clear last valid QR code when type changes
  useEffect(() => {
    setLastValidQRCode(null);
  }, [type]);

  // Simple ref effect without ResizeObserver
  useEffect(() => {
    if (imgRef.current) {
      onImageRefChange?.(imgRef.current);
    }
    return () => {
      onImageRefChange?.(null);
    };
  }, [onImageRefChange, qrCode]); // Include qrCode in deps to ensure ref updates when QR changes

  // Focus management when QR code is generated
  useEffect(() => {
    if (qrCode && previewRef.current) {
      previewRef.current.focus();
    }
  }, [qrCode]);

  const wrapperClasses = "flex flex-col items-center";
  const containerClasses = "flex flex-col items-center w-full max-w-[320px] h-[320px]";
  const previewClasses = "w-full h-full flex items-center justify-center relative overflow-hidden";

  if (loading) {
    return (
      <div className={wrapperClasses}>
        <div className={containerClasses}>
          <div 
            className={previewClasses}
            role="status"
            aria-live="polite"
            aria-label="Loading QR Code"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 animate-pulse"></div>
            <div className="relative flex flex-col items-center space-y-6">
              <div className="animate-spin rounded-full h-20 w-20 border-[6px] border-blue-500/20 border-t-blue-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]"></div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium tracking-wide">Generating QR Code...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={wrapperClasses}>
        <div className={containerClasses}>
          <div 
            className={previewClasses}
            role="alert"
            aria-live="assertive"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10"></div>
            <div className="relative text-center space-y-4">
              <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-red-600 dark:text-red-400 font-medium">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!qrCode && !lastValidQRCode) {
    return (
      <div className={wrapperClasses}>
        <div className={containerClasses}>
          <div 
            className={`${previewClasses} bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-400`}
            role="status"
            aria-label="QR Code Preview Empty State"
          >
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
            <div className="w-full h-full flex flex-col justify-start p-2">
              <div className="w-full relative text-center mt-0">
                <svg
                  className="w-64 h-64 text-gray-400 dark:text-gray-500 mx-auto"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinejoin="round"
                >
                  <rect x="5.5" y="15" width="3.5" height="3.5" />
                  <rect x="15" y="5.5" width="3.5" height="3.5" />
                  <rect x="5.5" y="5.5" width="3.5" height="3.5" />
                  <rect x="11.75" y="5.5" width="0.5" height="0.5" />
                  <rect x="11.75" y="8.625" width="0.5" height="0.5" />
                  <rect x="8.625" y="11.75" width="0.5" height="0.5" />
                  <rect x="11.75" y="14.875" width="0.5" height="0.5" />
                  <rect x="11.75" y="18" width="0.5" height="0.5" />
                  <rect x="5.5" y="11.75" width="0.5" height="0.5" />
                  <rect x="11.75" y="11.75" width="0.5" height="0.5" />
                  <rect x="14.875" y="11.75" width="0.5" height="0.5" />
                  <rect x="18" y="11.75" width="0.5" height="0.5" />
                  <rect x="14.875" y="14.875" width="0.5" height="0.5" />
                  <rect x="18" y="14.875" width="0.5" height="0.5" />
                  <rect x="14.875" y="18" width="0.5" height="0.5" />
                  <rect x="18" y="18" width="0.5" height="0.5" />
                </svg>
                <div className="-mt-4">
                  <div className="text-gray-900 dark:text-gray-100 font-semibold">
                    No QR Code Generated
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Enter your content to generate a QR code
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQRCode = qrCode || lastValidQRCode;
  const imageKey = currentQRCode || 'placeholder';

  return (
    <div className={wrapperClasses}>
      <div className={containerClasses}>
        <div
          ref={previewRef}
          className={previewClasses}
          tabIndex={-1}
          role="region"
          aria-label="QR Code Preview"
        >
          <div className="w-full h-full flex items-center justify-center">
            {currentQRCode && (
              <img
                key={imageKey}
                ref={imgRef}
                src={currentQRCode}
                alt="Generated QR Code"
                className={`w-[98%] aspect-square object-contain transform transition-all duration-300 hover:scale-105 ${
                  !qrCode ? 'opacity-50' : ''
                }`}
                style={{ backgroundColor: bgColor }}
                data-testid="qr-code-preview"
                loading="eager"
                role="img"
                aria-label="Generated QR Code Preview"
                onLoad={() => {
                  if (qrCode && imgRef.current) {
                    onImageRefChange?.(imgRef.current);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPreview;
