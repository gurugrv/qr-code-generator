import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { QRCodeTypeValues, QRCodeType } from '../types';
import { formConfigs } from './QRFormConfig';
import InputField from './InputField';
import {
  setContent,
  setError,
  generateQR
} from '../features/qrConfig/qrConfigSlice';

const QRForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { type, contentByType } = useAppSelector((state) => state.qrConfig);
const content = contentByType[type] || {};
  const formConfig = formConfigs[type];

  const validateForm = () => {
    if (!content) {
      return false;
    }

    // Validate all required fields
    for (const field of formConfig.fields) {
      if (field.required && !content[field.name]) {
        return false;
      }
      
      if (field.validation && !field.validation(content[field.name] || '')) {
        return false;
      }
    }

    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    const currentContent = contentByType[type] || {};
    dispatch(setContent({
      ...currentContent,
      [field]: value
    }));
    dispatch(setError(null)); // Clear any previous errors
  };

  const handleGenerate = () => {
    if (!validateForm()) {
      const errors = formConfig.fields
        .filter(field => {
          const value = content[field.name] || '';
          return (field.required && !value) ||
                 (field.validation && !field.validation(value));
        })
        .map(field => field.errorMessage || `${field.label} is required`);
      
      dispatch(setError(errors.join(', ')));
      return;
    }
    dispatch(generateQR());
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {formConfig.fields.map((field) => {
          const value = content[field.name] || '';
          const isValid = !field.validation || field.validation(value);
          const isRequiredError = field.required && !value;
          
          return (
            <InputField
              key={field.name}
              field={field}
              value={value}
              onChange={(value) => handleInputChange(field.name, value)}
              isValid={isValid && !isRequiredError}
              errorMessage={
                !isValid
                  ? field.errorMessage
                  : isRequiredError
                  ? 'This field is required'
                  : undefined
              }
            />
          );
        })}
      </div>
      <button
        onClick={handleGenerate}
        className="
          w-full py-3 px-6 rounded-lg font-semibold text-white text-lg
          bg-gradient-to-r from-blue-500 to-blue-600
          hover:from-blue-600 hover:to-blue-700
          active:from-blue-700 active:to-blue-800
          transform transition-all duration-200
          hover:scale-[1.02] active:scale-[0.98]
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          shadow-lg hover:shadow-xl
          flex items-center justify-center space-x-2
        "
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Generate QR Code</span>
      </button>
    </div>
  );
};

export default QRForm;
