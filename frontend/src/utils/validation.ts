import { QRCodeType } from '../shared/types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
  return phoneRegex.test(phone);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateQRContent = (content: Record<string, any>, type: QRCodeType): boolean => {
  switch (type) {
    case 'URL':
      return !!content.url && validateUrl(content.url);
    case 'TEXT':
      return !!content.text && content.text.trim().length > 0;
    case 'EMAIL':
      return !!content.email && validateEmail(content.email);
    case 'PHONE':
      return !!content.phone && validatePhoneNumber(content.phone);
    case 'WIFI':
      return !!content.ssid && content.ssid.trim().length > 0;
    case 'VCARD':
      return !!content.firstName && content.firstName.trim().length > 0;
    case 'SMS':
      return !!content.phone && validatePhoneNumber(content.phone);
    case 'CALENDAR':
      return !!content.title && content.title.trim().length > 0;
    case 'LOCATION':
      return typeof content.latitude === 'number' &&
             typeof content.longitude === 'number';
    case 'SOCIAL':
      return !!content.platform && content.platform.trim().length > 0;
    case 'UPI':
      return !!content.vpa && content.vpa.trim().length > 0;
    default:
      return false;
  }
};
