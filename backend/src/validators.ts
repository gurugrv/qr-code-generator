import { QRCodeType, QRCustomization, QRCodeTypeValues } from './shared/types';

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhoneNumber = (phone: string): boolean => {
  return /^[+]?[\d\s-()]{8,}$/.test(phone);
};

const isValidDate = (date: string): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const validateQRInput = (
  type: QRCodeType,
  data: Record<string, any>,
  customization?: QRCustomization
) => {
  const errors: string[] = [];
  
  // Validate customization if provided
  if (customization) {
    if (!['L', 'M', 'Q', 'H'].includes(customization.errorCorrectionLevel)) {
      errors.push('Invalid error correction level');
    }
    if (!['small', 'medium', 'large'].includes(customization.size)) {
      errors.push('Invalid size value');
    }
    if (typeof customization.margin !== 'number' || customization.margin < 0 || customization.margin > 10) {
      errors.push('Invalid margin value');
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(customization.foregroundColor)) {
      errors.push('Invalid foreground color format');
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(customization.backgroundColor)) {
      errors.push('Invalid background color format');
    }
  }

  switch (type) {
    case QRCodeTypeValues.URL:
      if (!data.url || !/^https?:\/\/.+/.test(data.url)) {
        errors.push('Invalid URL format');
      }
      break;
      
    case QRCodeTypeValues.WIFI:
      if (!data.ssid || typeof data.ssid !== 'string') {
        errors.push('SSID is required');
      }
      if (!data.password || typeof data.password !== 'string') {
        errors.push('Password is required');
      }
      if (!['WPA', 'WEP', 'None'].includes(data.encryption)) {
        errors.push('Invalid encryption type');
      }
      break;
      
    case QRCodeTypeValues.VCARD:
      if (!data.name || typeof data.name !== 'string') {
        errors.push('Name is required');
      }
      if (!data.phone || !isValidPhoneNumber(data.phone)) {
        errors.push('Valid phone number is required');
      }
      if (!data.email || !isValidEmail(data.email)) {
        errors.push('Valid email is required');
      }
      break;
      
    case QRCodeTypeValues.TEXT:
      if (!data.text || typeof data.text !== 'string') {
        errors.push('Text is required');
      }
      break;

    case QRCodeTypeValues.EMAIL:
      if (!data.email || !isValidEmail(data.email)) {
        errors.push('Valid email is required');
      }
      break;

    case QRCodeTypeValues.PHONE:
      if (!data.phone || !isValidPhoneNumber(data.phone)) {
        errors.push('Valid phone number is required');
      }
      break;

    case QRCodeTypeValues.SMS:
      if (!data.phone || !isValidPhoneNumber(data.phone)) {
        errors.push('Valid phone number is required');
      }
      break;

    case QRCodeTypeValues.CALENDAR:
      if (!data.title || typeof data.title !== 'string') {
        errors.push('Event title is required');
      }
      if (!data.startDate || !isValidDate(data.startDate)) {
        errors.push('Valid start date is required');
      }
      if (!data.endDate || !isValidDate(data.endDate)) {
        errors.push('Valid end date is required');
      }
      if (new Date(data.startDate) > new Date(data.endDate)) {
        errors.push('End date must be after start date');
      }
      break;

    case QRCodeTypeValues.LOCATION:
      if (typeof data.latitude !== 'number' || data.latitude < -90 || data.latitude > 90) {
        errors.push('Valid latitude is required (-90 to 90)');
      }
      if (typeof data.longitude !== 'number' || data.longitude < -180 || data.longitude > 180) {
        errors.push('Valid longitude is required (-180 to 180)');
      }
      break;
      
    default:
      errors.push('Invalid QR code type');
  }
  
  return {
    success: errors.length === 0,
    errors
  };
};