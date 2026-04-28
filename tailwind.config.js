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
        medical: {
          blue: '#0A2472',
          teal: '#0EAD69',
          light: '#F8FAFC',
          gray: '#E2E8F0',
          dark: '#1E293B',
        },
        alert: {
          danger: '#EF4444',
          warning: '#F59E0B',
          success: '#10B981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
