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
  logo: string | null;
}

export interface BaseQRData {
  type: QRCodeType;
  metadata?: {
    created: Date;
    version: string;
  };
}

export interface URLQRData extends BaseQRData {
  url: string;
  title?: string;
}

export interface WiFiQRData extends BaseQRData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WPA2' | 'WPA3' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface EmailQRData extends BaseQRData {
  email: string;
  subject?: string;
  body?: string;
  cc?: string[];
  bcc?: string[];
}

export interface PhoneSMSQRData extends BaseQRData {
  phone: string;
  message?: string;
}

export interface CalendarQRData extends BaseQRData {
  event: {
    title: string;
    description?: string;
    location?: string;
    start: Date;
    end: Date;
    timezone?: string;
    recurrence?: {
      frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
      interval: number;
      count?: number;
      until?: Date;
    };
    attendees?: string[];
    reminders?: {
      minutesBefore: number;
      description: string;
    }[];
  };
}

export interface LocationQRData extends BaseQRData {
  coordinates: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  name?: string;
}

export interface SocialQRData extends BaseQRData {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube';
  username: string;
}

export interface UPIQRData extends BaseQRData {
  upiId: string;
  amount?: number;
  currency?: string;
  note?: string;
  merchantCode?: string;
  reference?: string;
}

export interface QRCodeState {
  type: QRCodeType;
  data: Record<string, any>;
  customization: QRCustomization;
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
    /** State/Region name (max 64 chars) */
    state?: string;
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
    /^\+[1-9]\d{1,14}$/.test(d.phone);
}
