import type { Config } from "tailwindcss"
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "green": { dark: "#2D5016", mid: "#4A7C2F", light: "#EAF2E3", pale: "#F4FAF0" },
        "amber": { DEFAULT: "#C8860A", light: "#FDF3DC", dark: "#9E6A08" },
        "earth": { brown: "#5C3D1E", tan: "#D4B896", cream: "#FBF6EF" },
        "gray":  { body: "#444444", muted: "#6B7280", border: "#E5E7EB", light: "#F9FAFB" }
      },
      fontFamily: {
        sans:    ["Inter", "sans-serif"],
        display: ["Lora", "Georgia", "serif"]
      },
      spacing: { section: "5rem", "section-sm": "3rem" },
      borderRadius: { card: "0.75rem" },
      boxShadow: {
        card:         "0 2px 12px rgba(45,80,22,0.08)",
        "card-hover": "0 8px 30px rgba(45,80,22,0.15)",
        cta:          "0 4px 20px rgba(200,134,10,0.25)"
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: { "fade-up": "fadeUp 0.6s ease-out forwards" }
    }
  },
  plugins: []
}
export default config