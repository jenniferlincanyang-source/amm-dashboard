/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "geek-blue": "#00d4ff",
        "neon-green": "#39ff14",
        dark: {
          900: "#0a0e1a",
          800: "#111827",
          700: "#1e293b",
        },
      },
    },
  },
  plugins: [],
};
