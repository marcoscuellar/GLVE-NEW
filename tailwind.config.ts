import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0a0a",
          2: "#525252",
          3: "#a3a3a3",
          4: "#d4d4d4",
        },
        line: {
          DEFAULT: "#e7e5e4",
          soft: "#ededeb",
        },
        paper: "#f5f5f4",
        amber: {
          DEFAULT: "#f59e0b",
          d: "#d97706",
          dd: "#b45309",
          ddd: "#92400e",
          pale: "#fef3c7",
          bg: "#fffbeb",
        },
        red: {
          DEFAULT: "#ef4444",
          d: "#dc2626",
          dd: "#b91c1c",
          ddd: "#7f1d1d",
          pale: "#fee2e2",
          bg: "#fef2f2",
        },
        navy: {
          DEFAULT: "#0A1F3D",
          2: "#1a3052",
          mid: "#4B6177",
          soft: "#8FA3B8",
          fade: "#B8C5D1",
          room: "#0A192F",
        },
        cyan: {
          glow: "#38bdf8",
        },
        green: {
          DEFAULT: "#10b981",
          d: "#059669",
          on: "#4ade80",
        },
      },
      fontFamily: {
        sans: ["Geist", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'Geist Mono'", "ui-monospace", "Menlo", "monospace"],
      },
      borderRadius: {
        "r-1": "4px",
        "r-2": "8px",
        "r-3": "12px",
        "r-4": "14px",
        "r-5": "16px",
        "r-6": "20px",
        "r-7": "28px",
        "r-8": "32px",
        pill: "100px",
      },
      boxShadow: {
        card: "0 12px 32px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)",
        active: "0 30px 60px -10px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.05)",
        modal: "0 30px 80px -20px rgba(0,0,0,0.25)",
      },
      letterSpacing: {
        tightest: "-0.055em",
        tighter: "-0.04em",
      },
      transitionTimingFunction: {
        glve: "cubic-bezier(0.16, 1, 0.3, 1)",
        pop: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
