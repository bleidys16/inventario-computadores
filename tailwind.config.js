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
          // Los 3 colores exactos de la imagen solicitados:
          600: '#854F6C', // Malva ciruela (acento primario)
          300: '#DFB6B2', // Rosa suave empolvado (bordes y separadores)
          100: '#FBE4D8', // Crema cuarzo claro (fondos sutiles y highlights)
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
