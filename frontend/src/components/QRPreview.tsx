import React, { useEffect, useCallback, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/store';
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

  const handleDownload = useCallback(async () => {
    if (qrCode) {
      // Create a new image with the download size
      try {
        const img = new Image();
        img.src = qrCode;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const canvas = document.createElement('canvas');
        canvas.width = downloadSize;
        canvas.height = downloadSize;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Draw with background color first
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, downloadSize, downloadSize);
          
          // Draw the QR code image scaled to download size
          ctx.drawImage(img, 0, 0, downloadSize, downloadSize);
          
          // Convert to PNG and download
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = 'qrcode.png';
          link.click();
        }
      } catch (error) {
        console.error('Error downloading QR code:', error);
      }
    }
  }, [qrCode, downloadSize, bgColor]);

  if (loading) {
    return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-80 h-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 animate-pulse"></div>
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
      <div className="flex flex-col items-center">
        <div className="w-72 h-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center p-6 relative overflow-hidden">
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
      <div className="flex flex-col items-center">
        <div className="w-72 h-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center p-6 relative overflow-hidden">
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
    <div className="flex flex-col items-center space-y-8">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <img
          ref={imgRef}
          src={qrCode}
          alt="Generated QR Code"
          className="w-80 h-80 mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
          style={{ backgroundColor: bgColor }}
          data-testid="qr-code-preview"
          loading="eager"
        />
      </div>
      <div className="w-full max-w-md space-y-6 px-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Quality</span>
            <span>{downloadSize}x{downloadSize}px</span>
          </div>
          <input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={downloadSize}
            onChange={(e) => dispatch(setDownloadSize(Number(e.target.value)))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            className="
              px-4 py-2.5 rounded-lg font-medium text-white
              bg-gradient-to-r from-blue-500 to-blue-600
              hover:from-blue-600 hover:to-blue-700
              active:from-blue-700 active:to-blue-800
              transform transition-all duration-200
              hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              shadow-md hover:shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center space-x-2
            "
            onClick={() => navigator.clipboard.writeText(qrCode || '')}
            disabled={!qrCode}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span>Copy Link</span>
          </button>
          <button
            className="
              px-4 py-2.5 rounded-lg font-medium text-white
              bg-gradient-to-r from-green-500 to-green-600
              hover:from-green-600 hover:to-green-700
              active:from-green-700 active:to-green-800
              transform transition-all duration-200
              hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
              shadow-md hover:shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center space-x-2
            "
            onClick={handleDownload}
            disabled={!qrCode}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRPreview;
