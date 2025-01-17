import { Request, Response } from 'express';
import { generateQRCode } from '../controllers/qrController';
import { QRCodeTypeValues } from '../shared/types';

// Mock QRCode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('mock-qr-code-data-url')
}));

describe('QR Code Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockResponse = {
      json: mockJson,
      status: mockStatus
    };
  });

  test('successfully generates QR code for valid URL input', async () => {
    mockRequest = {
      body: {
        type: QRCodeTypeValues.URL,
        data: {
          url: 'https://example.com'
        },
        customization: {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          errorCorrectionLevel: 'H',
          size: 'medium',
          margin: 4
        }
      }
    };

    await generateQRCode(mockRequest as Request, mockResponse as Response);

    expect(mockJson).toHaveBeenCalledWith({
      status: 'success',
      data: {
        qrCode: 'mock-qr-code-data-url',
        metadata: expect.objectContaining({
          type: QRCodeTypeValues.URL,
          createdAt: expect.any(Date)
        })
      }
    });
  });

  test('returns error for invalid URL input', async () => {
    mockRequest = {
      body: {
        type: QRCodeTypeValues.URL,
        data: {
          url: 'not-a-valid-url'
        },
        customization: {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          errorCorrectionLevel: 'H',
          size: 'medium',
          margin: 4
        }
      }
    };

    await generateQRCode(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      status: 'error',
      message: expect.arrayContaining(['Invalid URL format'])
    });
  });

  test('successfully generates QR code for SMS type', async () => {
    mockRequest = {
      body: {
        type: QRCodeTypeValues.SMS,
        data: {
          phone: '+1234567890',
          message: 'Hello there'
        },
        customization: {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          errorCorrectionLevel: 'H',
          size: 'medium',
          margin: 4
        }
      }
    };

    await generateQRCode(mockRequest as Request, mockResponse as Response);

    expect(mockJson).toHaveBeenCalledWith({
      status: 'success',
      data: {
        qrCode: 'mock-qr-code-data-url',
        metadata: expect.objectContaining({
          type: QRCodeTypeValues.SMS,
          createdAt: expect.any(Date)
        })
      }
    });
  });

  test('successfully generates QR code for PHONE type', async () => {
    mockRequest = {
      body: {
        type: QRCodeTypeValues.PHONE,
        data: {
          phone: '+1234567890'
        },
        customization: {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          errorCorrectionLevel: 'H',
          size: 'medium',
          margin: 4
        }
      }
    };

    await generateQRCode(mockRequest as Request, mockResponse as Response);

    expect(mockJson).toHaveBeenCalledWith({
      status: 'success',
      data: {
        qrCode: 'mock-qr-code-data-url',
        metadata: expect.objectContaining({
          type: QRCodeTypeValues.PHONE,
          createdAt: expect.any(Date)
        })
      }
    });
  });

  test('successfully generates QR code for LOCATION type', async () => {
    mockRequest = {
      body: {
        type: QRCodeTypeValues.LOCATION,
        data: {
          latitude: 37.7749,
          longitude: -122.4194
        },
        customization: {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          errorCorrectionLevel: 'H',
          size: 'medium',
          margin: 4
        }
      }
    };

    await generateQRCode(mockRequest as Request, mockResponse as Response);

    expect(mockJson).toHaveBeenCalledWith({
      status: 'success',
      data: {
        qrCode: 'mock-qr-code-data-url',
        metadata: expect.objectContaining({
          type: QRCodeTypeValues.LOCATION,
          createdAt: expect.any(Date)
        })
      }
    });
  });

  test('handles missing required fields', async () => {
    mockRequest = {
      body: {
        type: QRCodeTypeValues.WIFI,
        data: {
          // Missing required ssid field
          password: 'password123',
          encryption: 'WPA'
        },
        customization: {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          errorCorrectionLevel: 'H',
          size: 'medium',
          margin: 4
        }
      }
    };

    await generateQRCode(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      status: 'error',
      message: expect.any(Array)
    });
  });

  test('handles QR code generation errors', async () => {
    // Mock QRCode.toDataURL to throw an error
    require('qrcode').toDataURL.mockRejectedValueOnce(new Error('Generation failed'));

    mockRequest = {
      body: {
        type: QRCodeTypeValues.URL,
        data: {
          url: 'https://example.com'
        },
        customization: {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          errorCorrectionLevel: 'H',
          size: 'medium',
          margin: 4
        }
      }
    };

    await generateQRCode(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(422);
    expect(mockJson).toHaveBeenCalledWith({
      status: 'error',
      message: 'Invalid QR code data or customization options'
    });
  });

  test('validates customization options', async () => {
    mockRequest = {
      body: {
        type: QRCodeTypeValues.URL,
        data: {
          url: 'https://example.com'
        },
        customization: {
          foregroundColor: 'invalid-color',
          backgroundColor: '#FFFFFF',
          errorCorrectionLevel: 'invalid',
          size: 'invalid-size',
          margin: -1
        }
      }
    };

    await generateQRCode(mockRequest as Request, mockResponse as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      status: 'error',
      message: expect.any(Array)
    });
  });
});
