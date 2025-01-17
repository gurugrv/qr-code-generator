import { QRCodeTypeValues } from '../types';

export const formConfigs: Record<string, { fields: FormField[] }> = {
  [QRCodeTypeValues.URL]: {
    fields: [
      {
        name: 'url',
        type: 'url',
        label: 'Enter URL',
        placeholder: 'https://example.com',
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
        label: 'Network Name (SSID)',
        placeholder: 'MyWiFiNetwork',
        required: true
      },
      {
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Enter password',
        required: true
      },
      {
        name: 'encryption',
        type: 'select',
        label: 'Encryption Type',
        options: ['WPA', 'WEP', 'None'],
        defaultValue: 'WPA'
      }
    ]
  },
  [QRCodeTypeValues.VCARD]: {
    fields: [
      {
        name: 'name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'John Doe',
        required: true
      },
      {
        name: 'phone',
        type: 'tel',
        label: 'Phone Number',
        placeholder: '+1 234 567 890',
        required: true
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'john.doe@example.com'
      }
    ]
  },
  [QRCodeTypeValues.TEXT]: {
    fields: [
      {
        name: 'text',
        type: 'textarea',
        label: 'Enter Text',
        placeholder: 'Type your text here...',
        required: true
      }
    ]
  },
  [QRCodeTypeValues.EMAIL]: {
    fields: [
      {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'recipient@example.com',
        required: true,
        validation: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        errorMessage: 'Please enter a valid email address'
      },
      {
        name: 'subject',
        type: 'text',
        label: 'Subject',
        placeholder: 'Email subject'
      },
      {
        name: 'body',
        type: 'textarea',
        label: 'Message',
        placeholder: 'Type your message here...'
      }
    ]
  },
  [QRCodeTypeValues.PHONE]: {
    fields: [
      {
        name: 'phone',
        type: 'tel',
        label: 'Phone Number',
        placeholder: '+1 234 567 890',
        required: true,
        validation: (value: string) => /^[+]?[\d\s-()]+$/.test(value),
        errorMessage: 'Please enter a valid phone number'
      }
    ]
  },
  [QRCodeTypeValues.SMS]: {
    fields: [
      {
        name: 'phone',
        type: 'tel',
        label: 'Phone Number',
        placeholder: '+1 234 567 890',
        required: true,
        validation: (value: string) => /^[+]?[\d\s-()]+$/.test(value),
        errorMessage: 'Please enter a valid phone number'
      },
      {
        name: 'message',
        type: 'textarea',
        label: 'Message',
        placeholder: 'Type your message here...'
      }
    ]
  },
  [QRCodeTypeValues.CALENDAR]: {
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Event Title',
        placeholder: 'My Event',
        required: true
      },
      {
        name: 'startDate',
        type: 'datetime-local',
        label: 'Start Date & Time',
        required: true
      },
      {
        name: 'endDate',
        type: 'datetime-local',
        label: 'End Date & Time',
        required: true
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'Description',
        placeholder: 'Event description...'
      }
    ]
  },
  [QRCodeTypeValues.LOCATION]: {
    fields: [
      {
        name: 'latitude',
        type: 'number',
        label: 'Latitude',
        placeholder: '0.000000',
        required: true,
        validation: (value: string) => {
          const num = parseFloat(value);
          return !isNaN(num) && num >= -90 && num <= 90;
        },
        errorMessage: 'Please enter a valid latitude (-90 to 90)'
      },
      {
        name: 'longitude',
        type: 'number',
        label: 'Longitude',
        placeholder: '0.000000',
        required: true,
        validation: (value: string) => {
          const num = parseFloat(value);
          return !isNaN(num) && num >= -180 && num <= 180;
        },
        errorMessage: 'Please enter a valid longitude (-180 to 180)'
      }
    ]
  }
};

export type FormConfig = typeof formConfigs;
export type FormField = {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: (value: string) => boolean;
  errorMessage?: string;
  options?: string[];
  defaultValue?: string;
};
