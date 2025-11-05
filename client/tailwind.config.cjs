/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0ea5a4",
        accent: "#06b6d4",
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"], // ✅ आता font-inter class valid आहे
      },
    },
  },
  plugins: [],
};
