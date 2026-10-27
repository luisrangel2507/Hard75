import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0908",
        card: "#15110F",
        border: "#2B2321",
        ink: "#F7F2ED",
        muted: "#A59B94",
        ember: "#FF5C5C",
        olive: "#22C55E",
        steel: "#2F8CFF",
        brass: "#F4722B",
        panel: "#080605",
      },
      fontFamily: {
        sans: ["var(--font-pixel)", "-apple-system", "system-ui", "sans-serif"],
        pixel: ["var(--font-pixel)", "ui-monospace", "monospace"],
        mono: ["-apple-system", "BlinkMacSystemFont", "\"SF Pro Text\"", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.35)",
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
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        shine: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(320%)" },
        },
        "level-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "xp-pop": {
          "0%": { transform: "translateY(8px) scale(0.8)", opacity: "0" },
          "20%": { transform: "translateY(0) scale(1.1)", opacity: "1" },
          "100%": { transform: "translateY(-28px) scale(1)", opacity: "0" },
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
        "xp-pop": "xp-pop 1.4s ease-out forwards",
        blink: "blink 1s steps(1) infinite",
        shine: "shine 2.6s ease-in-out infinite",
        "level-bounce": "level-bounce 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
