export const QRCodeTypeValues = {
  URL: 'URL',
  WIFI: 'WIFI',
  VCARD: 'VCARD',
  TEXT: 'TEXT',
  EMAIL: 'EMAIL',
  PHONE: 'PHONE',
  SMS: 'SMS',
  CALENDAR: 'CALENDAR',
  LOCATION: 'LOCATION'
} as const;

export type QRCodeType = typeof QRCodeTypeValues[keyof typeof QRCodeTypeValues];

export interface QRCustomization {
  foregroundColor: string;
  backgroundColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  size: 'small' | 'medium' | 'large';
  margin: number;
  logo: string | null;
}

export interface QRCodeState {
  type: QRCodeType;
  data: Record<string, any>;
  customization: QRCustomization;
}

export interface FormField {
  name: string;
  type: 'text' | 'url' | 'password' | 'select' | 'email' | 'tel';
  required?: boolean;
  validation?: (value: string) => boolean;
  errorMessage?: string;
  options?: string[];
}

export interface FormConfig {
  fields: FormField[];
}

export const formConfigs: Record<QRCodeType, FormConfig> = {
  [QRCodeTypeValues.URL]: {
    fields: [
      {
        name: 'url',
        type: 'url',
        validation: (value: string) => /^https?:\/\/.+/.test(value),
        errorMessage: 'Please enter a valid URL starting with http:// or https://'
      }
    ]
  },
  [QRCodeTypeValues.WIFI]: {
    fields: [
      {
        name: 'ssid',
        type: 'text',
        required: true
      },
      {
        name: 'password',
        type: 'password',
        required: true
      },
      {
        name: 'encryption',
        type: 'select',
        options: ['WPA', 'WEP', 'None']
      }
    ]
  },
  [QRCodeTypeValues.VCARD]: {
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true
      },
      {
        name: 'phone',
        type: 'tel',
        required: true
      },
      {
        name: 'email',
        type: 'email',
        required: true
      }
    ]
  },
  // Add configurations for other QR types
  [QRCodeTypeValues.TEXT]: {
    fields: [
      {
        name: 'text',
        type: 'text',
        required: true
      }
    ]
  },
  [QRCodeTypeValues.EMAIL]: {
    fields: [
      {
        name: 'email',
        type: 'email',
        required: true
      },
      {
        name: 'subject',
        type: 'text'
      },
      {
        name: 'body',
        type: 'text'
      }
    ]
  },
  [QRCodeTypeValues.PHONE]: {
    fields: [
      {
        name: 'phone',
        type: 'tel',
        required: true
      }
    ]
  },
  [QRCodeTypeValues.SMS]: {
    fields: [
      {
        name: 'phone',
        type: 'tel',
        required: true
      },
      {
        name: 'message',
        type: 'text'
      }
    ]
  },
  [QRCodeTypeValues.CALENDAR]: {
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true
      },
      {
        name: 'startDate',
        type: 'text',
        required: true
      },
      {
        name: 'endDate',
        type: 'text',
        required: true
      },
      {
        name: 'description',
        type: 'text'
      }
    ]
  },
  [QRCodeTypeValues.LOCATION]: {
    fields: [
      {
        name: 'latitude',
        type: 'text',
        required: true
      },
      {
        name: 'longitude',
        type: 'text',
        required: true
      }
    ]
  }
};
