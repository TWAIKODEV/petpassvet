/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cimavet-dark': '#0B6623',
        'cimavet-light': '#3EA55C',
      },
    },
  },
  plugins: [],
};
