import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F8F9FA",
          foreground: "#121212",
        },
        secondary: {
          DEFAULT: "#2563EB", // Electric Blue
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#3B82F6",
          foreground: "#ffffff",
        },
        cream: "#F8F9FA",
        dark: "#0c0c0c", // Elite Dark
        muted: "#6B7280",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-jakarta)", "serif"],
      },
      backgroundImage: {
        "mesh-gradient": "radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.15) 0, transparent 50%), radial-gradient(at 50% 0%, rgba(59, 130, 246, 0.1) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(37, 99, 235, 0.15) 0, transparent 50%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
        "dark-glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "float": "float 8s ease-in-out infinite",
        "pulse-slow": "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-30px) scale(1.05)" },
        }
      },
      boxShadow: {
        'bento': '0 20px 50px rgba(0,0,0,0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon': '0 0 20px rgba(37, 99, 235, 0.3)',
      }
    },
  },
  plugins: [],
};

export default config;
