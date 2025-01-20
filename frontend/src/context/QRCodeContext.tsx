import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { QRCodeType, QRPatternType } from '../shared/types';

type QRCodeState = {
  type: QRCodeType;
  data: {
    content: string;
    [key: string]: unknown;
  };
  customization: {
    backgroundColor: string;
    size: number;
    margin: number;
    foregroundColor: string;
    logo: string | null;
    patternType: QRPatternType;
    patternColor: string;
  };
  loading: boolean;
  error: string | null;
  qrCode: string | null;
};

type QRCodeAction =
  | { type: 'SET_TYPE'; payload: QRCodeType }
  | { type: 'SET_DATA'; payload: { content: string; [key: string]: unknown } }
  | { type: 'SET_CUSTOMIZATION'; payload: QRCodeState['customization'] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_QR_CODE'; payload: string | null }
  | { type: 'RESET_STATE' };

type QRCodeContextType = {
  state: QRCodeState;
  dispatch: React.Dispatch<QRCodeAction>;
};

const QRCodeContext = createContext<QRCodeContextType | undefined>(undefined);

const initialState: QRCodeState = {
  type: 'URL',
  data: {
    content: ''
  },
  customization: {
    backgroundColor: '#ffffff',
    size: 300,
    margin: 4,
    foregroundColor: '#000000',
    logo: null,
    patternType: 'squares',
    patternColor: '#000000'
  },
  loading: false,
  error: null,
  qrCode: null
};

function qrCodeReducer(state: QRCodeState, action: QRCodeAction): QRCodeState {
  switch (action.type) {
    case 'SET_TYPE':
      return { ...state, type: action.payload };
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_CUSTOMIZATION':
      return { ...state, customization: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_QR_CODE':
      return { ...state, qrCode: action.payload };
    case 'RESET_STATE':
      return initialState;
    default: {
      const _exhaustiveCheck: never = action;
      return state;
    }
  }
}

export function QRCodeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(qrCodeReducer, initialState);

  useEffect(() => {
    return () => {
      dispatch({ type: 'RESET_STATE' });
    };
  }, []);

  return (
    <QRCodeContext.Provider value={{ state, dispatch }}>
      {children}
    </QRCodeContext.Provider>
  );
}

export function useQRCode() {
  const context = useContext(QRCodeContext);
  if (context === undefined) {
    throw new Error('useQRCode must be used within a QRCodeProvider');
  }
  return context;
}