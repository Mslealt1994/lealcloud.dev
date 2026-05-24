// tailwind.config.mts
import { type Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        // 1. Lexend se convierte en la fuente por defecto de la app (font-sans)
        sans: ["var(--font-lexend)", "system-ui", "sans-serif"],

        // 2. Creamos la clase para tus títulos de Lato (font-heading)
        heading: ["var(--font-lato)", "system-ui", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--text)",
            "--tw-prose-headings": "var(--text)",
            h1: {
              fontFamily: "var(--font-lato)",
              fontWeight: "900",
              marginBottom: "0.25em",
              fontSize: "2.5rem",
            },
            h2: {
              fontFamily: "var(--font-lato)",
              fontWeight: "700",
              fontSize: "1.25rem",
            },
            "@media (min-width: 768px)": {
              h1: { fontSize: "3.5rem" },
              h2: { fontSize: "1.5rem" },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
