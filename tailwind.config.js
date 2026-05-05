/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'mh-navy': '#0B0F19',
        'mh-gold': '#C5A059',
        'mh-gold-light': '#D6B88A',
        'mh-dark': '#05070A',
        'mh-gray': '#1A1D24',
        'old-port': '#8B7355',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
