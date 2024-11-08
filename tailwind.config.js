/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',  // Tailwind's blue-700
        secondary: '#F59E0B',  // Tailwind's amber-500
        accent: '#10B981',  // Tailwind's green-500
        dark: '#1F2937',  // Tailwind's gray-800
        light: '#F3F4F6',  // Tailwind's gray-100
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      boxShadow: {
        custom: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}

