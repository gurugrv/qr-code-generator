import { QRCodeType, QRCustomization, QRPatternType } from '../shared/types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface GenerateQRCodeResponse {
  status: 'success' | 'error';
  data?: {
    qrCode: string;
    metadata: {
      type: QRCodeType;
      createdAt: string;
      customization: QRCustomization;
    };
  };
  message?: string;
}

interface GenerateQRCodeParams {
  type: QRCodeType;
  data: {
    content?: string;
    text?: string;
    phone?: string;
    email?: string;
    subject?: string;
    body?: string;
    ssid?: string;
    password?: string;
    encryption?: string;
    name?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    message?: string;
    vpa?: string;
    amount?: number;
    latitude?: number;
    longitude?: number;
  };
  customization: {
    size: number;
    foregroundColor: string;
    backgroundColor: string;
    margin: number;
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  };
}

export const generateQRCode = async (
  params: GenerateQRCodeParams
): Promise<GenerateQRCodeResponse> => {
  try {
    const { type, data, customization } = params;
    const content = data.content || '';

    // Prepare data based on QR code type
    let requestData;
    switch (type) {
      case 'TEXT':
        requestData = {
          type,
          data: { text: data.text || content },
          customization
        };
        break;
      case 'URL':
        requestData = {
          type,
          data: { content: !content.startsWith('http') ? `https://${content}` : content },
          customization
        };
        break;
      case 'PHONE': {
        // Validate phone number format
        const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
        if (!phoneRegex.test(data.phone || '')) {
          throw new Error('Invalid phone number format');
        }
        
        requestData = {
          type,
          data: {
            phone: (data.phone || '').replace(/[^0-9+\-]/g, '')
          },
          customization
        };
        break;
      }
      case 'WIFI':
        requestData = {
          type,
          data: {
            ssid: data.ssid,
            password: data.password,
            encryption: data.encryption
          },
          customization
        };
        break;
      case 'VCARD':
        requestData = {
          type,
          data,
          customization
        };
        break;
      case 'EMAIL':
        requestData = {
          type,
          data: {
            email: data.email,
            subject: data.subject,
            body: data.body
          },
          customization
        };
        break;
      case 'SMS':
        requestData = {
          type,
          data: {
            phone: data.phone,
            message: data.message
          },
          customization
        };
        break;
      case 'CALENDAR':
        requestData = {
          type,
          data: {
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description
          },
          customization
        };
        break;
      case 'UPI':
        requestData = {
          type,
          data: {
            vpa: data.vpa,
            name: data.name,
            amount: data.amount
          },
          customization
        };
        break;
      case 'LOCATION':
        requestData = {
          type,
          data: {
            latitude: data.latitude,
            longitude: data.longitude
          },
          customization
        };
        break;
      default:
        requestData = {
          type,
          data: { content },
          customization
        };
    }

    const response = await fetch(`${API_BASE_URL}/api/qr-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (!response.ok) {
      const error = new Error(result.message || 'Failed to generate QR code');
      (error as any).status = response.status;
      (error as any).code = result.code || 'UNKNOWN';
      throw error;
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      const newError = new Error(`QR code generation failed: ${error.message}`);
      (newError as any).status = (error as any).status;
      (newError as any).code = (error as any).code || 'UNKNOWN';
      throw newError;
    }
    const newError = new Error('QR code generation failed');
    (newError as any).status = 500;
    (newError as any).code = 'UNKNOWN';
    throw newError;
  }
};
