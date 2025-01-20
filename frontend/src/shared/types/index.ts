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
  SOCIAL: 'SOCIAL',
  UPI: 'UPI'
} as const;

export type QRCodeType = typeof QRCodeTypeValues[keyof typeof QRCodeTypeValues];

export interface QRCustomization {
  foregroundColor: string;
  backgroundColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  size: number;
  margin: number;
  logo?: string | null;
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
  contentByType: Record<QRCodeType, Record<string, any>>;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  loading: boolean;
  error: string | null;
  qrCode: string | null;
  margin: number;
}

/**
 * vCard 3.0 data structure with field constraints
 */
export interface VCardData {
  /** Required first name (max 64 chars) */
  firstName: string;
  /** Required last name (max 64 chars) */
  lastName: string;
  /** Required phone number in E.164 format */
  phone: string;
  
  /** Optional mobile number in E.164 format */
  mobile?: string;
  /** Optional email address (RFC 5322 compliant) */
  email?: string;
  /** Optional website URL */
  website?: string;
  /** Optional organization name (max 128 chars) */
  organization?: string;
  /** Optional job title (max 128 chars) */
  jobTitle?: string;
  
  /** Optional address object */
  address?: {
    /** Street address (max 128 chars) */
    street?: string;
    /** City name (max 64 chars) */
    city?: string;
    /** Postal code (max 16 chars) */
    postcode?: string;
    /** Country name (max 64 chars) */
    country?: string;
  };
  
  /** vCard version (default: 3.0) */
  version?: '3.0';
}

/**
 * Type guard for VCardData
 */
export function isVCardData(data: unknown): data is VCardData {
  const d = data as VCardData;
  return typeof d?.firstName === 'string' &&
    typeof d?.lastName === 'string' &&
    typeof d?.phone === 'string' &&
    d.firstName.length <= 64 &&
    d.lastName.length <= 64 &&
    /^\+?[0-9\- ]+$/.test(d.phone);
}
