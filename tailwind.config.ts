import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#14130F",
        card: "#1D1B16",
        border: "#332F26",
        ink: "#EDEAE1",
        muted: "#8C8879",
        ember: "#C4501C",
        olive: "#78815C",
        steel: "#5C7A87",
        brass: "#B8923A",
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
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        shimmer: "shimmer 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
