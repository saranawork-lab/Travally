/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Travally Primary Brand: Vibrant Emerald & Forest Green
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        // Travally Travel & Adventure Accent: Energetic Warm Orange
        travel: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        // Modern Dark Theme Surface Colors (Deep slate with emerald undertone)
        dark: {
          bg: "#090d0b",
          surface: "#0f1613",
          card: "#131c18",
          elevated: "#18241f",
          border: "rgba(34, 197, 94, 0.12)",
          borderHover: "rgba(34, 197, 94, 0.25)",
        },
        // Override teal to map cleanly into the new Green palette for backward-compatibility
        teal: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        // Override amber to map cleanly into the new Orange palette for backward-compatibility
        amber: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(34, 197, 94, 0.3)",
        "glow-green": "0 0 25px -5px rgba(34, 197, 94, 0.35)",
        "glow-travel": "0 0 25px -5px rgba(249, 115, 22, 0.35)",
        "glow-orange": "0 0 25px -5px rgba(249, 115, 22, 0.35)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer: "shimmer 2.5s ease-in-out infinite",
        "pulse-slow": "pulseSlow 8s ease-in-out infinite",
        "telegram-pop": "telegram-pop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "telegram-float": "telegram-float 2.8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-150%) skewX(-15deg)" },
          "100%": { transform: "translateX(250%) skewX(-15deg)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.08)" },
        },
        "telegram-pop": {
          "0%": { transform: "scale(0.85)" },
          "50%": { transform: "scale(1.22)" },
          "100%": { transform: "scale(1)" },
        },
        "telegram-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
      },
    },
  },
  plugins: [],
};
