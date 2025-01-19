import React from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange, disabled = false }) => {
  return (
    <div>
      <label className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'} mb-1`}>
        {label}
      </label>
      <div className="flex items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-8 h-8 rounded-md border ${
            disabled 
              ? 'border-gray-200 cursor-not-allowed opacity-50' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          disabled={disabled}
        />
        <span className={`ml-2 text-sm ${
          disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'
        }`}>
          {value.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default ColorPicker;