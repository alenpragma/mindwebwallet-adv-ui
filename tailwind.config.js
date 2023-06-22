/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        'container': '1150px',
      },
      colors:{
        "colorprimary":" #FF971D",
        "bg":"#222"
      },
      fontFamily: {
        'josefin': "'Josefin Sans', sans-serif",
       
      }

    },
  },
  plugins: [],
}
