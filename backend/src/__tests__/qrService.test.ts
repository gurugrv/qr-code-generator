import { generateQRCodeData, getQRCodeSize } from '../services/qrService';
import { QRCodeTypeValues } from '../shared/types';

describe('QR Code Service', () => {
  describe('generateQRCodeData', () => {
    test('generates correct WiFi QR code data', () => {
      const data = {
        ssid: 'MyNetwork',
        password: 'MyPassword',
        encryption: 'WPA'
      };
      
      const result = generateQRCodeData(QRCodeTypeValues.WIFI, data);
      expect(result).toBe('WIFI:T:WPA;S:MyNetwork;P:MyPassword;;');
    });
    
    test('generates correct vCard QR code data', () => {
      const data = {
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john@example.com'
      };
      
      const result = generateQRCodeData(QRCodeTypeValues.VCARD, data);
      expect(result).toBe(
        'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD'
      );
    });
    
    test('generates correct calendar event QR code data', () => {
      const data = {
        title: 'Meeting',
        startDate: '2024-01-01T10:00:00Z',
        endDate: '2024-01-01T11:00:00Z',
        description: 'Team meeting'
      };
      
      const result = generateQRCodeData(QRCodeTypeValues.CALENDAR, data);
      expect(result).toBe(
        'BEGIN:VEVENT\nSUMMARY:Meeting\nDTSTART:20240101T100000Z\nDTEND:20240101T110000Z\nDESCRIPTION:Team meeting\nEND:VEVENT'
      );
    });
    
    test('generates correct URL QR code data', () => {
      const data = {
        url: 'https://example.com'
      };
      
      const result = generateQRCodeData(QRCodeTypeValues.URL, data);
      expect(result).toBe('https://example.com');
    });
    
    test('generates correct email QR code data', () => {
      const data = {
        email: 'test@example.com',
        subject: 'Hello',
        body: 'Test message'
      };
      
      const result = generateQRCodeData(QRCodeTypeValues.EMAIL, data);
      expect(result).toBe('mailto:test@example.com?subject=Hello&body=Test%20message');
    });

    test('generates correct email QR code data with optional fields omitted', () => {
      const data = {
        email: 'test@example.com'
      };
      
      const result = generateQRCodeData(QRCodeTypeValues.EMAIL, data);
      expect(result).toBe('mailto:test@example.com?subject=&body=');
    });

    test('generates correct SMS QR code data', () => {
      const data = {
        phone: '+1234567890',
        message: 'Hello there'
      };
      
      const result = generateQRCodeData(QRCodeTypeValues.SMS, data);
      expect(result).toBe('smsto:+1234567890:Hello there');
    });

    test('generates correct SMS QR code data with optional message omitted', () => {
      const data = {
        phone: '+1234567890'
      };
      
      const result = generateQRCodeData(QRCodeTypeValues.SMS, data);
      expect(result).toBe('smsto:+1234567890:');
    });

    test('generates correct PHONE QR code data', () => {
      const data = {
        phone: '+1234567890'
      };
      
      const result = generateQRCodeData(QRCodeTypeValues.PHONE, data);
      expect(result).toBe('tel:+1234567890');
    });

    test('generates correct LOCATION QR code data', () => {
      const data = {
        latitude: 37.7749,
        longitude: -122.4194
      };
      
      const result = generateQRCodeData(QRCodeTypeValues.LOCATION, data);
      expect(result).toBe('geo:37.7749,-122.4194');
    });

    test('generates correct TEXT QR code data', () => {
      const data = {
        text: 'Hello, World!'
      };
      
      const result = generateQRCodeData(QRCodeTypeValues.TEXT, data);
      expect(result).toBe('Hello, World!');
    });

    test('generates empty string for TEXT type with missing text', () => {
      const data = {};
      
      const result = generateQRCodeData(QRCodeTypeValues.TEXT, data);
      expect(result).toBe('');
    });
  });
  
  describe('getQRCodeSize', () => {
    test('returns correct size for small QR code', () => {
      expect(getQRCodeSize('small')).toBe(256);
    });
    
    test('returns correct size for medium QR code', () => {
      expect(getQRCodeSize('medium')).toBe(512);
    });
    
    test('returns correct size for large QR code', () => {
      expect(getQRCodeSize('large')).toBe(1024);
    });
    
    test('returns medium size as default', () => {
      // @ts-ignore - Testing invalid input
      expect(getQRCodeSize('invalid')).toBe(512);
    });
  });
});
