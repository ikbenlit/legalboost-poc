/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E2A44',    // Dark Blue
        accent: '#FF7800',     // Bright Orange
        neutral: '#F5F5F5',    // Off-White
        secondary: '#A3BFFA',  // Muted Green
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
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 