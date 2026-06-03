/**
 * Tailwind CSS Configuration
 * Custom design system for She Can Foundation
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        violet: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        rose: {
          50:  '#fff1f2',
          500: '#f43f5e',
          600: '#e11d48',
        },
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, #1a0533 0%, #2d0a5c 25%, #1e1650 50%, #0a1628 75%, #0f1a3a 100%)',
        'card-gradient':
          'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        'button-gradient':
          'linear-gradient(135deg, #c026d3 0%, #7c3aed 50%, #4f46e5 100%)',
        'accent-gradient':
          'linear-gradient(90deg, #e879f9, #8b5cf6, #38bdf8)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(139, 92, 246, 0.4)',
        'glow-pink': '0 0 30px rgba(236, 72, 153, 0.4)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255,255,255,0.1) inset',
      },
    },
  },
  plugins: [],
};
