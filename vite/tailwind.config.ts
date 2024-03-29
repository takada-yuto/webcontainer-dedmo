import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      lineHeight: {
        custom: "150px",
      },
      width: {
        custom: "500px",
      },
    },
  },
  plugins: [],
  mode: "jit",
} satisfies Config
