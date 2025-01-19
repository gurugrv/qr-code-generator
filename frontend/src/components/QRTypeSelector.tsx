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
      default:
        return null;
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center space-x-2">
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
        <span>QR Code Type</span>
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.values(QRCodeTypeValues).map((type) => (
          <div key={type} className={type === QRCodeTypeValues.SOCIAL ? 'col-span-2' : ''}>
            <button
              onClick={() => handleTypeChange(type)}
              className={`
                w-full p-3 rounded-lg text-sm font-medium
                transition-all duration-200 transform
                flex items-center justify-center space-x-2
                ${qrType === type
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-[1.02]'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              `}
            >
              {getTypeIcon(type)}
              <span>{type}</span>
            </button>
            {type === QRCodeTypeValues.SOCIAL && showSocialDropdown && (
              <div className="mt-3 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-100 dark:border-gray-700 shadow-sm">
                <Select
                  label="Social Platform"
                  value={selectedPlatform}
                  options={['Facebook', 'Twitter', 'YouTube', 'Instagram', 'LinkedIn']}
                  onChange={handleSocialPlatformChange}
                  placeholder="Select platform"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRTypeSelector;
