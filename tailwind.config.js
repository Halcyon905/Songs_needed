/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      fontFamily: 
      {
        'primary': ['Rubik', ...defaultTheme.fontFamily.sans],
        'body': ['"Noto Sans"', ...defaultTheme.fontFamily.sans],
      }
    }
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
}

