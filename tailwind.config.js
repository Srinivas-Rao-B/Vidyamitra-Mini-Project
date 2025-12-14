/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'vidya-light-pink': '#FFF5F7',
        'vidya-pink': '#EC4899',
        'vidya-dark-pink': '#BE185D',
        'vidya-blue': '#3B82F6',
        'vidya-green': '#10B981',
        'vidya-yellow': '#F59E0B',
        'vidya-gray-50': '#F9FAFB',
        'vidya-gray-100': '#F3F4F6',
        'vidya-gray-500': '#6B7281',
        'vidya-gray-700': '#374151',
        'vidya-gray-900': '#111827',
        // Chart & UI Colors
        'vidya-light-brown': '#B45309',
        'vidya-neon-green': '#39FF14',
        'vidya-neon-pink': '#FF10F0',
        'vidya-neon-blue': '#00BFFF',
        'vidya-neon-orange': '#FFAC1C',
        'vidya-neon-purple': '#A729D6',
      }
    },
  },
  plugins: [],
};
