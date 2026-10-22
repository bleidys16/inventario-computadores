/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          600: '#854F6C', // Acento primario, botones CTA, títulos destacados, estados activos
          300: '#DFB6B2', // Bordes estructurales de tarjetas y tablas, separadores tenues
          100: '#FBE4D8', // Fondos tenues de badges, resaltados, contenedor de chips y hovers
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'brand-soft': '0 4px 20px -2px rgba(133, 79, 108, 0.08)',
        'card-light': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
