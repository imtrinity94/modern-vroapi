/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /(bg|text|border)-(indigo|blue|orange|sky|slate|emerald|purple|amber|rose|red|green|pink|yellow|cyan)-(50|100|400|500|600)/,
      variants: ['dark', 'hover', 'group-hover'],
    },
  ],
  plugins: [],
}
