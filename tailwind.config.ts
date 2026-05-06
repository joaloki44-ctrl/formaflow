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
          DEFAULT: "#121212", // Anthracite
          foreground: "#F8F9FA",
        },
        secondary: {
          DEFAULT: "#2563EB", // Electric Blue
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#3B82F6", // Lighter Blue
          foreground: "#ffffff",
        },
        cream: "#F8F9FA", // Off-white
        dark: "#0A0A0A",
        muted: "#6B7280",
      },
      fontFamily: {
        serif: ["Inter", "system-ui", "sans-serif"], // Minimalist SaaS prefers clean sans-serif
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-saas": "linear-gradient(135deg, #121212 0%, #1A1A1A 100%)",
        "gradient-blue": "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        }
      },
    },
  },
  plugins: [],
};

export default config;
