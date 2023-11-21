/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#16161a",
        secondary: "#252525",
        buttonbg: "#7f5af0",
        buttonTxt: "#fffffe",
        headline: "#fffffe",
        paragraph: "#94a1b2",
        stroke: "#010101",
        hightlight: "#7f5af0",
        tertiary: "#2cb67d",

        bgElem: "#242629",
        bgItem: "#16161a",
      },
    },
  },
  plugins: [],
};
