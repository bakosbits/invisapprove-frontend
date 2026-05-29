import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        invisapprove: {
          bg: "#0B0F1A",
          surface: "#121828",
          "surface-raised": "#172033",
          border: "#1E2A3F",
          muted: "#2A3547",
          primary: "#5B4FD9",
          "primary-hover": "#4A3FC5",
          "primary-subtle": "rgba(91,79,217,0.15)",
          accent: "#F59E0B",
          pending: "#F59E0B",
          approved: "#10B981",
          rejected: "#F43F5E",
          auto_approved: "#8B5CF6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        input: "4px",
        card: "8px",
        modal: "12px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.5)",
        modal: "0 20px 60px rgba(0,0,0,0.7)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "page-enter": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        "page-enter": "page-enter 0.2s ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;
