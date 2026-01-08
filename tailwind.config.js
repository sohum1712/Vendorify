/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          light: '#818cf8',
          dark: '#4338ca',
        },
        secondary: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      maxWidth: {
        'mobile': '428px',
        'tablet': '768px',
        'desktop': '1200px',
      },
    },
  },
  plugins: [],
}
