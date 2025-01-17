import React from 'react';
import { useQRCode } from '../context/QRCodeContext';
import { QRCustomization } from '../types';
import ColorPicker from './ColorPicker';
import Select from './Select';
import LogoUploader from './LogoUploader';

const CustomizationPanel: React.FC = () => {
  const { state, dispatch } = useQRCode();

  const handleCustomizationUpdate = (
    field: keyof QRCustomization,
    value: QRCustomization[keyof QRCustomization]
  ) => {
    dispatch({
      type: 'UPDATE_CUSTOMIZATION',
      payload: { [field]: value }
    });
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-300">
        Customization
      </h3>
      <div className="space-y-4">
        <ColorPicker
          label="Foreground Color"
          value={state.customization.foregroundColor}
          onChange={(color: string) => handleCustomizationUpdate('foregroundColor', color)}
        />
        <ColorPicker
          label="Background Color"
          value={state.customization.backgroundColor}
          onChange={(color: string) => handleCustomizationUpdate('backgroundColor', color)}
        />
        <Select<'L' | 'M' | 'Q' | 'H'>
          label="Error Correction"
          value={state.customization.errorCorrectionLevel}
          options={['L', 'M', 'Q', 'H']}
          onChange={(level) => handleCustomizationUpdate('errorCorrectionLevel', level)}
        />
        <Select<'small' | 'medium' | 'large'>
          label="Size"
          value={state.customization.size}
          options={['small', 'medium', 'large']}
          onChange={(size) => handleCustomizationUpdate('size', size)}
        />
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Margin
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={state.customization.margin}
            onChange={(e) => handleCustomizationUpdate('margin', parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-500">
            {state.customization.margin} blocks
          </span>
        </div>
        <LogoUploader
          onUpload={(logo: string) => handleCustomizationUpdate('logo', logo)}
        />
      </div>
    </div>
  );
};

export default CustomizationPanel;
