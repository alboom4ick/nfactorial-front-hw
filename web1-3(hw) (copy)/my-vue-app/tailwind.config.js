/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'telegram-blue': '#54a9eb',
        'telegram-bg': '#f8f9fa',
      }
    },
  },
  plugins: [],
} 