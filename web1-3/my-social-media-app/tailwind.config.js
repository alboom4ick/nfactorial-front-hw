/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        },
        'primary-blue': '#0088cc',
        'light-blue': '#54a9eb',
        'dark-blue': '#006bb3',
        'bg-primary': '#ffffff',
        'bg-secondary': '#f4f4f5',
        'text-primary': '#000000',
        'text-secondary': '#707579',
        'border-color': '#e4e4e7',
        'message-out': '#effdde',
        'message-in': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      }
    },
    animation: {
      'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      'pulse-medium': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) 200ms infinite',
      'pulse-slow': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) 400ms infinite',
    }
  },
  plugins: [],
} 