import React from 'react';
import { Link } from 'react-router-dom';

interface AppLogoProps {
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ className }) => {
  return (
    <Link 
      to="/"
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-contrast transition-all duration-300 ${className}`}
      aria-label="Home"
    >
      <img 
        src="/logo192.png" 
        alt="QR Generator Logo"
        className="w-8 h-8"
      />
      <div className="text-white font-bold text-xl">
        QR Code Generator
      </div>
    </Link>
  );
};

export default AppLogo;
