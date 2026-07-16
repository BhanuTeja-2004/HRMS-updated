import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          maroon: "#2D1B1E",
          dark: "#1F1214",
          red: "#A31D31",
          "red-hover": "#8B1829",
          pink: "#F8D7DA",
          accent: "#C42B42",
        },
        sidebar: {
          bg: "#2D1B1E",
          active: "#A31D31",
          text: "#F5E6E8",
          muted: "#A8989A",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Segoe UI", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)",
        auth: "0 8px 30px rgba(45,27,30,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
