import React, { createContext, useReducer, useContext } from 'react';
import { QRCodeTypeValues, QRCodeType, QRCodeState, QRCustomization } from '../types';

interface QRCodeContextState {
  type: QRCodeType;
  data: Record<string, any>;
  customization: QRCustomization;
  loading: boolean;
  error: string | null;
  qrCode: string | null;
}

type Action =
  | { type: 'SET_TYPE'; payload: QRCodeType }
  | { type: 'UPDATE_DATA'; payload: Record<string, any> }
  | { type: 'UPDATE_CUSTOMIZATION'; payload: Partial<QRCustomization> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_QR_CODE'; payload: string | null }
  | { type: 'RESET' };

const initialState: QRCodeContextState = {
  type: QRCodeTypeValues.URL,
  data: {},
  customization: {
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    errorCorrectionLevel: 'H',
    size: 'medium',
    margin: 4,
    logo: null
  },
  loading: false,
  error: null,
  qrCode: null
};

const qrCodeReducer = (state: QRCodeContextState, action: Action): QRCodeContextState => {
  switch (action.type) {
    case 'SET_TYPE':
      return {
        ...state,
        type: action.payload,
        data: {}
      };
    case 'UPDATE_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload
        }
      };
    case 'UPDATE_CUSTOMIZATION':
      return {
        ...state,
        customization: {
          ...state.customization,
          ...action.payload
        }
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
        error: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'SET_QR_CODE':
      return {
        ...state,
        qrCode: action.payload,
        loading: false,
        error: null
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const QRCodeContext = createContext<{
  state: QRCodeContextState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null
});

export const QRCodeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(qrCodeReducer, initialState);

  return (
    <QRCodeContext.Provider value={{ state, dispatch }}>
      {children}
    </QRCodeContext.Provider>
  );
};

export const useQRCode = () => {
  const context = useContext(QRCodeContext);
  if (!context) {
    throw new Error('useQRCode must be used within a QRCodeProvider');
  }
  return context;
};
