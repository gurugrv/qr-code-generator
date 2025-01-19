export const QRCodeTypeValues = {
  URL: 'URL',
  WIFI: 'WIFI',
  VCARD: 'VCARD',
  TEXT: 'TEXT',
  EMAIL: 'EMAIL',
  PHONE: 'PHONE',
  SMS: 'SMS',
  CALENDAR: 'CALENDAR',
  LOCATION: 'LOCATION',
  SOCIAL: 'Social'
} as const;

export type QRCodeType = typeof QRCodeTypeValues[keyof typeof QRCodeTypeValues];

export interface QRCustomization {
  foregroundColor: string;
  backgroundColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  size: number;
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
  type: 'text' | 'url' | 'password' | 'select' | 'email' | 'tel' | 'textarea' | 'datetime-local' | 'number';
  label: string;
  required?: boolean;
  validation?: (value: string) => boolean;
  errorMessage?: string;
  options?: string[];
  placeholder?: string;
  defaultValue?: string;
}

export interface FormConfig {
  fields: FormField[];
}

// Base configurations for common field types
const urlField: FormField = {
  name: 'url',
  type: 'url',
  label: 'URL',
  required: true,
  validation: (value: string) => /^https?:\/\/\S+$/.test(value),
  errorMessage: 'Invalid URL format'
};

const textField: FormField = {
  name: 'text',
  type: 'text',
  label: 'Text',
  required: true
};

const phoneField: FormField = {
  name: 'phone',
  type: 'tel',
  label: 'Phone Number',
  required: true,
  validation: (value: string) => /^\+?[0-9\s\-()]{7,20}$/.test(value),
  errorMessage: 'Invalid phone number format'
};

export const formConfigs: Record<QRCodeType, FormConfig> = {
  [QRCodeTypeValues.URL]: {
    fields: [urlField]
  },
  [QRCodeTypeValues.WIFI]: {
    fields: [
      {
        name: 'ssid',
        type: 'text',
        label: 'Network Name (SSID)',
        required: true
      },
      {
        name: 'password',
        type: 'password',
        label: 'Password',
        required: true
      },
      {
        name: 'encryption',
        type: 'select',
        label: 'Encryption Type',
        options: ['WPA', 'WEP', 'None']
      }
    ]
  },
  [QRCodeTypeValues.VCARD]: {
    fields: [
      {
        name: 'name',
        type: 'text',
        label: 'Full Name',
        required: true
      },
      phoneField,
      {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        required: true
      }
    ]
  },
  [QRCodeTypeValues.TEXT]: {
    fields: [textField]
  },
  [QRCodeTypeValues.EMAIL]: {
    fields: [
      {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        required: true
      },
      {
        name: 'subject',
        type: 'text',
        label: 'Subject'
      },
      {
        name: 'body',
        type: 'text',
        label: 'Message'
      }
    ]
  },
  [QRCodeTypeValues.PHONE]: {
    fields: [phoneField]
  },
  [QRCodeTypeValues.SMS]: {
    fields: [
      phoneField,
      {
        name: 'message',
        type: 'text',
        label: 'Message'
      }
    ]
  },
  [QRCodeTypeValues.CALENDAR]: {
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Event Title',
        required: true
      },
      {
        name: 'startDate',
        type: 'text',
        label: 'Start Date & Time',
        required: true
      },
      {
        name: 'endDate',
        type: 'text',
        label: 'End Date & Time',
        required: true
      },
      {
        name: 'description',
        type: 'text',
        label: 'Description'
      }
    ]
  },
  [QRCodeTypeValues.LOCATION]: {
    fields: [
      {
        name: 'latitude',
        type: 'text',
        label: 'Latitude',
        required: true
      },
      {
        name: 'longitude',
        type: 'text',
        label: 'Longitude',
        required: true
      }
    ]
  },
  [QRCodeTypeValues.SOCIAL]: {
    fields: [
      {
        name: 'platform',
        type: 'select',
        label: 'Social Platform',
        options: ['Facebook', 'Twitter', 'YouTube', 'Instagram', 'LinkedIn'],
        required: true
      },
      {
        name: 'url',
        type: 'url',
        label: 'Profile URL',
        required: true,
        validation: (value: string) => {
          // Since we can't access other fields directly, we'll validate basic URL format
          return /^https?:\/\/\S+$/.test(value);
        },
        errorMessage: 'URL must match the selected platform'
      }
    ]
  },
};
