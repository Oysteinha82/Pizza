/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-playfair)"],
        heading: ["var(--font-oswald)"],
      },
      colors: {
        primary: {
          50: "#fff1f1",
          100: "#ffe1e1",
          200: "#ffc7c7",
          300: "#ffa0a0",
          400: "#ff6b6b",
          500: "#ff3d3d",
          600: "#ff1111",
          700: "#e70000",
          800: "#bf0000",
          900: "#9d0000",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
