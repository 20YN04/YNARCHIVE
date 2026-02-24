/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'area-normal': ['"area-normal"', 'sans-serif'],
        'area-normal-light': ['"area-normal-light"', 'sans-serif'],
        'area-extended': ['"area-extended"', 'sans-serif'],
        'area-extended-light': ['"area-extended-light"', 'sans-serif']
      }
    }
  },
  plugins: []
};
