/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', "ui-sans-serif", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        desk: "0 1px 0 rgba(18, 20, 26, 0.06), 0 12px 32px rgba(18, 20, 26, 0.06)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        ticketdesk: {
          primary: "#B45309",
          "primary-content": "#FFF7ED",
          secondary: "#1F2937",
          "secondary-content": "#F8FAFC",
          accent: "#0F766E",
          "accent-content": "#F0FDFA",
          neutral: "#E5E7EB",
          "neutral-content": "#111827",
          "base-100": "#F3F4F6",
          "base-200": "#E5E7EB",
          "base-300": "#D1D5DB",
          "base-content": "#111827",
          info: "#0369A1",
          success: "#0F766E",
          warning: "#B45309",
          error: "#B91C1C",
        },
      },
    ],
    darkTheme: false,
  },
}
