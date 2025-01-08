import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        darkTeal: "#264C59",
        lightTeal: "#ACC6C9",
        offWhite: "#F1F1EC"
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
