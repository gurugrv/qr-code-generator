import { QRCodeType, QRCustomization, QRCodeTypeValues, VCardData } from './shared/types';


// Date validation
const isValidDate = (date: string): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

// UPI ID validation
const isValidUpiId = (vpa: string): boolean => {
  return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(vpa);
};

// Amount validation
const isValidAmount = (amount: string | number): boolean => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(num) && num >= 0;
};

// Helper validation functions
const validatePhone = (phone: string): boolean => {
  // Basic phone number validation
  return /^\+?[0-9\- ]+$/.test(phone);
};

// Enhanced RFC 5322 compliant email validation with CC/BCC support
const validateEmail = (email: string, options?: { cc?: string[]; bcc?: string[]; attachments?: string[] }): boolean => {
  // Main email validation
  const emailPattern = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
  
  if (!emailPattern.test(email)) return false;

  // Validate CC/BCC emails if provided
  if (options?.cc) {
    for (const ccEmail of options.cc) {
      if (!emailPattern.test(ccEmail)) return false;
    }
  }

  if (options?.bcc) {
    for (const bccEmail of options.bcc) {
      if (!emailPattern.test(bccEmail)) return false;
    }
  }

  // Validate attachments if provided
  if (options?.attachments) {
    const validAttachmentPattern = /^[a-zA-Z0-9\-_]+\.(pdf|docx?|xlsx?|txt|png|jpe?g|gif)$/i;
    for (const attachment of options.attachments) {
      if (!validAttachmentPattern.test(attachment)) return false;
    }
  }

  return true;
};

// Enhanced URL validation with Unicode support and custom schemes
const validateURL = (url: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Protocol validation with custom scheme support
  const validProtocols = ['http:', 'https:', 'ftp:', 'ftps:', 'mailto:', 'tel:', 'sms:', 'geo:', 'whatsapp:', 'instagram:', 'facebook:', 'twitter:'];
  
  try {
    const parsed = new URL(url);
    
    // Validate protocol
    if (!validProtocols.includes(parsed.protocol)) {
      errors.push(`Invalid protocol. Must be one of: ${validProtocols.join(', ')}`);
    }

    // Basic domain validation
    if (parsed.hostname) {
      // Validate Unicode domains
      try {
        const domain = parsed.hostname.toLowerCase();
        const normalized = domain.normalize('NFC');
        if (normalized !== domain) {
          errors.push('Domain contains invalid Unicode characters');
        }
      } catch {
        errors.push('Domain contains invalid Unicode characters');
      }
    }

    // Path validation with Unicode support
    const pathPattern = /^[a-z0-9\-._~!$&'()*+,;=:@\/%\p{L}]*$/iu;
    if (!pathPattern.test(parsed.pathname)) {
      errors.push('Invalid characters in path');
    }

    // Query parameter validation
    parsed.searchParams.forEach((value, key) => {
      if (!/^[a-z0-9\-._~!$'()*+,;=:@\/?%\p{L}]*$/iu.test(key) ||
          !/^[a-z0-9\-._~!$'()*+,;=:@\/?%\p{L}]*$/iu.test(value)) {
        errors.push(`Invalid characters in query parameter: ${key}=${value}`);
      }
    });

    // Fragment validation
    if (parsed.hash && !/^#[a-z0-9\-._~!$&'()*+,;=:@\/?%\p{L}]*$/iu.test(parsed.hash)) {
      errors.push('Invalid characters in URL fragment');
    }

    // Length constraints
    if (url.length > 2048) {
      errors.push('URL exceeds maximum length of 2048 characters');
    }

  } catch (e) {
    errors.push('Invalid URL format');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Enhanced WiFi validation
const validateWiFi = (data: {
  ssid: string;
  password: string;
  encryption: string;
  hidden?: boolean;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // SSID validation
  if (!data.ssid || typeof data.ssid !== 'string') {
    errors.push('SSID is required');
  } else {
    // Length validation
    if (data.ssid.length < 1 || data.ssid.length > 32) {
      errors.push('SSID must be between 1 and 32 characters');
    }
    
    // Character validation
    const invalidSsidChars = /[\\/:*?"<>|]/;
    if (invalidSsidChars.test(data.ssid)) {
      errors.push('SSID contains invalid characters');
    }
    
    // Unicode support
    try {
      new TextEncoder().encode(data.ssid);
    } catch {
      errors.push('SSID contains invalid Unicode characters');
    }
  }

  // Password validation
  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
  } else {
    // Length validation
    if (data.password.length < 8 || data.password.length > 63) {
      errors.push('Password must be between 8 and 63 characters');
    }
    
    // Strength requirements
    const strengthChecks = [
      /[A-Z]/, // Uppercase
      /[a-z]/, // Lowercase
      /[0-9]/, // Numbers
      /[^A-Za-z0-9]/ // Special chars
    ];
    const strengthScore = strengthChecks.reduce((score, regex) =>
      regex.test(data.password) ? score + 1 : score, 0);
    
    if (strengthScore < 3) {
      errors.push('Password must contain at least 3 of: uppercase, lowercase, numbers, special characters');
    }
  }

  // Encryption type validation
  const validEncryptionTypes = ['WPA', 'WPA2', 'WPA3', 'WEP', 'nopass'];
  if (!data.encryption || !validEncryptionTypes.includes(data.encryption)) {
    errors.push(`Encryption type must be one of: ${validEncryptionTypes.join(', ')}`);
  }

  // Hidden network validation
  if (typeof data.hidden !== 'boolean') {
    errors.push('Hidden network status must be true or false');
  }

  // Special character escaping
  if (data.ssid) {
    const escapedSsid = data.ssid
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/"/g, '\\"')
      .replace(/,/g, '\\,');
    data.ssid = escapedSsid;
  }
  if (data.password) {
    const escapedPassword = data.password
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/"/g, '\\"')
      .replace(/,/g, '\\,');
    data.password = escapedPassword;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Enhanced calendar event validation
const validateCalendarEvent = (data: {
  title: string;
  startDate: string;
  endDate: string;
  timezone?: string;
  recurrence?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    interval?: number;
    count?: number;
    until?: string;
  };
  reminders?: {
    minutesBefore: number;
    method: 'EMAIL' | 'DISPLAY' | 'AUDIO';
  }[];
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Basic validation
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

  // Timezone validation
  if (data.timezone) {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: data.timezone });
    } catch {
      errors.push('Invalid timezone');
    }
  }

  // Recurrence validation
  if (data.recurrence) {
    const validFrequencies = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
    if (!validFrequencies.includes(data.recurrence.frequency)) {
      errors.push(`Invalid recurrence frequency. Must be one of: ${validFrequencies.join(', ')}`);
    }

    if (data.recurrence.interval && (data.recurrence.interval < 1 || data.recurrence.interval > 365)) {
      errors.push('Recurrence interval must be between 1 and 365');
    }

    if (data.recurrence.count && data.recurrence.count < 1) {
      errors.push('Recurrence count must be at least 1');
    }

    if (data.recurrence.until && !isValidDate(data.recurrence.until)) {
      errors.push('Invalid recurrence end date');
    }
  }

  // Reminders validation
  if (data.reminders) {
    const validMethods = ['EMAIL', 'DISPLAY', 'AUDIO'];
    for (const reminder of data.reminders) {
      if (reminder.minutesBefore < 0 || reminder.minutesBefore > 40320) {
        errors.push('Reminder minutes must be between 0 and 40320 (4 weeks)');
      }
      if (!validMethods.includes(reminder.method)) {
        errors.push(`Invalid reminder method. Must be one of: ${validMethods.join(', ')}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Enhanced location validation
const validateLocation = (data: {
  latitude: number;
  longitude: number;
  altitude?: number;
  name?: string;
  mapLink?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Coordinate validation
  if (typeof data.latitude !== 'number' || data.latitude < -90 || data.latitude > 90) {
    errors.push('Valid latitude is required (-90 to 90)');
  }
  if (typeof data.longitude !== 'number' || data.longitude < -180 || data.longitude > 180) {
    errors.push('Valid longitude is required (-180 to 180)');
  }

  // Altitude validation
  if (data.altitude && (data.altitude < -10911 || data.altitude > 8848)) {
    errors.push('Altitude must be between -10911 (Mariana Trench) and 8848 (Mount Everest) meters');
  }

  // Name validation
  if (data.name && data.name.length > 128) {
    errors.push('Location name must be 128 characters or less');
  }

  // Map link validation
  if (data.mapLink) {
    const mapValidation = validateURL(data.mapLink);
    if (!mapValidation.isValid) {
      errors.push(...mapValidation.errors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Enhanced UPI validation
const validateUPI = (data: {
  vpa: string;
  name: string;
  amount?: number | string;
  currency?: string;
  merchantCode?: string;
  referenceNumber?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // VPA validation
  if (!data.vpa || !isValidUpiId(data.vpa)) {
    errors.push('Valid UPI ID is required');
  }

  // Name validation
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Payee name is required');
  }

  // Amount validation
  if (data.amount && !isValidAmount(data.amount)) {
    errors.push('Amount must be a valid non-negative number');
  }

  // Currency validation
  if (data.currency && !/^[A-Z]{3}$/.test(data.currency)) {
    errors.push('Currency must be a valid 3-letter ISO code');
  }

  // Merchant code validation
  if (data.merchantCode && !/^[A-Z0-9]{4,16}$/.test(data.merchantCode)) {
    errors.push('Merchant code must be 4-16 alphanumeric characters');
  }

  // Reference number validation
  if (data.referenceNumber && !/^[A-Z0-9]{1,20}$/.test(data.referenceNumber)) {
    errors.push('Reference number must be 1-20 alphanumeric characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// General QR code input validation
export const validateQRInput = (data: any, type: QRCodeType): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate based on QR code type
  switch (type) {
    case 'TEXT':
      if (!data.text || typeof data.text !== 'string') {
        errors.push('Text content is required');
      }
      break;
      
    case 'URL':
      const urlValidation = validateURL(data.content || '');
      if (!urlValidation.isValid) {
        errors.push(...urlValidation.errors);
      }
      break;
      
    case 'PHONE':
      if (!data.phone || !validatePhone(data.phone)) {
        errors.push('Please enter a valid phone number (numbers, +, - and spaces allowed)');
      }
      break;
      
    case 'WIFI':
      const wifiValidation = validateWiFi(data);
      if (!wifiValidation.isValid) {
        errors.push(...wifiValidation.errors);
      }
      break;
      
    case 'VCARD': {
      // Required fields
      if (!data.firstName || typeof data.firstName !== 'string') {
        errors.push('First name is required');
      }
      if (!data.lastName || typeof data.lastName !== 'string') {
        errors.push('Last name is required');
      }
      if (!data.phone || !validatePhone(data.phone)) {
        errors.push('Please enter a valid phone number (numbers, +, - and spaces allowed)');
      }

      // Optional but validated fields
      if (data.email && !validateEmail(data.email)) {
        errors.push('Invalid email address');
      }
      
      if (data.website && !validateURL(data.website).isValid) {
        errors.push('Invalid website URL');
      }

      if (data.organization && data.organization.length > 128) {
        errors.push('Organization name must be 128 characters or less');
      }

      if (data.jobTitle && data.jobTitle.length > 128) {
        errors.push('Job title must be 128 characters or less');
      }

      if (data.address) {
        if (data.address.street && data.address.street.length > 128) {
          errors.push('Street address must be 128 characters or less');
        }
        if (data.address.city && data.address.city.length > 64) {
          errors.push('City must be 64 characters or less');
        }
        if (data.address.postalCode && data.address.postalCode.length > 16) {
          errors.push('Postal code must be 16 characters or less');
        }
        if (data.address.country && data.address.country.length > 64) {
          errors.push('Country must be 64 characters or less');
        }
      }

      if (data.birthday && !isValidDate(data.birthday)) {
        errors.push('Invalid birthday date');
      }

      if (data.photoUrl && !validateURL(data.photoUrl).isValid) {
        errors.push('Invalid photo URL');
      }

      if (data.logoUrl && !validateURL(data.logoUrl).isValid) {
        errors.push('Invalid logo URL');
      }

      if (data.notes && data.notes.length > 1024) {
        errors.push('Notes must be 1024 characters or less');
      }
      break;
    }
      
    case 'EMAIL':
      if (!data.email || !validateEmail(data.email)) {
        errors.push('Valid email address is required');
      }
      break;
      
    case 'SMS':
      if (!data.phone || !validatePhone(data.phone)) {
        errors.push('Please enter a valid phone number (numbers, +, - and spaces allowed)');
      }
      if (!data.message || typeof data.message !== 'string') {
        errors.push('Message content is required');
      }
      break;
      
    case 'CALENDAR':
      const calendarValidation = validateCalendarEvent(data);
      if (!calendarValidation.isValid) {
        errors.push(...calendarValidation.errors);
      }
      break;
      
    case 'LOCATION':
      const locationValidation = validateLocation(data);
      if (!locationValidation.isValid) {
        errors.push(...locationValidation.errors);
      }
      break;
      
    case 'UPI':
      const upiValidation = validateUPI(data);
      if (!upiValidation.isValid) {
        errors.push(...upiValidation.errors);
      }
      break;
      
    default:
      errors.push('Invalid QR code type');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
