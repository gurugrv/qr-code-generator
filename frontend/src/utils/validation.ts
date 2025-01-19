import { QRCodeType, QRConfigState } from '../shared/types';

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhoneNumber = (phone: string): boolean => {
  return /^\+?[0-9\s\-()]{7,20}$/.test(phone);
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

export const validateQRContent = (content: string | { platform: string; url: string }, type: QRCodeType): boolean => {
  if (!content) return false;

  switch (type) {
    case 'URL':
      return typeof content === 'string' && isValidUrl(content);
    case 'EMAIL':
      return typeof content === 'string' && isValidEmail(content);
    case 'PHONE':
    case 'SMS':
      return typeof content === 'string' && isValidPhoneNumber(content);
    case 'TEXT':
      return typeof content === 'string' && content.length > 0;
    default:
      return typeof content === 'string' && content.length > 0;
  }
};

export const validateQRConfig = (config: QRConfigState): boolean => {
  return (
    config.customization.size > 0 &&
    config.customization.size <= 1000 &&
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(config.fgColor) &&
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(config.bgColor) &&
    validateQRContent(config.content, config.type)
  );
};
