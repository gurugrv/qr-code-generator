import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import QRTypeSelector from './QRTypeSelector';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg sticky top-[57px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <div className="flex justify-end md:hidden py-3">
          <button
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <span className="transition-transform duration-200">
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden transform transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="pb-4 space-y-2">
            <QRTypeSelector />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="py-3">
            <QRTypeSelector />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
