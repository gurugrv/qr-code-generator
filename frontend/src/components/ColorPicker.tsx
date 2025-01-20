import React, { useState, useRef } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  label, 
  value, 
  onChange, 
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const inputId = `color-picker-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div role="group" aria-labelledby={`${inputId}-label`}>
      <label 
        id={`${inputId}-label`}
        htmlFor={inputId}
        className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'} mb-1`}
      >
        {label}
      </label>
      <div className="flex items-center">
        <input
          id={inputId}
          type="color"
          value={value}
          onChange={(e) => {
            const newColor = e.target.value;
            onChange(newColor);
            setAnnouncement(`${label} color changed to ${newColor}`);
            // Clear announcement after screen reader has time to read it
            setTimeout(() => setAnnouncement(''), 1000);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsOpen(true);
            }
          }}
          onBlur={() => setIsOpen(false)}
          className={`w-8 h-8 rounded-md border ${
            disabled 
              ? 'border-gray-200 cursor-not-allowed opacity-50' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          disabled={disabled}
          aria-label={`Choose ${label.toLowerCase()}`}
          aria-expanded={isOpen}
          role="combobox"
          aria-haspopup="true"
        />
        {/* Screen reader announcement */}
        <div 
          role="status" 
          aria-live="polite" 
          className="sr-only"
        >
          {announcement}
        </div>
        <span 
          className={`ml-2 text-sm ${
            disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'
          }`}
          aria-label={`Current color value: ${value}`}
        >
          {value.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default ColorPicker;
