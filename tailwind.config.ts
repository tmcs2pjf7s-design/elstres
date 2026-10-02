import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de RushSystems (rushsystems.es) — herramientas internas (admin/comandero/cocina)
        accent: '#0f2e24',
        'accent-dark': '#0a211a',
        forest: '#0f2e24',
        'forest-light': '#1f4c3d',
        gold: '#b8955e',
        'gold-dark': '#7d6240',
        cream: '#f7f4ef',
        beige: '#ede7df',
        stone: '#6b6a61',

        // Paleta "carta" (negro cálido + ámbar) — web pública de cara al cliente
        ink: '#120D06',
        surface: '#3A2408',
        line: '#3A2A14',
        amber: '#F2A93B',
        'amber-dark': '#C9892C',
        'amber-ink': '#120D06',
        parchment: '#FBF3E4',
        sand: '#CDBBA0',
      },
      fontFamily: {
        display: ['var(--font-anton)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-dmsans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
