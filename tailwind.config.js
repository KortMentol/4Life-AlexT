/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Активируем темную тему по классу
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007bff',
        'primary-dark': '#0056b3',
        'primary-darker': '#003d80',
        secondary: '#6c757d',
        accent: '#1e3a8a',
        background: {
          DEFAULT: '#f9fafb',
          dark: '#1a1a1a'
        },
        text: {
          DEFAULT: '#333333',
          dark: '#e5e5e5'
        },
        "4life-blue": '#007bff',
        "4life-green": '#28a745',
        "4life-purple": '#6f42c1',
        "4life-yellow": '#ffc107',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        heading: ['Merriweather', 'serif'],
        display: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        'glass-sm': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        'glass-md': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        '4life': '0 4px 6px -1px rgba(0, 123, 255, 0.1), 0 2px 4px -2px rgba(0, 123, 255, 0.06)',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '180': '45rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      maxWidth: {
        '8xl': '90rem',
      },
    },
  },
  plugins: [],
};
