/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        green: "#1DB954",
        dark: "#191414",
        "light-black": "#282828",
        "black-base": "#121212",
        "black-primary": "#191414",
        "black-secondary": "#171818",
        primary: "#FFFFFF",
        secondary: "#b3b3b3",
        gray: "#535353",
      },
      gridTemplateColumns: {
        "auto-fill-cards": "repeat(auto-fill, minmax(200px, 1fr))",
      },
    },
  },
  plugins: [],
};
