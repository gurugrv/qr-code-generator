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
  SOCIAL: 'SOCIAL'
} as const;

export type QRCodeType = typeof QRCodeTypeValues[keyof typeof QRCodeTypeValues];

export interface QRCustomization {
  foregroundColor: string;
  backgroundColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  size: number;
  margin: number;
  logo: string | null;
}

export interface QRCodeState {
  type: QRCodeType;
  data: Record<string, any>;
  customization: QRCustomization;
}
