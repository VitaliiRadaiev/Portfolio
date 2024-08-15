//const options = require("./config"); //options from config.js



/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/**/**/*.html"],
  darkMode: "class",
  theme: {
    screens: {
      'esm': '390px',
      'sm': '576px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      'xxl': '1536px',

      'sm-max': {'max': '575.98px'},
      'md-max': {'max': '767.98px'},
      'lg-max': {'max': '1023.98px'},
      'xl-max': {'max': '1279.98px'},
      'xxl-max': {'max': '1535.98px'},
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '0rem',
      },
      'screens': {}
    },
    extend: {
      zIndex: {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9'
      },
      screens: {
        'only-mobile': { 'min': '0px', 'max': '767.98px' }
      }
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  future: {
    hoverOnlyWhenSupported: true
  },
  plugins: [],
};
