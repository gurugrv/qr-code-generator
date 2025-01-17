import React from 'react';
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const inputClasses = `w-full p-2 rounded-md border ${
    isValid
      ? 'border-gray-300 dark:border-gray-600'
      : 'border-red-500 dark:border-red-600'
  } bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300`;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {field.name}
      </label>
      {field.type === 'select' ? (
        <select
          value={value}
          onChange={handleChange}
          className={inputClasses}
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          value={value}
          onChange={handleChange}
          className={inputClasses}
          required={field.required}
        />
      )}
      {errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputField;