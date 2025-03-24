/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#053732',    // Dark background
        accent: '#6000e9',     // Button border
        hover: '#06ffa7',      // Button hover
        text: {
          light: '#ffffff',    // Light text for dark backgrounds
          dark: '#053732',     // Dark text for light backgrounds
        },
        neutral: '#F5F5F5',    // Off-White background
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'georgia': ['Georgia', 'serif'],
      },
      fontSize: {
        'title-lg': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'title': ['20px', { lineHeight: '28px', fontWeight: '700' }],
        'subtitle': ['18px', { lineHeight: '24px', fontWeight: '500' }],
        'body': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'small': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
    },
  },
  plugins: [forms],
} 