import { QRCodeType, QRConfigState } from '../shared/types';

export const validateEmail = (email: string, options?: { cc?: string[]; bcc?: string[] }): boolean => {
  const emailPattern = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

  if (!emailPattern.test(email)) {
    return false;
  }

  if (options?.cc) {
    for (const ccEmail of options.cc) {
      if (!emailPattern.test(ccEmail)) {
        return false;
      }
    }
  }

  if (options?.bcc) {
    for (const bccEmail of options.bcc) {
      if (!emailPattern.test(bccEmail)) {
        return false;
      }
    }
  }

  return true;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const pattern = /^\+?[0-9\- ]+$/;
  return pattern.test(phone);
};

export const validateUrl = (url: string): boolean => {
  const validProtocols = ['http:', 'https:', 'ftp:', 'ftps:', 'mailto:', 'tel:', 'sms:', 'geo:', 'whatsapp:', 'instagram:', 'facebook:', 'twitter:'];
  
  try {
    const parsed = new URL(url);
    
    if (!validProtocols.includes(parsed.protocol)) {
      return false;
    }

    if (parsed.hostname) {
      try {
        const domain = parsed.hostname.toLowerCase();
        const normalized = domain.normalize('NFC');
        if (normalized !== domain) {
          return false;
        }
      } catch {
        return false;
      }
    }

    const pathPattern = /^[a-z0-9\-._~!$&'()*+,;=:@\/%\p{L}]*$/iu;
    if (!pathPattern.test(parsed.pathname)) {
      return false;
    }

    for (const [key, value] of parsed.searchParams.entries()) {
      if (!/^[a-z0-9\-._~!$'()*+,;=:@\/?%\p{L}]*$/iu.test(key) ||
          !/^[a-z0-9\-._~!$'()*+,;=:@\/?%\p{L}]*$/iu.test(value)) {
        return false;
      }
    }

    if (parsed.hash && !/^#[a-z0-9\-._~!$&'()*+,;=:@\/?%\p{L}]*$/iu.test(parsed.hash)) {
      return false;
    }

    if (url.length > 2048) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
};

export const validateQRContent = (content: Record<string, any>, type: QRCodeType): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!content) {
    return {
      isValid: false,
      errors: ['Content is required']
    };
  }

  switch (type) {
    case 'URL':
      if (!validateUrl(content.url)) {
        errors.push('Invalid URL');
      }
      break;
    case 'EMAIL':
      if (!validateEmail(content.email, {
        cc: content.cc,
        bcc: content.bcc
      })) {
        errors.push('Invalid email');
      }
      break;
    case 'PHONE':
    case 'SMS':
      if (!validatePhoneNumber(content.phone)) {
        errors.push('Invalid phone number');
      }
      break;
    case 'TEXT':
      if (!content.text || content.text.length === 0) {
        errors.push('Text is required');
      }
      break;
    case 'WIFI': {
      if (!content.ssid || content.ssid.length === 0) {
        errors.push('SSID is required');
      } else if (content.ssid.length > 32) {
        errors.push('SSID must be 32 characters or less');
      }

      if (content.password && content.password.length > 63) {
        errors.push('Password must be 63 characters or less');
      }

      const validEncryption = ['WPA', 'WPA2', 'WPA3', 'WEP', 'nopass'];
      if (!validEncryption.includes(content.encryption)) {
        errors.push(`Encryption must be one of: ${validEncryption.join(', ')}`);
      }
      break;
    }
    case 'VCARD': {
      // Required fields
      if (!content.firstName || content.firstName.length === 0) {
        errors.push('First name is required');
      }
      if (!content.lastName || content.lastName.length === 0) {
        errors.push('Last name is required');
      }
      if (!content.phone || !validatePhoneNumber(content.phone)) {
        errors.push('Valid phone number is required');
      }

      // Optional but validated fields
      if (content.email && !validateEmail(content.email)) {
        errors.push('Invalid email address');
      }
      
      if (content.website && !validateUrl(content.website)) {
        errors.push('Invalid website URL');
      }

      if (content.organization && content.organization.length > 128) {
        errors.push('Organization name must be 128 characters or less');
      }

      if (content.jobTitle && content.jobTitle.length > 128) {
        errors.push('Job title must be 128 characters or less');
      }

      if (content.address) {
        if (content.address.street && content.address.street.length > 128) {
          errors.push('Street address must be 128 characters or less');
        }
        if (content.address.city && content.address.city.length > 64) {
          errors.push('City must be 64 characters or less');
        }
        if (content.address.postalCode && content.address.postalCode.length > 16) {
          errors.push('Postal code must be 16 characters or less');
        }
        if (content.address.country && content.address.country.length > 64) {
          errors.push('Country must be 64 characters or less');
        }
      }

      if (content.birthday && isNaN(Date.parse(content.birthday))) {
        errors.push('Invalid birthday date');
      }

      if (content.photoUrl && !validateUrl(content.photoUrl)) {
        errors.push('Invalid photo URL');
      }

      if (content.logoUrl && !validateUrl(content.logoUrl)) {
        errors.push('Invalid logo URL');
      }

      if (content.notes && content.notes.length > 1024) {
        errors.push('Notes must be 1024 characters or less');
      }
      break;
    }
    case 'CALENDAR': {
      if (!content.title || content.title.length === 0) {
        errors.push('Title is required');
      }
      if (!content.startDate || isNaN(Date.parse(content.startDate))) {
        errors.push('Valid start date is required');
      }
      if (!content.endDate || isNaN(Date.parse(content.endDate))) {
        errors.push('Valid end date is required');
      }
      if (content.recurrence) {
        const validFrequencies = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
        if (!validFrequencies.includes(content.recurrence.frequency)) {
          errors.push(`Invalid recurrence frequency. Must be one of: ${validFrequencies.join(', ')}`);
        }
      }
      break;
    }
    case 'LOCATION': {
      if (content.latitude === undefined || content.latitude < -90 || content.latitude > 90) {
        errors.push('Valid latitude is required (-90 to 90)');
      }
      if (content.longitude === undefined || content.longitude < -180 || content.longitude > 180) {
        errors.push('Valid longitude is required (-180 to 180)');
      }
      if (content.name && content.name.length > 128) {
        errors.push('Location name must be 128 characters or less');
      }
      if (content.mapLink && !validateUrl(content.mapLink)) {
        errors.push('Invalid map link URL');
      }
      break;
    }
    case 'SOCIAL': {
      if (!content.platform || !content.url) {
        errors.push('Platform and URL are required');
      }
      break;
    }
    case 'UPI': {
      if (!content.vpa || !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(content.vpa)) {
        errors.push('Valid UPI ID is required');
      }
      if (!content.name || content.name.length === 0) {
        errors.push('Payee name is required');
      }
      if (content.amount && isNaN(Number(content.amount))) {
        errors.push('Amount must be a valid number');
      }
      if (content.currency && !/^[A-Z]{3}$/.test(content.currency)) {
        errors.push('Currency must be a valid 3-letter ISO code');
      }
      if (content.merchantCode && !/^[A-Z0-9]{4,16}$/.test(content.merchantCode)) {
        errors.push('Merchant code must be 4-16 alphanumeric characters');
      }
      if (content.reference && !/^[A-Z0-9]{1,20}$/.test(content.reference)) {
        errors.push('Reference number must be 1-20 alphanumeric characters');
      }
      break;
    }
    default:
      errors.push('Invalid QR code type');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateQRConfig = (config: QRConfigState): boolean => {
  return (
    config.customization.size > 0 &&
    config.customization.size <= 1000 &&
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(config.fgColor) &&
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(config.bgColor) &&
    validateQRContent(config.contentByType[config.type], config.type).isValid
  );
};
