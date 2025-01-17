import React, { useCallback } from 'react';

interface LogoUploaderProps {
  onUpload: (logo: string) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ onUpload }) => {
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    [onUpload]
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Logo
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 dark:text-gray-300
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
          dark:file:bg-gray-600 dark:file:text-gray-200
          dark:hover:file:bg-gray-500"
      />
    </div>
  );
};

export default LogoUploader;