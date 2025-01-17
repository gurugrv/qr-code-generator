import { QRCodeType, QRCustomization } from '../types';

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

export const generateQRCode = async (
  type: QRCodeType,
  data: Record<string, any>,
  customization: QRCustomization
): Promise<GenerateQRCodeResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/qr-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        data,
        customization,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to generate QR code');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`QR code generation failed: ${error.message}`);
    }
    throw new Error('QR code generation failed');
  }
};
