import React, { useCallback, useState } from 'react';
import { useAppDispatch } from '../store/store';
import { setLogo } from '../features/qrConfig/qrConfigSlice';

interface LogoUploaderProps {
  disabled?: boolean;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ disabled = false }) => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<string>('');
  const inputId = 'logo-upload-input';

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      
      const file = event.target.files?.[0];
      if (file) {
        setStatus('Loading...');
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setStatus('Error: Please upload an image file');
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setStatus('Error: File size should be less than 5MB');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            dispatch(setLogo(e.target.result as string));
            setStatus(`Successfully uploaded: ${file.name}`);
          }
        };
        reader.onerror = () => {
          setStatus('Error: Failed to read file');
        };
        reader.readAsDataURL(file);
      }
    },
    [dispatch, disabled]
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      (event.target as HTMLElement).click();
    }
  };

  return (
    <div 
      role="region" 
      aria-label="Logo upload section"
    >
      <label 
        htmlFor={inputId}
        className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'} mb-1`}
      >
        Upload QR Code Logo
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="Choose logo image file"
          aria-describedby="logo-upload-help logo-upload-status"
          className={`block w-full text-sm ${
            disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300'
          }
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${
              disabled
                ? 'file:bg-gray-100 file:text-gray-400'
                : 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200 dark:hover:file:bg-gray-500'
            }`}
        />
      </div>
      <div 
        id="logo-upload-help" 
        className="mt-1 text-sm text-gray-500"
      >
        Upload a PNG, JPG, or SVG image (max 5MB)
      </div>
      {status && (
        <div
          id="logo-upload-status"
          role="status"
          aria-live="polite"
          className={`mt-2 text-sm ${status.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}
        >
          {status}
        </div>
      )}
    </div>
  );
};

export default LogoUploader;
