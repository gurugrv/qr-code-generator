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
  contentByType: Record<QRCodeType, Record<string, any>>;
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
    URL: { url: '' },
    TEXT: { text: '' },
    EMAIL: { email: '', subject: '', body: '' },
    PHONE: { phone: '' },
    WIFI: { ssid: '', password: '', encryption: 'WPA' },
    VCARD: {
      firstName: '',
      lastName: '',
      phone: '',
      mobile: '',
      email: '',
      website: '',
      organization: '',
      jobTitle: '',
      address: '',
      city: '',
      postcode: '',
      country: ''
    },
    SMS: { phone: '', message: '' },
    CALENDAR: { title: '', startDate: '', endDate: '', description: '' },
    SOCIAL: {
      platform: '',
      url: '',
      username: ''
    },
    UPI: {
      vpa: '',
      name: '',
      amount: ''
    },
    LOCATION: {
      latitude: 0,
      longitude: 0,
      name: ''
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
    logo: null,
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

export const generateQR = createAsyncThunk<QRCodeResponse, Record<string, any>, { state: RootState }>(
  'qrConfig/generateQR',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const { contentByType, type, size, fgColor, bgColor, margin, errorCorrectionLevel } = state.qrConfig;
    const content = contentByType[type];
    
    if (!content || !validateQRContent(content, type)) {
      return rejectWithValue('Required fields are missing');
    }
    
    if (size <= 0 || size > 2000) {
      return rejectWithValue('Size must be between 1 and 2000 pixels');
    }

    try {
      const response = await generateQRCode({
        type,
        data: (() => {
          switch (type) {
            case 'TEXT':
              return { text: content.text };
            case 'URL':
              const url = content.url.startsWith('http') ? content.url : `https://${content.url}`;
              return { content: url };
            case 'EMAIL':
              return {
                email: content.email,
                subject: content.subject,
                body: content.body
              };
            case 'PHONE': {
              const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
              if (!phoneRegex.test(content.phone)) {
                throw new Error('Invalid phone number format');
              }
              return { phone: content.phone.trim() };
            }
            case 'WIFI':
              return {
                ssid: content.ssid,
                password: content.password,
                encryption: content.encryption
              };
            case 'VCARD':
              return {
                firstName: content.firstName,
                lastName: content.lastName,
                phone: content.phone,
                mobile: content.mobile,
                email: content.email,
                website: content.website,
                organization: content.organization,
                jobTitle: content.jobTitle,
                address: {
                  street: content.address,
                  city: content.city,
                  postcode: content.postcode,
                  country: content.country
                }
              };
            case 'SMS':
              return {
                phone: content.phone,
                message: content.message
              };
            case 'CALENDAR':
              return {
                title: content.title,
                startDate: content.startDate,
                endDate: content.endDate,
                description: content.description
              };
            case 'SOCIAL':
              return {
                platform: content.platform,
                url: content.url,
                username: content.username
              };
            case 'UPI':
              return {
                vpa: content.vpa,
                name: content.name,
                amount: content.amount
              };
            default:
              return content;
          }
        })(),
        customization: {
          size,
          foregroundColor: fgColor,
          backgroundColor: bgColor,
          margin,
          errorCorrectionLevel,
          logo: state.qrConfig.customization.logo
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
    setContent: (state, action: PayloadAction<Record<string, any>>) => {
      const currentContent = state.contentByType[state.type];
      const newContent = action.payload;
      
      // Only update if values actually changed
      const shouldUpdate = Object.keys(newContent).some(
        key => currentContent[key] !== newContent[key]
      );
      
      if (shouldUpdate) {
        state.contentByType[state.type] = {
          ...currentContent,
          ...newContent
        };
      }
    },
    setLocationContent: (state, action: PayloadAction<{name?: string, latitude?: number, longitude?: number}>) => {
      if (state.type !== 'LOCATION') return;
      
      const currentContent = state.contentByType[state.type];
      const { name, latitude, longitude } = action.payload;
      
      const updates: Record<string, any> = {};
      if (name !== undefined && currentContent.name !== name) {
        updates.name = name;
      }
      if (latitude !== undefined && currentContent.latitude !== latitude) {
        updates.latitude = latitude;
      }
      if (longitude !== undefined && currentContent.longitude !== longitude) {
        updates.longitude = longitude;
      }
      
      if (Object.keys(updates).length > 0) {
        state.contentByType[state.type] = {
          ...currentContent,
          ...updates
        };
      }
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
    resetConfig: (state) => {
      const currentType = state.type;
      const currentContent = state.contentByType[currentType];
      const currentDownloadSize = state.downloadSize;
      const currentQRCode = state.qrCode;
      
      // Reset to initial state but preserve certain values
      return {
        ...initialState,
        type: currentType,
        downloadSize: currentDownloadSize,
        qrCode: currentQRCode,
        contentByType: {
          ...initialState.contentByType,
          [currentType]: currentContent
        },
        // Reset customization to initial values
        fgColor: initialState.fgColor,
        bgColor: initialState.bgColor,
        size: initialState.size,
        margin: initialState.margin,
        errorCorrectionLevel: initialState.errorCorrectionLevel,
        customization: {
          ...initialState.customization,
          size: initialState.size,
          foregroundColor: initialState.fgColor,
          backgroundColor: initialState.bgColor,
          margin: initialState.margin,
          errorCorrectionLevel: initialState.errorCorrectionLevel,
        }
      };
    },
    setType: (state, action: PayloadAction<QRCodeType>) => {
      state.type = action.payload;
      state.qrCode = null; // Reset QR code when changing type
      state.error = null; // Clear any errors
    },
    updateQRConfig: (state, action: PayloadAction<Partial<QRConfigState>>) => {
      Object.assign(state, action.payload);
    },
    setLogo: (state, action: PayloadAction<string | null>) => {
      state.customization.logo = action.payload;
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
  setLogo,
  setLocationContent,
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
