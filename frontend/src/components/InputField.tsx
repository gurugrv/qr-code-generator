import React, { useState, useEffect } from 'react';
import { FormField } from '../types';
interface InputFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  isValid?: boolean;
  errorMessage?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  field,
  value,
  onChange,
  isValid = true,
  errorMessage
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (inputValue !== value) {
      onChange(inputValue);
    }
  };

  const getInputIcon = () => {
    switch (field.type) {
      case 'email':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'url':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 'tel':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
    }
  };

  const baseInputClasses = `
    w-full rounded-lg border-2 border-gray-400 dark:border-white focus:outline-0 focus-visible:outline-0 focus:ring-0 focus:border-gray-400 dark:focus:border-white
    py-3
    h-12
    ${isValid
      ? ''
      : 'border-secondary-dark'}
    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-500
  `;

  return (
    <div className="mb-6">
      <div className="relative">
        {field.type === 'select' ? (
          <div className="relative">
            <select
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
              className={`${baseInputClasses} appearance-none`}
            >
              <option value="" disabled hidden>
                {field.placeholder}
              </option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        ) : field.type === 'textarea' ? (
          <div className="relative">
            <div className="relative">
            <div className={`absolute left-3 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none transition-all duration-200 ${isFocused || value ? 'top-[1.1rem]' : 'top-[0.875rem]'}`}>
                <div className="flex items-center justify-center w-5 h-5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <textarea
                value={value}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
                className={`${baseInputClasses} min-h-[120px] resize-y pl-10`}
                required={field.required}
                placeholder={field.label}
                />
              </div>
          </div>
        ) : (
          <div className="relative">
            <div className={`absolute left-3 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none transition-all duration-200 ${isFocused || value ? 'top-[1.1rem]' : 'top-[0.875rem]'}`}>
              <div className="flex items-center justify-center w-5 h-5">
                {getInputIcon()}
              </div>
            </div>
            <input
              type={field.type}
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
              className={`${baseInputClasses} px-3 pl-10`}
              required={field.required}
              placeholder={field.label}
            />
          </div>
        )}
      </div>
      {errorMessage && (isFocused || value) && !isValid && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
};

export default InputField;
