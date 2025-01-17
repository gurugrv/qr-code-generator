import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders QR code generator', () => {
    render(<App />);
    expect(screen.getByText(/QR Code Generator/i)).toBeInTheDocument();
  });

  test('renders with proper layout', () => {
    render(<App />);
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('container', 'mx-auto', 'p-4');
  });
});
