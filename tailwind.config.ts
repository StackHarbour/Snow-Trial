import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B1121",
        surface: "#172136",
        "surface-raised": "#26334A",
        "text-primary": "#F8FAFC",
        "text-secondary": "#94A3B8",
        snow: "#FFFFFF",
        ice: "#7DD3FC",
        storm: "#475569",
        warning: "#F59E0B",
        danger: "#EF4444",
        success: "#10B981",
        brand: "#0EA5E9"
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      boxShadow: {
        'alpine': '0 4px 40px -10px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
};
export default config;