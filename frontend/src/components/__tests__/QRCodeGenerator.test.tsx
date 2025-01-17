import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QRCodeGenerator from '../QRCodeGenerator';
import { QRCodeTypeValues } from '../../types';

describe('QRCodeGenerator', () => {
  test('renders all required form fields for URL type', () => {
    render(<QRCodeGenerator />);
    
    // Select URL type
    const urlTypeButton = screen.getByText('URL');
    fireEvent.click(urlTypeButton);
    
    // Check if URL input field is rendered
    expect(screen.getByLabelText('Enter URL')).toBeInTheDocument();
    
    // Check if customization options are present
    expect(screen.getByLabelText('Foreground Color')).toBeInTheDocument();
    expect(screen.getByLabelText('Background Color')).toBeInTheDocument();
    expect(screen.getByLabelText('Error Correction')).toBeInTheDocument();
    expect(screen.getByLabelText('Size')).toBeInTheDocument();
  });
  
  test('validates URL input', async () => {
    render(<QRCodeGenerator />);
    
    // Select URL type
    fireEvent.click(screen.getByText('URL'));
    
    // Enter invalid URL
    const urlInput = screen.getByLabelText('Enter URL');
    fireEvent.change(urlInput, { target: { value: 'invalid-url' } });
    
    // Check for validation error
    expect(await screen.findByText('Please enter a valid URL starting with http:// or https://')).toBeInTheDocument();
    
    // Enter valid URL
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    
    // Error message should be gone
    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid URL starting with http:// or https://')).not.toBeInTheDocument();
    });
  });
  
  test('generates QR code on valid input', async () => {
    render(<QRCodeGenerator />);
    
    // Select URL type
    fireEvent.click(screen.getByText('URL'));
    
    // Enter valid URL
    fireEvent.change(screen.getByLabelText('Enter URL'), {
      target: { value: 'https://example.com' }
    });
    
    // Wait for QR code to be generated
    const qrCode = await screen.findByTestId('qr-code-preview');
    expect(qrCode).toBeInTheDocument();
  });
  
  test('updates QR code on customization change', async () => {
    render(<QRCodeGenerator />);
    
    // Select URL type and enter valid URL
    fireEvent.click(screen.getByText('URL'));
    fireEvent.change(screen.getByLabelText('Enter URL'), {
      target: { value: 'https://example.com' }
    });
    
    // Get initial QR code
    const initialQrCode = await screen.findByTestId('qr-code-preview');
    const initialSrc = initialQrCode.getAttribute('src');
    
    // Change foreground color
    fireEvent.change(screen.getByLabelText('Foreground Color'), {
      target: { value: '#FF0000' }
    });
    
    // Wait for QR code to update
    await waitFor(() => {
      const updatedQrCode = screen.getByTestId('qr-code-preview');
      expect(updatedQrCode.getAttribute('src')).not.toBe(initialSrc);
    });
  });
  
  test('handles different QR code types', async () => {
    render(<QRCodeGenerator />);
    
    // Test WIFI type
    fireEvent.click(screen.getByText('WiFi'));
    expect(screen.getByLabelText('Network Name (SSID)')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Encryption Type')).toBeInTheDocument();
    
    // Test VCARD type
    fireEvent.click(screen.getByText('vCard'));
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  });
});
