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
        sage: {
          DEFAULT: '#7A9A88',
          50: '#E8EFE9',
          100: '#D4E0D8',
          200: '#B5C9BB',
          300: '#9BB5A5',
          400: '#7A9A88',
          500: '#5C7A68',
          600: '#4A6354',
          700: '#384B40',
          800: '#26322B',
          900: '#141A16',
        },
        gold: {
          DEFAULT: '#C5A065',
          50: '#F7F3EC',
          100: '#EFE6D9',
          200: '#E0D0B8',
          300: '#D4B87A',
          400: '#C5A065',
          500: '#A8824A',
          600: '#86683B',
          700: '#644E2D',
          800: '#42341E',
          900: '#211A0F',
        },
        cream: '#FAF8F5',
        charcoal: '#3D3D3D',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Lato', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(197, 160, 101, 0.4)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 15px rgba(197, 160, 101, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #C5A065 0%, #D4B87A 50%, #C5A065 100%)',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'gold': '0 4px 20px rgba(197, 160, 101, 0.3)',
        'card': '0 10px 40px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
