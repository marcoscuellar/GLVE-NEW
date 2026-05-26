import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A1F3D",
          50: "#E6EAF2",
          100: "#C2CCDC",
          200: "#9AAAC2",
          300: "#7188A8",
          400: "#4F6B92",
          500: "#2E4F7A",
          600: "#1F3A5F",
          700: "#152A47",
          800: "#0A1F3D",
          900: "#06142A",
          950: "#030A18",
        },
        steel: "#4F7396",
        ember: "#C65D1E",
        signal: {
          green: "#22C55E",
          amber: "#F59E0B",
          red: "#EF4444",
        },
        ink: "#0F172A",
        muted: "#64748B",
        line: "#E5E7EB",
        surface: "#F9FAFB",
      },
      fontFamily: {
        sans: ["Geist", "Inter", "system-ui", "sans-serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "JetBrains Mono",
          "Menlo",
          "monospace",
        ],
      },
      letterSpacing: {
        tightest: "-0.05em",
        tighter: "-0.03em",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,.04), 0 10px 30px rgba(15,23,42,.04)",
        "inner-glow": "inset 0 0 0 1px rgba(255,255,255,0.06)",
        "navy-lift":
          "0 1px 2px rgba(3,10,24,.6), 0 24px 60px -20px rgba(3,10,24,.7)",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: ".55", transform: "scale(.85)" },
        },
        trace: {
          "0%": { strokeDashoffset: "240" },
          "100%": { strokeDashoffset: "0" },
        },
        flow: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        pulseDot: "pulseDot 1.6s ease-in-out infinite",
        trace: "trace 2.4s ease-out forwards",
        flow: "flow 2.8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
