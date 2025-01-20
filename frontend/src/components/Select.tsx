import React, { useEffect } from 'react';

interface SelectProps<T extends string> {
  label: string;
  value?: T;
  options: T[];
  onChange: (value: T) => void;
  placeholder?: string;
}

const Select = <T extends string>({ label, value, options, onChange }: SelectProps<T>) => {
  const selectedValue = value ?? options[0];

  useEffect(() => {
    if (!value && options.length > 0) {
      onChange(options[0]);
    }
  }, [value, options, onChange]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        value={selectedValue}
        onChange={(e) => {
          const newValue = e.target.value as T;
          onChange(newValue);
        }}
        className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
