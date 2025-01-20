import { Request, Response } from 'express';
import QRCode from 'qrcode';
import { Canvas, Image, loadImage } from 'canvas';
import { validateQRInput } from '../validators';
import { generateQRCodeData } from '../services/qrService';
import { QRCodeType, QRCustomization } from '../shared/types';

interface GenerateQRCodeRequest {
  type: QRCodeType;
  data: Record<string, any>;
  customization: QRCustomization;
}

export const generateQRCode = async (req: Request<{}, {}, GenerateQRCodeRequest>, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        status: 'error',
        message: 'Request body is required'
      });
    }

    const { type, data, customization } = req.body;
    
    if (!type || !data || !customization) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: type, data, or customization'
      });
    }

    // Validate input
    const validationResult = validateQRInput(data, type);
    if (!validationResult.isValid) {
      return res.status(400).json({
        status: 'error',
        message: validationResult.errors.join(', ')
      });
    }
    
    try {
      // Generate QR code data
      const qrData = generateQRCodeData(type, data);
      
      // Generate QR code with customization
      const canvas = new Canvas(customization.size, customization.size);
      const ctx = canvas.getContext('2d');

      // Generate QR code
      const qrCodeImage = await QRCode.toCanvas(canvas, qrData, {
        margin: customization.margin,
        errorCorrectionLevel: customization.errorCorrectionLevel,
        color: {
          dark: customization.foregroundColor,
          light: customization.backgroundColor
        },
        width: customization.size
      });

      // If logo is provided, overlay it on the QR code
      if (customization.logo) {
        try {
          const logoSize = Math.floor(customization.size * 0.2); // 20% of QR code size
          const logo = await loadImage(customization.logo);
          
          // Calculate center position
          const x = (customization.size - logoSize) / 2;
          const y = (customization.size - logoSize) / 2;
          
          // Create white background for logo
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);
          
          // Draw logo
          ctx.drawImage(logo, x, y, logoSize, logoSize);
        } catch (logoError) {
          console.error('Error loading logo:', logoError);
        }
      }

      const qrCodeDataUrl = canvas.toDataURL();
      
      return res.json({
        status: 'success',
        data: {
          qrCode: qrCodeDataUrl,
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
