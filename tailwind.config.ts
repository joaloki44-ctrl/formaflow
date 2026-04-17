import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a1a1a",
          foreground: "#f5f5f5",
        },
        secondary: {
          DEFAULT: "#ff6b4a",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#6366f1",
          foreground: "#ffffff",
        },
        cream: "#faf9f6",
        dark: "#0a0a0a",
        muted: "#888888",
      },
      fontFamily: {
        serif: ["Instrument Serif", "Georgia", "serif"],
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-warm": "linear-gradient(135deg, #ff6b4a 0%, #f09340 100%)",
        "gradient-cool": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      },
    },
  },
  plugins: [],
};

export default config;