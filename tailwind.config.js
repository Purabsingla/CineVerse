/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "deep-space": "linear-gradient(135deg, #000000, #001f3f)",
        "deep-space-2": "linear-gradient(to bottom left, #001f3f, #000000)",
      },
    },
  },
  plugins: [],
};
