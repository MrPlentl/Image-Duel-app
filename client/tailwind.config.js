/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#080706',
          900: '#0e0d0b',
          800: '#161410',
          700: '#1e1b16',
          600: '#2a261f',
          500: '#3a352b',
        },
        gold: {
          300: '#e8d19a',
          400: '#d4a853',
          500: '#b8892e',
          600: '#9a6e1a',
        },
        fog: {
          100: '#f2ede6',
          200: '#e0d9cf',
          300: '#c4bdb2',
          400: '#9a9189',
          500: '#6b6259',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"DM Mono"', '"Courier New"', 'monospace'],
        body: ['"DM Mono"', 'monospace'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out forwards',
        slideLeft: 'slideLeft 0.3s ease-out forwards',
        slideRight: 'slideRight 0.3s ease-out forwards',
        scaleIn: 'scaleIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};
