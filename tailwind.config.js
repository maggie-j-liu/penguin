const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
<<<<<<< Updated upstream
        sans: ["'Space Grotesk'", ...defaultTheme.fontFamily.sans],
=======
        sans: ["Playfair Display"],
>>>>>>> Stashed changes
      },
    },
  },
  plugins: [],
};
