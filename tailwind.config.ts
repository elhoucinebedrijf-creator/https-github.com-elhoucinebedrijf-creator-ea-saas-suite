import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7f5",
          100: "#dfeae4",
          400: "#4f9d82",
          500: "#2f7d63",
          600: "#236350",
          900: "#123328",
        },
      },
    },
  },
  plugins: [],
};

export default config;
