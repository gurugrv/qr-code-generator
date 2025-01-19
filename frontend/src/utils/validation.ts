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

export const validateQRContent = (content: Record<string, any>, type: QRCodeType): boolean => {
  if (!content) return false;

  switch (type) {
    case 'URL':
      return !!content.url && isValidUrl(content.url);
    case 'EMAIL':
      return !!content.email && isValidEmail(content.email);
    case 'PHONE':
    case 'SMS':
      return !!content.phone && isValidPhoneNumber(content.phone);
    case 'TEXT':
      return !!content.text && content.text.length > 0;
    case 'WIFI':
      return !!content.ssid && content.ssid.length > 0;
    case 'VCARD':
      return !!content.name && content.name.length > 0;
    case 'CALENDAR':
      return !!content.title && !!content.startDate && !!content.endDate;
    case 'LOCATION':
      return content.latitude !== undefined && content.longitude !== undefined;
    case 'SOCIAL':
      return !!content.platform && !!content.url;
    case 'UPI':
      return !!content.vpa && !!content.name && /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(content.vpa);
    default:
      return false;
  }
};

export const validateQRConfig = (config: QRConfigState): boolean => {
  return (
    config.customization.size > 0 &&
    config.customization.size <= 1000 &&
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(config.fgColor) &&
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(config.bgColor) &&
    validateQRContent(config.contentByType[config.type], config.type)
  );
};
