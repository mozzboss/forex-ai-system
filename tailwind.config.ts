import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e6fffb",
          100: "#c6fff0",
          500: "#2dd4bf",
          600: "#14b8a6",
          700: "#0f766e",
          900: "#0b4a44",
        },
        profit: "#22c55e",
        loss: "#ef4444",
        warning: "#f59e0b",
        neutral: "#6b7280",
        surface: {
          DEFAULT: "#060a14",
          light: "#0c1322",
          lighter: "#132039",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
