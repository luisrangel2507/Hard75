import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FBF6EC",
        card: "#FFFFFF",
        border: "#EDE1CC",
        ink: "#28211A",
        muted: "#9A8C77",
        ember: "#FF3D7F",
        olive: "#0FBFA0",
        steel: "#2FADF0",
        brass: "#FF6B45",
      },
      fontFamily: {
        sans: ["var(--font-label)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(0,0,0,0.4)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "wave-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        bubble: {
          "0%": { transform: "translateY(0) scale(0.7)", opacity: "0" },
          "15%": { opacity: "0.8" },
          "100%": { transform: "translateY(-55px) scale(1.1)", opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        shimmer: "shimmer 2s ease-in-out infinite",
        "wave-slow": "wave-scroll 6s linear infinite",
        "wave-fast": "wave-scroll 3.5s linear infinite",
        bubble: "bubble 3s ease-in infinite",
      },
    },
  },
  plugins: [],
};

export default config;
