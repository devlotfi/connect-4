/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          100: "var(--base-100)",
          200: "var(--base-200)",
        },
        "base-content": "var(--base-content)",
        red: {
          100: "var(--red-100)",
          200: "var(--red-200)",
        },
        yellow: {
          100: "var(--yellow-100)",
          200: "var(--yellow-200)",
        },
        "color-content": "var(--color-content)",
      },
    },
  },
  plugins: [],
};
