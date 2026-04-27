/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6B4EFF',
          600: '#5B3EFF',
          700: '#4C1D95',
          900: '#1E1B4B',
        },
        gold: {
          DEFAULT: '#F59E0B',
          500: '#F59E0B',
          600: '#D97706',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(107, 78, 255, 0.4)',
        'glow-lg': '0 0 40px rgba(107, 78, 255, 0.6)',
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.4)',
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(to bottom right, #1E1B4B, #000000)',
        'gradient-gold': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(107, 78, 255, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(107, 78, 255, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}