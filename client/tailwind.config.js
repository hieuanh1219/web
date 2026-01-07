/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sangtrong: ['tieude'],
        noidung: ['Mulish'],
      },
      colors: {
        "xanh-than": "#0E2038"
      },
    },
  },
  plugins: [],
};
