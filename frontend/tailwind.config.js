/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        slideIn: 'slideIn 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
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
          DEFAULT: '#ffffff',
          dark: '#1a1a1a',
        },
        text: {
          DEFAULT: '#000000',
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
