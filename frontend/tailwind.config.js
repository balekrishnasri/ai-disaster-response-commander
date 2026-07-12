/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        command: {
          950: "#050a12",
          900: "#09111f",
          800: "#101c2e",
          700: "#172940",
        },
      },
      boxShadow: {
        glow: "0 0 30px rgba(34, 211, 238, 0.12)",
      },
    },
  },
  plugins: [],
};
