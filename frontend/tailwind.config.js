/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          light: '#6366f1',
          dark: '#4338ca',
          contrast: '#1e1b4b',
        },
        secondary: {
          DEFAULT: '#333',
          light: '#4d4d4d',
          dark: '#1a1a1a',
        },
        background: {
          DEFAULT: '#f8fafc',
          dark: '#1a1a1a',
        },
        text: {
          DEFAULT: '#1a1a1a',
          dark: '#f5f5f5',
        },
        border: {
          DEFAULT: '#374151',
          dark: '#374151',
          focus: '#4f46e5',
        },
      },
      spacing: {
        'button-sm': '0.625rem 1rem',
        'button-md': '0.75rem 1.25rem',
        'button-lg': '0.875rem 1.5rem',
      },
      fontSize: {
        'button-sm': '0.75rem',
        'button-md': '0.875rem',
        'button-lg': '1rem',
      },
      borderRadius: {
        button: '3em',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
