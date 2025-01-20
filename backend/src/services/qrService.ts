import { QRCodeType, QRCodeTypeValues, VCardData } from '../shared/types';

// Helper functions for vCard generation
const escapeVCardValue = (value: string | undefined): string => {
  if (!value) return '';
  // First escape backslashes, then commas, then semicolons
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/[\n\r]/g, '')  // Remove all line breaks
    .trim();
};

const foldLine = (line: string): string => {
  const maxLength = 75;
  if (line.length <= maxLength) return line;
  
  const parts: string[] = [];
  let remaining = line;
  
  while (remaining.length > 0) {
    const chunk = remaining.slice(0, maxLength);
    parts.push(chunk);
    remaining = remaining.slice(maxLength);
    if (remaining.length > 0) {
      parts.push(' ');
    }
  }
  
  return parts.join('\r\n ');
};

const generateVCard = (data: VCardData): string => {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0'
  ];

  // Validate required fields
  if (!data.firstName || !data.lastName || !data.phone) {
    throw new Error('Missing required vCard fields: firstName, lastName, and phone are required');
  }

  // Required fields
  lines.push(`FN:${escapeVCardValue(`${data.firstName} ${data.lastName}`)}`);
  lines.push(`N:${escapeVCardValue(data.lastName)};${escapeVCardValue(data.firstName)};;;`);
  lines.push(`TEL;TYPE=WORK,VOICE:${escapeVCardValue(data.phone)}`);

  // Optional fields
  if (data.mobile) {
    lines.push(`TEL;TYPE=CELL,VOICE:${escapeVCardValue(data.mobile)}`);
  }
  if (data.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(data.email)}`);
  }
  if (data.website) {
    lines.push(`URL:${escapeVCardValue(data.website)}`);
  }
  if (data.organization) {
    lines.push(`ORG:${escapeVCardValue(data.organization)}`);
  }
  if (data.jobTitle) {
    lines.push(`TITLE:${escapeVCardValue(data.jobTitle)}`);
  }

  // Address handling
  if (data.address) {
    // Only include address if at least one field is filled
    if (data.address.street || data.address.city || data.address.state || data.address.postcode || data.address.country) {
      // Prepare address parts with proper escaping
      const street = data.address.street ? escapeVCardValue(data.address.street) : '';
      const city = data.address.city ? escapeVCardValue(data.address.city) : '';
      const state = data.address.state ? escapeVCardValue(data.address.state) : '';
      const postcode = data.address.postcode ? escapeVCardValue(data.address.postcode) : '';
      const country = data.address.country ? escapeVCardValue(data.address.country) : '';

      // Add structured address with all 7 components:
      // PO Box;Extended Address;Street;City;State;Postal Code;Country
      lines.push(`ADR;TYPE=WORK:;;${street};${city};${state};${postcode};${country}`);

      // Add formatted label for display
      const displayParts = [];
      if (street) displayParts.push(street);
      if (city) displayParts.push(city);
      if (state) displayParts.push(state);
      if (postcode) displayParts.push(postcode);
      if (country) displayParts.push(country);

      if (displayParts.length > 0) {
        const formattedAddress = displayParts.join('\\n');
        lines.push(`LABEL;TYPE=WORK:${escapeVCardValue(formattedAddress)}`);
      }
    }
  }

  lines.push('END:VCARD');

  // Apply line folding and join with CRLF
  return lines.map(foldLine).join('\r\n');
};

export const generateQRCodeData = (type: QRCodeType, data: Record<string, any>): string => {
  switch (type) {
    case QRCodeTypeValues.WIFI:
      return `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};;`;
    
    case QRCodeTypeValues.VCARD:
      return generateVCard(data as VCardData);
    
    case QRCodeTypeValues.CALENDAR:
      return `BEGIN:VEVENT
SUMMARY:${data.title}
DTSTART:${formatDateTime(data.startDate)}
DTEND:${formatDateTime(data.endDate)}
DESCRIPTION:${data.description || ''}
END:VEVENT`;
    
    case QRCodeTypeValues.EMAIL:
      return `mailto:${data.email}?subject=${encodeURIComponent(data.subject || '')}&body=${encodeURIComponent(data.body || '')}`;
    
    case QRCodeTypeValues.SMS:
      return `smsto:${data.phone}:${data.message || ''}`;
    
    case QRCodeTypeValues.PHONE: {
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
      if (!phoneRegex.test(data.phone)) {
        throw new Error('Invalid phone number format');
      }
      return `tel:${data.phone.replace(/[^0-9+]/g, '')}`;
    }
    
    case QRCodeTypeValues.LOCATION:
      return `geo:${data.latitude},${data.longitude}`;
    
    case QRCodeTypeValues.URL:
    case QRCodeTypeValues.SOCIAL:
      return data.content;
    
    case QRCodeTypeValues.UPI:
      const upiData = {
        pa: data.vpa,
        pn: data.name,
        am: data.amount || '',
        tn: 'Payment',
        cu: 'INR'
      };
      return `upi://pay?${Object.entries(upiData)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')}`;
    
    case QRCodeTypeValues.TEXT:
    default:
      return data.text || '';
  }
};

const formatDateTime = (date: string): string => {
  const d = new Date(date);
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

export const validateQRCodeSize = (size: number): boolean => {
  return size > 0 && size <= 1000;
};
