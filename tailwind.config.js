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
        "colorprimary":"#046EF6"
      }

    },
  },
  plugins: [],
}
