import React from 'react';
import { useQRCode } from '../context/QRCodeContext';
import { QRCodeTypeValues } from '../shared/types';

const QRTypeSelector: React.FC = () => {
  const { state, dispatch } = useQRCode();

  const handleTypeChange = (type: typeof QRCodeTypeValues[keyof typeof QRCodeTypeValues]) => {
    dispatch({ type: 'SET_TYPE', payload: type });
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        QR Code Type
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.values(QRCodeTypeValues).map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`p-2 rounded-md text-sm font-medium transition-colors
              ${
                state.type === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QRTypeSelector;
