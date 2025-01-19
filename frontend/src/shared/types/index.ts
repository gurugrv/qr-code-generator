export const QRCodeTypeValues = {
  URL: 'URL',
  WIFI: 'WIFI',
  VCARD: 'VCARD',
  TEXT: 'TEXT',
  EMAIL: 'EMAIL',
  PHONE: 'PHONE',
  SMS: 'SMS',
  CALENDAR: 'CALENDAR',
  LOCATION: 'LOCATION',
  SOCIAL: 'Social'
} as const;

export type QRCodeType = typeof QRCodeTypeValues[keyof typeof QRCodeTypeValues];

export interface QRCustomization {
  foregroundColor: string;
  backgroundColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  size: number;
  margin: number;
}

export const QRPatternTypeValues = {
  SQUARES: 'squares',
  DOTS: 'dots',
  ROUNDED: 'rounded',
  CIRCULAR: 'circular',
  RANDOM: 'random'
} as const;

export type QRPatternType = typeof QRPatternTypeValues[keyof typeof QRPatternTypeValues];

export interface QRCodeState {
  type: QRCodeType;
  data: Record<string, any>;
  customization: QRCustomization;
  patternType: QRPatternType;
  patternColor: string;
  isCustomPattern: boolean;
  version: number;
  lastGenerated: string | null;
}

export interface QRConfigState extends QRCodeState {
  fgColor: string;
  bgColor: string;
  content: string | { platform: string; url: string };
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  loading: boolean;
  error: string | null;
  qrCode: string | null;
  margin: number;
}
