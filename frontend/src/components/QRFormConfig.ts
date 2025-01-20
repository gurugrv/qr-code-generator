import { QRCodeTypeValues, FormField } from '../types';
import { validateEmail, validatePhoneNumber, validateUrl } from '../utils/validation';

export const formConfigs: Record<string, { fields: FormField[] }> = {
  [QRCodeTypeValues.URL]: {
    fields: [
      {
        name: 'url',
        type: 'url',
        label: 'Enter URL',
        placeholder: 'https://example.com',
        validation: (value: string) => validateUrl(value),
        errorMessage: 'Please enter a valid URL with protocol (http:// or https://)'
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
        options: ['WPA', 'WPA2', 'WPA3', 'WEP', 'None'],
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
        required: true,
        validation: (value: string) => value.length > 0 && value.length <= 64,
        errorMessage: 'First name is required (max 64 chars)'
      },
      {
        name: 'lastName',
        type: 'text',
        label: 'Last Name',
        placeholder: 'Doe',
        required: true,
        validation: (value: string) => value.length > 0 && value.length <= 64,
        errorMessage: 'Last name is required (max 64 chars)'
      },
      {
        name: 'phone',
        type: 'tel',
        label: 'Phone Number',
        placeholder: '+1 234 567 890',
        required: true,
        validation: validatePhoneNumber,
        errorMessage: 'Please enter a valid phone number (numbers, +, - and spaces allowed)'
      },
      {
        name: 'mobile',
        type: 'tel',
        label: 'Mobile Number',
        placeholder: '+1 234 567 890',
        required: false,
        validation: (value: string) => !value || validatePhoneNumber(value),
        errorMessage: 'Please enter a valid mobile number (numbers, +, - and spaces allowed)'
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'john.doe@example.com',
        validation: (value: string) => !value || validateEmail(value),
        errorMessage: 'Please enter a valid email address'
      },
      {
        name: 'website',
        type: 'text',
        label: 'Website',
        placeholder: 'https://example.com',
        required: false,
        validation: (value: string) => !value || validateUrl(value),
        errorMessage: 'Please enter a valid URL including protocol (http:// or https://)'
      },
      {
        name: 'organization',
        type: 'text',
        label: 'Company',
        placeholder: 'Acme Corp',
        validation: (value: string) => !value || value.length <= 128,
        errorMessage: 'Organization name must be 128 characters or less'
      },
      {
        name: 'jobTitle',
        type: 'text',
        label: 'Job Title',
        placeholder: 'Software Engineer',
        validation: (value: string) => !value || value.length <= 128,
        errorMessage: 'Job title must be 128 characters or less'
      },
      {
        name: 'address',
        type: 'text',
        label: 'Street Address',
        placeholder: '123 Main St',
        required: false,
        validation: (value: string) => !value || value.length <= 128,
        errorMessage: 'Address must be 128 characters or less'
      },
      {
        name: 'city',
        type: 'text',
        label: 'City',
        placeholder: 'New York',
        required: false,
        validation: (value: string) => !value || value.length <= 64,
        errorMessage: 'City name must be 64 characters or less'
      },
      {
        name: 'postcode',
        type: 'text',
        label: 'Postcode',
        placeholder: '10001',
        required: false,
        validation: (value: string) => !value || value.length <= 16,
        errorMessage: 'Postcode must be 16 characters or less'
      },
      {
        name: 'country',
        type: 'text',
        label: 'Country',
        placeholder: 'United States',
        required: false,
        validation: (value: string) => !value || value.length <= 64,
        errorMessage: 'Country name must be 64 characters or less'
      }
    ]
  },
  [QRCodeTypeValues.TEXT]: {
    fields: [
      {
        name: 'text',
        type: 'textarea',
        label: 'Text Content',
        placeholder: 'Enter your text here...',
        required: true,
        validation: (value: string) => value.length > 0 && value.length <= 2048,
        errorMessage: 'Text is required (max 2048 characters)'
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
        validation: validateEmail,
        errorMessage: 'Please enter a valid email address'
      },
      {
        name: 'subject',
        type: 'text',
        label: 'Subject',
        placeholder: 'Email Subject',
        required: false,
        validation: (value: string) => !value || value.length <= 128,
        errorMessage: 'Subject must be 128 characters or less'
      },
      {
        name: 'body',
        type: 'textarea',
        label: 'Message',
        placeholder: 'Your message...',
        required: false,
        validation: (value: string) => !value || value.length <= 2048,
        errorMessage: 'Message must be 2048 characters or less'
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
        validation: validatePhoneNumber,
        errorMessage: 'Please enter a valid phone number in E.164 format'
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
        validation: validatePhoneNumber,
        errorMessage: 'Please enter a valid phone number in E.164 format'
      },
      {
        name: 'message',
        type: 'textarea',
        label: 'Message',
        placeholder: 'Your message...',
        required: true,
        validation: (value: string) => value.length > 0 && value.length <= 2048,
        errorMessage: 'Message is required (max 2048 characters)'
      }
    ]
  },
  [QRCodeTypeValues.CALENDAR]: {
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Event Title',
        placeholder: 'Meeting with John',
        required: true,
        validation: (value: string) => value.length > 0 && value.length <= 128,
        errorMessage: 'Title is required (max 128 characters)'
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
        placeholder: 'Event details...',
        required: false,
        validation: (value: string) => !value || value.length <= 2048,
        errorMessage: 'Description must be 2048 characters or less'
      }
    ]
  },
  [QRCodeTypeValues.LOCATION]: {
    fields: [
      {
        name: 'latitude',
        type: 'number',
        label: 'Latitude',
        placeholder: '40.7128',
        required: true,
        validation: (value: string) => {
          const num = parseFloat(value);
          return !isNaN(num) && num >= -90 && num <= 90;
        },
        errorMessage: 'Latitude must be between -90 and 90'
      },
      {
        name: 'longitude',
        type: 'number',
        label: 'Longitude',
        placeholder: '-74.0060',
        required: true,
        validation: (value: string) => {
          const num = parseFloat(value);
          return !isNaN(num) && num >= -180 && num <= 180;
        },
        errorMessage: 'Longitude must be between -180 and 180'
      },
      {
        name: 'name',
        type: 'text',
        label: 'Location Name',
        placeholder: 'Statue of Liberty',
        required: false,
        validation: (value: string) => !value || value.length <= 128,
        errorMessage: 'Location name must be 128 characters or less'
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
        placeholder: 'https://example.com/profile',
        required: true,
        validation: validateUrl,
        errorMessage: 'Please enter a valid profile URL'
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
        required: true,
        validation: (value: string) => value.length > 0 && value.length <= 128,
        errorMessage: 'Payee name is required (max 128 characters)'
      },
      {
        name: 'amount',
        type: 'number',
        label: 'Amount (₹)',
        placeholder: '0.00',
        required: false,
        validation: (value: string) => {
          const num = parseFloat(value);
          return !isNaN(num) && num >= 0;
        },
        errorMessage: 'Please enter a valid amount'
      }
    ]
  }
  // ... rest of the existing form configurations remain unchanged
};

export type FormConfig = typeof formConfigs;
