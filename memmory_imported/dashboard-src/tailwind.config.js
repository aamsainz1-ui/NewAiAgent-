/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0b1120',
        'panel': '#111a2b',
        'accent': '#38bdf8',
        'accent-secondary': '#c084fc'
      }
    },
  },
  plugins: [],
}
