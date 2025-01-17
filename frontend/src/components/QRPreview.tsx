import React, { useEffect } from 'react';
import { useQRCode } from '../context/QRCodeContext';
import { generateQRCode } from '../services/api';

const QRPreview: React.FC = () => {
  const { state, dispatch } = useQRCode();

  useEffect(() => {
    const generateCode = async () => {
      if (!state.type || Object.keys(state.data).length === 0) return;

      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const result = await generateQRCode(
          state.type,
          state.data,
          state.customization
        );
        
        if (result.status === 'success' && result.data) {
          dispatch({ type: 'SET_QR_CODE', payload: result.data.qrCode });
        } else {
          dispatch({ type: 'SET_ERROR', payload: result.message || 'Failed to generate QR code' });
        }
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to generate QR code'
        });
      }
    };

    generateCode();
  }, [state.type, state.data, state.customization, dispatch]);

  if (state.loading) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-64 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-64 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center p-4 text-center text-red-500">
          {state.error}
        </div>
      </div>
    );
  }

  if (!state.qrCode) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-64 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center p-4 text-center text-gray-500">
          Fill in the form to generate a QR code
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-64 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <img
          src={state.qrCode}
          alt="Generated QR Code"
          className="w-48 h-48"
          data-testid="qr-code-preview"
        />
      </div>
      <div className="mt-4 space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          onClick={() => navigator.clipboard.writeText(state.qrCode || '')}
          disabled={!state.qrCode}
        >
          Copy Link
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
          onClick={() => {
            if (state.qrCode) {
              const link = document.createElement('a');
              link.href = state.qrCode;
              link.download = `qrcode-${state.type.toLowerCase()}.png`;
              link.click();
            }
          }}
          disabled={!state.qrCode}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default QRPreview;
