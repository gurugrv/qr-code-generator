import { QRCodeTypeValues, FormField } from '../types';

export const formConfigs: Record<string, { fields: FormField[] }> = {
  [QRCodeTypeValues.URL]: {
    fields: [
      {
        name: 'url',
        type: 'url',
        label: 'Enter URL',
        placeholder: 'https://example.com',
      validation: (value: string) => value.length > 0,
      errorMessage: 'Please enter a URL'
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
        name: 'firstName',
        type: 'text',
        label: 'First Name',
        placeholder: 'John',
        required: true
      },
      {
        name: 'lastName',
        type: 'text',
        label: 'Last Name',
        placeholder: 'Doe',
        required: true
      },
      {
        name: 'address',
        type: 'text',
        label: 'Address',
        placeholder: '123 Main St, City, Country',
        required: false
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
      },
      {
        name: 'jobTitle',
        type: 'text',
        label: 'Job Title',
        placeholder: 'Software Engineer'
      },
      {
        name: 'organization',
        type: 'text',
        label: 'Organization',
        placeholder: 'Acme Corp'
      },
      {
        name: 'website',
        type: 'url',
        label: 'Website URL',
        placeholder: 'https://example.com',
        validation: (value: string) => !value || /^https?:\/\/\S+$/.test(value),
        errorMessage: 'Please enter a valid URL'
      },
      {
        name: 'note',
        type: 'textarea',
        label: 'Note/Description',
        placeholder: 'Additional information...'
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
        validation: (value: string) => /^\+?[0-9\s\-()]{7,20}$/.test(value),
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
        validation: (value: string) => /^\+?[0-9\s\-()]{7,20}$/.test(value),
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
  },
  [QRCodeTypeValues.SOCIAL]: {
    fields: [
      {
        name: 'platform',
        type: 'select',
        label: 'Social Platform',
        options: ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube', 'TikTok'],
        required: true
      },
      {
        name: 'url',
        type: 'url',
        label: 'Profile URL',
        placeholder: 'https://example.com/profile',
        required: true,
        validation: (value: string) => /^https?:\/\/\S+$/.test(value),
        errorMessage: 'Please enter a valid profile URL'
      },
      {
        name: 'username',
        type: 'text',
        label: 'Username',
        placeholder: 'yourusername',
        required: false
      }
    ]
  },
  [QRCodeTypeValues.UPI]: {
    fields: [
      {
        name: 'vpa',
        type: 'text',
        label: 'UPI ID',
        placeholder: 'username@upi',
        required: true,
        validation: (value: string) => /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(value),
        errorMessage: 'Please enter a valid UPI ID'
      },
      {
        name: 'name',
        type: 'text',
        label: 'Payee Name',
        placeholder: 'John Doe',
        required: true
      },
      {
        name: 'amount',
        type: 'number',
        label: 'Amount (₹)',
        placeholder: '0.00',
        validation: (value: string) => {
          if (!value) return true;
          const num = parseFloat(value);
          return !isNaN(num) && num >= 0;
        },
        errorMessage: 'Please enter a valid amount'
      }
    ]
  },
};

export type FormConfig = typeof formConfigs;
