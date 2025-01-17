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
    
    case QRCodeTypeValues.PHONE:
      return `tel:${data.phone}`;
    
    case QRCodeTypeValues.LOCATION:
      return `geo:${data.latitude},${data.longitude}`;
    
    case QRCodeTypeValues.URL:
      return data.url;
    
    case QRCodeTypeValues.TEXT:
    default:
      return data.text || '';
  }
};

export const getQRCodeSize = (size: 'small' | 'medium' | 'large'): number => {
  switch (size) {
    case 'small':
      return 256;
    case 'medium':
      return 512;
    case 'large':
      return 1024;
    default:
      return 512;
  }
};
