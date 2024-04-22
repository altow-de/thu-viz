import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");
const config: Config = {
  relative: true,
  darkMode: "class",
  content: ["./node_modules/react-tailwindcss-datepicker/dist/index.esm.js", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },

    colors: {
      ...colors,
      danube: {
        50: "#f2f7fc",
        100: "#e1eef8",
        200: "#cae2f3",
        300: "#a6d0ea",
        400: "#7bb6df",
        500: "#5b9bd5",
        600: "#4883c8",
        700: "#3e70b7",
        800: "#375c96",
        900: "#314d77",
        950: "#223149",
      },
      "red-custom": "#963748",
      "gray-custom": "#8c9192",
      "magenta-downcast": "#7B00F6",
      "magenta-bottom": "#BF39D5",
      "green-castcheck": "#287233",
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class", // only generate classes
    }),
  ],
};
export default config;
