import React, { useState, useEffect } from 'react';
import { FormField } from '../types';
interface InputFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  isValid?: boolean;
  errorMessage?: string;
  id?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  field,
  value,
  onChange,
  isValid = true,
  errorMessage,
  id = `field-${field.name}`
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

  if (!field) {
    return <div className="text-red-500">Invalid field configuration</div>;
  }

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
    w-full
    rounded-xl
    border
    border-gray-200
    dark:border-gray-600
    py-3
    h-12
    px-3
    transition-all
    duration-200
    ease-in-out
    shadow-sm
    hover:shadow-md
    focus:shadow-lg
    ${isValid
      ? 'hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20'
      : 'border-red-300 dark:border-red-500 hover:border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'}
    bg-white
    dark:bg-gray-800
    text-gray-900
    dark:text-gray-100
    placeholder-gray-400
    dark:placeholder-gray-500
    hover:bg-gray-50
    dark:hover:bg-gray-750
    focus:outline-none
    focus:bg-white
    dark:focus:bg-gray-800
  `;

  return (
    <div className="mb-6">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200"
      >
        {field.label}
        {field.required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="relative">
        {field.type === 'select' ? (
          <div className="relative group">
            <select
              id={id}
              value={value || field.options?.[0] || ''}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
              className={`${baseInputClasses} pl-3 pr-10 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat`}
              aria-invalid={!isValid}
              aria-describedby={errorMessage ? `${id}-error` : undefined}
            >
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ) : field.type === 'textarea' ? (
          <div className="relative group">
            <div className="relative">
              <div className={`absolute left-3 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none transition-all duration-200 group-hover:text-gray-500 dark:group-hover:text-gray-400 ${isFocused || value ? 'top-[1.1rem]' : 'top-[0.875rem]'}`}>
                <div className="flex items-center justify-center w-5 h-5 transition-transform duration-200 group-focus-within:scale-110">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <textarea
                id={id}
                value={value}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                className={`${baseInputClasses} min-h-[120px] resize-y pl-10`}
                required={field.required}
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                aria-label={field.label}
                aria-invalid={!isValid}
                aria-describedby={errorMessage ? `${id}-error` : undefined}
              />
              </div>
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute left-3 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none h-full transition-colors duration-200 group-hover:text-gray-500 dark:group-hover:text-gray-400">
              <div className="flex items-center justify-center w-5 h-5 transition-transform duration-200 group-focus-within:scale-110">
                {getInputIcon()}
              </div>
            </div>
            <input
              id={id}
              type={field.type}
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
              className={`${baseInputClasses} px-3 pl-10`}
              required={field.required}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              aria-label={field.label}
              aria-invalid={!isValid}
              aria-describedby={errorMessage ? `${id}-error` : undefined}
            />
          </div>
        )}
      </div>
      <div className="min-h-[2rem] mt-1">
        {errorMessage && (isFocused || value) && !isValid && (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-sm text-red-500 dark:text-red-400 flex items-center space-x-2 animate-fadeIn"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="leading-tight">{errorMessage}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default InputField;
