import React, { useCallback } from 'react';

interface LogoUploaderProps {
  onUpload: (logo: string) => void;
  disabled?: boolean;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ onUpload, disabled = false }) => {
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onUpload(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [onUpload, disabled]
  );

  return (
    <div>
      <label className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'} mb-1`}>
        Logo
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className={`block w-full text-sm ${
          disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300'
        }
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          ${
            disabled
              ? 'file:bg-gray-100 file:text-gray-400'
              : 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200 dark:hover:file:bg-gray-500'
          }`}
      />
    </div>
  );
};

export default LogoUploader;