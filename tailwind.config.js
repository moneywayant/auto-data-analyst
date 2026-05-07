/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#172033',
        mist: '#f4f7fb',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(23, 32, 51, 0.08)',
      },
    },
  },
  plugins: [],
};
