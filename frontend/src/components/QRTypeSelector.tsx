import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QRCodeTypeValues } from '../shared/types';
import type { QRCodeType } from '../shared/types';
import { setType } from '../features/qrConfig/qrConfigSlice';
import { RootState } from '../store/store';
import Select from './Select';

const QRTypeSelector: React.FC = () => {
  const [showSocialDropdown, setShowSocialDropdown] = useState(false);
  const dispatch = useDispatch();
  const qrType = useSelector((state: RootState) => state.qrConfig.type);

  const handleTypeChange = (type: QRCodeType) => {
    if (type === QRCodeTypeValues.SOCIAL) {
      setShowSocialDropdown(true);
    } else {
      setShowSocialDropdown(false);
    }
    dispatch(setType(type));
  };

  const [selectedPlatform, setSelectedPlatform] = useState('');
  
  const handleSocialPlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
  };

  const getTypeIcon = (type: QRCodeType) => {
    switch (type) {
      case QRCodeTypeValues.URL:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case QRCodeTypeValues.TEXT:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        );
      case QRCodeTypeValues.EMAIL:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case QRCodeTypeValues.PHONE:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case QRCodeTypeValues.WIFI:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        );
      case QRCodeTypeValues.VCARD:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
        );
      case QRCodeTypeValues.SOCIAL:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        );
      case QRCodeTypeValues.SMS:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      case QRCodeTypeValues.CALENDAR:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case QRCodeTypeValues.UPI:
       return (
         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
         </svg>
       );
     case QRCodeTypeValues.LOCATION:
       return (
         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
         </svg>
       );
     default:
       return null;
    }
  };

  return (
    <nav className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between min-h-[64px]">
          <div className="flex items-center flex-wrap gap-3 px-1">
            {Object.values(QRCodeTypeValues).map((type) => (
              <div key={type} className="relative group">
                <button
                  onClick={() => handleTypeChange(type)}
                  className={`
                    flex items-center space-x-2.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                    transition-all duration-200 transform hover:scale-105
                    ${
                      qrType === type
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:shadow-sm'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500/40
                  `}
                >
                  <span className={`transform transition-transform duration-200 ${qrType === type ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {getTypeIcon(type)}
                  </span>
                  <span className="tracking-wide">{type}</span>
                </button>
                {type === QRCodeTypeValues.SOCIAL && showSocialDropdown && (
                  <div className="absolute left-0 mt-2 w-64 transform transition-all duration-200 origin-top-left">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200/80 dark:border-gray-700/80 backdrop-blur-sm p-4 animate-fadeIn">
                      <Select
                        label="Social Platform"
                        value={selectedPlatform}
                        options={['Facebook', 'Twitter', 'YouTube', 'Instagram', 'LinkedIn']}
                        onChange={handleSocialPlatformChange}
                        placeholder="Select platform"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default QRTypeSelector;
