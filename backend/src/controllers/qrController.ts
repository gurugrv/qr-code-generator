import { Request, Response } from 'express';
import QRCode from 'qrcode';
import { validateQRInput } from '../validators';
import { generateQRCodeData, getQRCodeSize } from '../services/qrService';
import { QRCodeType, QRCustomization } from '../shared/types';

interface GenerateQRCodeRequest {
  type: QRCodeType;
  data: Record<string, any>;
  customization: QRCustomization;
}

export const generateQRCode = async (req: Request<{}, {}, GenerateQRCodeRequest>, res: Response) => {
  try {
    const { type, data, customization } = req.body;
    
    // Validate input and customization
    const validationResult = validateQRInput(type, data, customization);
    if (!validationResult.success) {
      return res.status(400).json({
        status: 'error',
        message: validationResult.errors
      });
    }
    
    try {
      // Generate QR code data
      const qrData = generateQRCodeData(type, data);
      
      // Generate QR code with customization
      const qrCodeImage = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: customization.errorCorrectionLevel,
        margin: customization.margin,
        color: {
          dark: customization.foregroundColor,
          light: customization.backgroundColor
        },
        width: getQRCodeSize(customization.size)
      });
      
      return res.json({
        status: 'success',
        data: {
          qrCode: qrCodeImage,
          metadata: {
            type,
            createdAt: new Date(),
            ...customization
          }
        }
      });
    } catch (genError) {
      console.error('QR Code generation error:', genError);
      return res.status(422).json({
        status: 'error',
        message: 'Invalid QR code data or customization options'
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred'
    });
  }
};
