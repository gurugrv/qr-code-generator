import React from 'react';

interface AppLogoProps {
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 ${className}`}>
      <img 
        src="/logo192.png" 
        alt="QR Generator Logo"
        className="w-8 h-8"
      />
      <div className="text-white font-bold text-xl">
        QR Generator
      </div>
    </div>
  );
};

export default AppLogo;