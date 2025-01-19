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
const content = contentByType[type] as string || '';
  const formConfig = formConfigs[type];

  const validateForm = () => {
    if (!content) {
      return false;
    }

    // Get the main field based on the current type
    let mainField;
    let validationValue: string;
    
    switch (type) {
      case QRCodeTypeValues.URL:
        mainField = formConfig.fields.find(f => f.name === 'url');
        validationValue = content as string;
        break;
      case QRCodeTypeValues.TEXT:
        mainField = formConfig.fields.find(f => f.name === 'text');
        validationValue = content as string;
        break;
      case QRCodeTypeValues.EMAIL:
        mainField = formConfig.fields.find(f => f.name === 'email');
        validationValue = content as string;
        break;
      case QRCodeTypeValues.PHONE:
        mainField = formConfig.fields.find(f => f.name === 'phone');
        validationValue = content as string;
        break;
      case QRCodeTypeValues.WIFI:
        mainField = formConfig.fields.find(f => f.name === 'ssid');
        validationValue = content as string;
        break;
      case QRCodeTypeValues.VCARD:
        mainField = formConfig.fields.find(f => f.name === 'name');
        validationValue = content as string;
        break;
      default:
        return false;
    }

    if (!mainField) {
      return false;
    }

    if (mainField.validation && !mainField.validation(validationValue)) {
      return false;
    }

    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    // Update the content based on the field type
    switch (type as QRCodeType) {
      case QRCodeTypeValues.URL:
        if (field === 'url') {
          dispatch(setContent(value));
          dispatch(setError(null)); // Clear any previous errors
        }
        break;
      case QRCodeTypeValues.TEXT:
        if (field === 'text') {
          dispatch(setContent(value));
          dispatch(setError(null));
        }
        break;
      case QRCodeTypeValues.EMAIL:
        if (field === 'email') {
          dispatch(setContent(value));
          dispatch(setError(null));
        }
        break;
      case QRCodeTypeValues.PHONE:
        if (field === 'phone') {
          dispatch(setContent(value));
          dispatch(setError(null));
        }
        break;
      case QRCodeTypeValues.WIFI:
        if (field === 'ssid') {
          dispatch(setContent(value));
          dispatch(setError(null));
        }
        break;
      case QRCodeTypeValues.VCARD:
        if (field === 'name') {
          dispatch(setContent(value));
          dispatch(setError(null));
        }
        break;
      default:
        break;
    }
  };

  const handleGenerate = () => {
    if (!validateForm()) {
      const mainField = formConfig.fields[0];
      dispatch(setError(mainField.errorMessage || 'Invalid input'));
      return;
    }
    dispatch(generateQR());
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {formConfig.fields.map((field) => {
          let value = '';
          switch (type) {
            case QRCodeTypeValues.URL:
              value = field.name === 'url' ? (content as string) : '';
              break;
            case QRCodeTypeValues.TEXT:
              value = field.name === 'text' ? (content as string) : '';
              break;
            case QRCodeTypeValues.EMAIL:
              value = field.name === 'email' ? (content as string) : '';
              break;
            case QRCodeTypeValues.PHONE:
              value = field.name === 'phone' ? (content as string) : '';
              break;
            case QRCodeTypeValues.WIFI:
              value = field.name === 'ssid' ? (content as string) : '';
              break;
            case QRCodeTypeValues.VCARD:
              value = field.name === 'name' ? (content as string) : '';
              break;
            default:
              value = '';
          }
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
