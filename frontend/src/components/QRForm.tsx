import React, { useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { QRCodeTypeValues, QRCodeType } from '../types';
import { formConfigs } from './QRFormConfig';
import InputField from './InputField';
import MapSelector from './MapSelector';
import {
  setContent,
  setError,
  generateQR,
  setLocationContent
} from '../features/qrConfig/qrConfigSlice';

const QRForm: React.FC = React.memo(() => {
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { type, contentByType } = useAppSelector((state) => state.qrConfig);
  const content = contentByType[type] || {};
  const formConfig = formConfigs[type];

  const validateForm = () => {
    if (!content) {
      return false;
    }

    // Validate all required fields
    for (const field of formConfig?.fields || []) {
      if (field.required && !content[field.name]) {
        return false;
      }
      
      if (field.validation && !field.validation(content[field.name] || '')) {
        return false;
      }
    }

    return true;
  };

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!formConfig) {
      return;
    }
    if (!validateForm()) {
      const errors = formConfig.fields
        .filter(field => {
          const value = content[field.name] || '';
          return (field.required && !value) ||
                 (field.validation && !field.validation(value));
        })
        .map(field => {
          if (field.required && !content[field.name]) {
            return field.errorMessage || `${field.label} is required`;
          }
          if (field.validation && !field.validation(content[field.name] || '')) {
            return field.errorMessage || `Invalid ${field.label}`;
          }
          return '';
        })
        .filter(msg => msg !== '');
      
      if (errors.length > 0) {
        const errorMessage = errors.join(', ');
        dispatch(setError(errorMessage));
        // Focus error message for screen readers
        if (errorRef.current) {
          errorRef.current.focus();
        }
        return;
      }
    }
    const qrData = content;

    dispatch(generateQR(qrData));
  };

  // Handle keyboard submission
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        handleGenerate();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate]);

  const handleInputChange = (field: string, value: string) => {
    const currentContent = contentByType[type] || {};
    const newValue = ['latitude', 'longitude'].includes(field) ? Number(value) : value;
    dispatch(setContent({
      ...currentContent,
      [field]: newValue
    }));
    dispatch(setError(null)); // Clear any previous errors
  };

  if (!formConfig) {
    return <div className="text-red-500">Invalid QR code type selected</div>;
  }

  return (
    <form 
      ref={formRef}
      onSubmit={handleGenerate}
      className="space-y-1 sm:space-y-2"
      role="form"
      aria-label="QR Code Generator Form"
    >
      {/* Error Message Region */}
      {content.error && (
        <div
          ref={errorRef}
          role="alert"
          aria-live="polite"
          tabIndex={-1}
          className="p-4 bg-red-100 text-red-700 rounded-lg"
        >
          {content.error}
        </div>
      )}
      <div
        className="grid grid-cols-1 md:grid-cols-2 -my-1 gap-x-4"
        role="group"
        aria-label="QR Code Content Fields"
      >
        {type === QRCodeTypeValues.LOCATION && (
          <>
            <div className="md:col-span-2 mb-4">
              <MapSelector
                onLocationSelect={(lat, lng) => {
                  dispatch(setLocationContent({
                    latitude: lat,
                    longitude: lng
                  }));
                }}
                initialLat={Number(content['latitude']) || 0}
                initialLng={Number(content['longitude']) || 0}
              />
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              {formConfig.fields
                .filter(field => ['latitude', 'longitude'].includes(field.name))
                .map(field => (
                  <div key={field.name} role="group" aria-label={field.label}>
                    <InputField
                      field={field}
                      value={content[field.name] !== undefined ? String(content[field.name]) : ''}
                      onChange={(value) => handleInputChange(field.name, value)}
                      isValid={true}
                    />
                  </div>
                ))}
            </div>
          </>
        )}
        {formConfig.fields
          .filter(field => type !== QRCodeTypeValues.LOCATION || !['latitude', 'longitude'].includes(field.name))
          .map((field) => {

          // Special handling for address fields
          if (['city', 'postcode', 'country'].includes(field.name)) {
            return (
              <div 
                key={field.name}
                className="md:col-span-2 grid grid-cols-3 gap-x-4"
              >
                {field.name === 'city' && (
                  <>
                    <div role="group" aria-label="City">
                      <InputField
                        field={field}
                        value={content[field.name] || ''}
                        onChange={(value) => handleInputChange(field.name, value)}
                        isValid={true}
                      />
                    </div>
                    {formConfig.fields.map((innerField) => {
                      if (innerField.name === 'postcode') {
                        return (
                          <div key={innerField.name} role="group" aria-label="Postcode">
                            <InputField
                              field={innerField}
                              value={content[innerField.name] || ''}
                              onChange={(value) => handleInputChange(innerField.name, value)}
                              isValid={true}
                            />
                          </div>
                        );
                      }
                      if (innerField.name === 'country') {
                        return (
                          <div key={innerField.name} role="group" aria-label="Country">
                            <InputField
                              field={innerField}
                              value={content[innerField.name] || ''}
                              onChange={(value) => handleInputChange(innerField.name, value)}
                              isValid={true}
                            />
                          </div>
                        );
                      }
                      return null;
                    })}
                  </>
                )}
              </div>
            );
          }
          
          // Regular fields
          return (
            <div 
              key={field.name} 
              className={`${field.name === 'address' ? 'md:col-span-2' : ''}`}
              role="group"
              aria-label={field.label}
            >
              <InputField
                field={field}
                value={content[field.name] || ''}
                onChange={(value) => handleInputChange(field.name, value)}
                isValid={true}
              />
            </div>
          );
        })}
      </div>
      <button
        type="submit"
        className="
          w-full py-4 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-white text-base sm:text-lg
          bg-gradient-to-r from-blue-500 to-blue-600
          hover:from-blue-600 hover:to-blue-700
          active:from-blue-700 active:to-blue-800
          transform transition-all duration-200
          hover:scale-[1.02] active:scale-[0.98]
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          shadow-lg hover:shadow-xl
          flex items-center justify-center space-x-2
          min-h-[48px] sm:min-h-[44px]
        "
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Generate QR Code</span>
      </button>
    </form>
  );
});

export default QRForm;
