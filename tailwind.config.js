/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        ink: "#121417",
        graphite: "#2a2f36",
        mist: "#f6f7f8",
        line: "#dde2e7",
      },
      boxShadow: {
        soft: "0 16px 50px rgba(18, 20, 23, 0.08)",
      },
    },
  },
  plugins: [],
};
