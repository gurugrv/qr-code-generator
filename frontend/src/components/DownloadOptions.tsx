import React, { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Tooltip from './Tooltip';
import { useAppDispatch, useAppSelector, type RootState } from '../store/store';
import { setDownloadSize } from '../features/qrConfig/qrConfigSlice';

interface DownloadOptionsProps {
  qrCodeRef: React.RefObject<HTMLDivElement | null>;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ qrCodeRef }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const downloadSize = useAppSelector((state: RootState) => state.qrConfig.downloadSize);

  const downloadAsPNG = async () => {
    if (!qrCodeRef.current) return;
    
    setIsLoading('PNG');
    setError(null);
    
    try {
      const canvas = await html2canvas(qrCodeRef.current);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      const errorMessage = 'Error downloading PNG file';
      console.error(errorMessage, error);
      setError(errorMessage);
    } finally {
      setIsLoading(null);
    }
  };

  const downloadAsSVG = () => {
    if (!qrCodeRef.current) return;
    
    setIsLoading('SVG');
    setError(null);
    
    try {
      const svgElement = qrCodeRef.current.querySelector('svg');
      if (!svgElement) {
        throw new Error('SVG element not found');
      }

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      const link = document.createElement('a');
      link.download = 'qr-code.svg';
      link.href = svgUrl;
      link.click();
      
      URL.revokeObjectURL(svgUrl);
    } catch (error) {
      const errorMessage = 'Error downloading SVG file';
      console.error(errorMessage, error);
      setError(errorMessage);
    } finally {
      setIsLoading(null);
    }
  };

  const downloadAsPDF = async () => {
    if (!qrCodeRef.current) return;
    
    setIsLoading('PDF');
    setError(null);
    
    try {
      const canvas = await html2canvas(qrCodeRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions to maintain aspect ratio
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('qr-code.pdf');
    } catch (error) {
      const errorMessage = 'Error downloading PDF file';
      console.error(errorMessage, error);
      setError(errorMessage);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div 
      className="flex flex-col space-y-6 p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
      role="region"
      aria-labelledby="download-options-title"
    >
      <div className="flex items-center justify-between">
        <h3 
          id="download-options-title"
          className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
        >
          Download Options
        </h3>
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="text-red-500 text-sm animate-fadeIn"
          >
            {error}
          </div>
        )}
      </div>

      <div className="mt-[4rem] space-y-12">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <label
              htmlFor="quality-slider"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Quality
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {downloadSize}x{downloadSize}px
            </span>
          </div>
          <div className="relative pt-1">
            <input
              id="quality-slider"
              type="range"
              min="200"
              max="2000"
              value={downloadSize}
              onChange={(e) => dispatch(setDownloadSize(Number(e.target.value)))}
              className="
                w-full h-2 rounded-lg appearance-none cursor-pointer
                bg-gray-200 dark:bg-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              "
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((downloadSize - 200) / 1800) * 100}%, #E5E7EB ${((downloadSize - 200) / 1800) * 100}%, #E5E7EB 100%)`
              }}
            />
            <div className="absolute w-full flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-2 justify-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
          <Tooltip
            content="Best for web and social media sharing"
            id="png-tooltip-desc"
          >
            <button
              onClick={downloadAsPNG}
              className="
                group relative flex items-center gap-2 px-3 py-2
                bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/5 dark:to-blue-600/5
                hover:from-blue-500/20 hover:to-blue-600/20
                border border-blue-200 dark:border-blue-500/20
                rounded-xl transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              aria-label="Download QR code as PNG image"
              aria-describedby="png-tooltip-desc"
              disabled={!!isLoading}
              aria-busy={isLoading === 'PNG'}
            >
              {isLoading === 'PNG' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500/20 border-t-blue-500"></div>
              ) : (
                <ArrowDownTrayIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 transform transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              )}
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 min-w-[2.5rem] text-center">PNG</span>
            </button>
          </Tooltip>
          
          <Tooltip
            content="Scalable format, ideal for printing at any size"
            id="svg-tooltip-desc"
          >
            <button
              onClick={downloadAsSVG}
              className="
                group relative flex items-center gap-2 px-3 py-2
                bg-gradient-to-br from-green-500/10 to-green-600/10 dark:from-green-500/5 dark:to-green-600/5
                hover:from-green-500/20 hover:to-green-600/20
                border border-green-200 dark:border-green-500/20
                rounded-xl transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              aria-label="Download QR code as SVG vector image"
              aria-describedby="svg-tooltip-desc"
              disabled={!!isLoading}
              aria-busy={isLoading === 'SVG'}
            >
              {isLoading === 'SVG' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-500/20 border-t-green-500"></div>
              ) : (
                <ArrowDownTrayIcon className="w-5 h-5 text-green-600 dark:text-green-400 transform transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              )}
              <span className="text-sm font-medium text-green-600 dark:text-green-400 min-w-[2.5rem] text-center">SVG</span>
            </button>
          </Tooltip>
          
          <Tooltip
            content="Professional document format with perfect print quality"
            id="pdf-tooltip-desc"
          >
            <button
              onClick={downloadAsPDF}
              className="
                group relative flex items-center gap-2 px-3 py-2
                bg-gradient-to-br from-red-500/10 to-red-600/10 dark:from-red-500/5 dark:to-red-600/5
                hover:from-red-500/20 hover:to-red-600/20
                border border-red-200 dark:border-red-500/20
                rounded-xl transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              aria-label="Download QR code as PDF document"
              aria-describedby="pdf-tooltip-desc"
              disabled={!!isLoading}
              aria-busy={isLoading === 'PDF'}
            >
              {isLoading === 'PDF' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500/20 border-t-red-500"></div>
              ) : (
                <ArrowDownTrayIcon className="w-5 h-5 text-red-600 dark:text-red-400 transform transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              )}
              <span className="text-sm font-medium text-red-600 dark:text-red-400 min-w-[2.5rem] text-center">PDF</span>
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default DownloadOptions;
