import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';
import { QRCodeType, QRCustomization, QRPatternType } from '../../shared/types';
import { generateQRCode } from '../../services/api';
import { validateQRContent } from '../../utils/validation';

interface QRConfigState {
  size: number;
  downloadSize: number;
  fgColor: string;
  bgColor: string;
  contentByType: Record<QRCodeType, string | { platform: string; url: string }>;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  type: QRCodeType;
  loading: boolean;
  error: string | null;
  qrCode: string | null;
  margin: number;
  data: Record<string, any>;
  customization: QRCustomization;
  isCustomPattern: boolean;
  version: number;
  lastGenerated: string | null;
}

const initialState: QRConfigState = {
  size: 300,
  downloadSize: 200,
  fgColor: '#000000',
  bgColor: '#ffffff',
  contentByType: {
    URL: '',
    TEXT: '',
    EMAIL: '',
    PHONE: '',
    WIFI: '',
    VCARD: '',
    SMS: '',
    CALENDAR: '',
    LOCATION: '',
    Social: {
      platform: '',
      url: ''
    }
  },
  errorCorrectionLevel: 'H',
  type: 'URL',
  loading: false,
  error: null,
  qrCode: null,
  margin: 4,
  data: {},
  customization: {
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    errorCorrectionLevel: 'H',
    size: 300,
    margin: 4,
  },
  isCustomPattern: false,
  version: 1,
  lastGenerated: null
};

interface QRCodeResponse {
  qrCode: string;
  metadata: {
    type: QRCodeType;
    createdAt: string;
    customization: QRCustomization;
  };
}

export const generateQR = createAsyncThunk<QRCodeResponse, void, { state: RootState }>(
  'qrConfig/generateQR',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const { contentByType, type, size, fgColor, bgColor, margin, errorCorrectionLevel } = state.qrConfig;
    const content = contentByType[type];
    
    if (!content || !validateQRContent(content, type)) {
      return rejectWithValue('Text is required');
    }
    
    if (size <= 0 || size > 2000) {
      return rejectWithValue('Size must be between 1 and 2000 pixels');
    }

    try {
      const response = await generateQRCode({
        type,
        data: (() => {
          const baseData: {
            text?: string;
            content?: string;
            platform?: string;
            email?: string;
            phone?: string;
          } = {};

          switch (type) {
            case 'TEXT':
              baseData.text = content as string;
              break;
            case 'URL':
              baseData.content = !(content as string).startsWith('http')
                ? `https://${content}`
                : content as string;
              break;
            case 'EMAIL':
              baseData.email = content as string;
              break;
            case 'PHONE': {
              const phoneContent = content as string;
              const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
              if (!phoneRegex.test(phoneContent)) {
                throw new Error('Invalid phone number format');
              }
              baseData.phone = phoneContent.trim();
              break;
            }
            case 'SMS':
              baseData.phone = content as string;
              break;
            default:
              baseData.content = content as string;
          }

          return baseData;
        })(),
        customization: {
          size,
          foregroundColor: fgColor,
          backgroundColor: bgColor,
          margin,
          errorCorrectionLevel
        } as QRCustomization
      });
      
      if (!response.data) {
        return rejectWithValue('No data received from QR code generation');
      }
      
      return {
        qrCode: response.data.qrCode,
        metadata: {
          type: response.data.metadata.type,
          createdAt: response.data.metadata.createdAt,
          customization: response.data.metadata.customization
        }
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const qrConfigSlice = createSlice({
  name: 'qrConfig',
  initialState,
  reducers: {
    setDownloadSize: (state, action: PayloadAction<number>) => {
      state.downloadSize = action.payload;
    },
    toggleCustomPattern: (state) => {
      state.isCustomPattern = !state.isCustomPattern;
    },
    setSize: (state, action: PayloadAction<number>) => {
      state.size = action.payload;
    },
    setFgColor: (state, action: PayloadAction<string>) => {
      state.fgColor = action.payload;
    },
    setBgColor: (state, action: PayloadAction<string>) => {
      state.bgColor = action.payload;
    },
    setContent: (state, action: PayloadAction<string | { platform: string; url: string }>) => {
      state.contentByType[state.type] = action.payload;
    },
    setErrorCorrectionLevel: (
      state,
      action: PayloadAction<'L' | 'M' | 'Q' | 'H'>
    ) => {
      state.errorCorrectionLevel = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setQRCode: (state, action: PayloadAction<string | null>) => {
      state.qrCode = action.payload;
    },
    setMargin: (state, action: PayloadAction<number>) => {
      state.margin = action.payload;
    },
    updateData: (state, action: PayloadAction<Record<string, any>>) => {
      state.data = {
        ...state.data,
        ...action.payload
      };
    },
    resetConfig: () => initialState,
    setType: (state, action: PayloadAction<QRCodeType>) => {
      state.type = action.payload;
      state.qrCode = null; // Reset QR code when changing type
      state.error = null; // Clear any errors
    },
    updateQRConfig: (state, action: PayloadAction<Partial<QRConfigState>>) => {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateQR.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateQR.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.qrCode = action.payload.qrCode;
        state.lastGenerated = action.payload.metadata.createdAt;
      })
      .addCase(generateQR.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.qrCode = null;
      });
  }
});

export const {
  setSize,
  setDownloadSize,
  setFgColor,
  setBgColor,
  setContent,
  setErrorCorrectionLevel,
  setLoading,
  setError,
  setQRCode,
  setMargin,
  updateData,
  resetConfig,
  setType,
  updateQRConfig,
  toggleCustomPattern,
} = qrConfigSlice.actions;

export const selectQRConfig = (state: RootState) => state.qrConfig;
export const selectLoading = (state: RootState) => state.qrConfig.loading;
export const selectError = (state: RootState) => state.qrConfig.error;
export const selectQRCode = (state: RootState) => state.qrConfig.qrCode;
export const selectFgColor = (state: RootState) => state.qrConfig.fgColor;
export const selectBgColor = (state: RootState) => state.qrConfig.bgColor;
export const selectSize = (state: RootState) => state.qrConfig.size;
export const selectDownloadSize = (state: RootState) => state.qrConfig.downloadSize;
export const selectMargin = (state: RootState) => state.qrConfig.margin;
export const selectData = (state: RootState) => state.qrConfig.data;
export const selectCustomization = (state: RootState) => state.qrConfig.customization;

export default qrConfigSlice.reducer;
