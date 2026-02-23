/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'area-normal': ['"area-normal"', 'sans-serif']
      }
    }
  },
  plugins: []
};
