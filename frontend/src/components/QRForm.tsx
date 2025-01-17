import React, { useEffect } from 'react';
import { useQRCode } from '../context/QRCodeContext';
import { formConfigs } from '../types';
import InputField from './InputField';
import { generateQRCode } from '../services/api';

const QRForm: React.FC = () => {
  const { state, dispatch } = useQRCode();
  const formConfig = formConfigs[state.type];

  const validateForm = () => {
    let isValid = true;
    formConfig.fields.forEach((field) => {
      if (field.required && !state.data[field.name]) {
        isValid = false;
      }
      if (field.validation && !field.validation(state.data[field.name] || '')) {
        isValid = false;
      }
    });
    return isValid;
  };

  const handleInputChange = (field: string, value: string) => {
    dispatch({
      type: 'UPDATE_DATA',
      payload: { [field]: value }
    });
  };

  useEffect(() => {
    const generateQR = async () => {
      const isValid = validateForm();
      if (!isValid) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Please fix validation errors'
        });
        return;
      }

      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await generateQRCode(
          state.type,
          state.data,
          state.customization
        );
        dispatch({
          type: 'SET_QR_CODE',
          payload: response.data?.qrCode || null
        });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to generate QR code'
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    const debounceTimer = setTimeout(() => {
      generateQR();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [state.data, state.type, state.customization]);

  return (
    <div className="space-y-4">
      {formConfig.fields.map((field) => {
        const value = state.data[field.name] || '';
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
  );
};

export default QRForm;