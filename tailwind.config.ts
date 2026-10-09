import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F2F2F7",
        card: "#FFFFFF",
        border: "#E5E5EA",
        ink: "#1C1C1E",
        muted: "#8E8E93",
        ember: "#E5484D",
        olive: "#34C759",
        steel: "#0A84FF",
        brass: "#F2711C",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "\"SF Pro Text\"", "system-ui", "sans-serif"],
        mono: ["-apple-system", "BlinkMacSystemFont", "\"SF Pro Text\"", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04)",
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
