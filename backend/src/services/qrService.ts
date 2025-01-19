import { QRCodeType, QRCodeTypeValues } from '../shared/types';

const formatDateTime = (date: string): string => {
  const d = new Date(date);
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

export const generateQRCodeData = (type: QRCodeType, data: Record<string, any>): string => {
  switch (type) {
    case QRCodeTypeValues.WIFI:
      return `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};;`;
    
    case QRCodeTypeValues.VCARD:
      return `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
TEL:${data.phone}
EMAIL:${data.email}
END:VCARD`;
    
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
      // Validate phone number format
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
        pa: data.vpa, // payee address (UPI ID)
        pn: data.name, // payee name
        am: data.amount || '', // amount (optional)
        tn: 'Payment', // transaction note
        cu: 'INR' // currency code
      };
      return `upi://pay?${Object.entries(upiData)
        .filter(([_, value]) => value) // Remove empty values
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')}`;
    
    case QRCodeTypeValues.TEXT:
    default:
      return data.text || '';
  }
};

export const validateQRCodeSize = (size: number): boolean => {
  return size > 0 && size <= 1000;
};
