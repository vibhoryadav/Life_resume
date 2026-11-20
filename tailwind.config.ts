import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#F5C542",
          secondary: "#FFD966",
          soft: "#FFF8E5",
          ivory: "#FFFEF8",
          white: "#FFFFFF",
          dark: "#252525",
          muted: "#777777",
          border: "#EFE9D9",
          success: "#238B57",
          error: "#D94B4B",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "Manrope", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px -2px rgba(37, 37, 37, 0.05), 0 4px 16px -4px rgba(37, 37, 37, 0.07)",
        hover: "0 8px 24px -4px rgba(245, 197, 66, 0.2), 0 4px 12px -2px rgba(37, 37, 37, 0.06)",
        badge: "0 1px 3px rgba(245, 197, 66, 0.3)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
