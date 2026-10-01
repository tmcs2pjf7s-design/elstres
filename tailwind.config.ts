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
        // Paleta de RushSystems (rushsystems.es)
        accent: '#0f2e24',
        'accent-dark': '#0a211a',
        forest: '#0f2e24',
        'forest-light': '#1f4c3d',
        gold: '#b8955e',
        'gold-dark': '#7d6240',
        cream: '#f7f4ef',
        beige: '#ede7df',
        stone: '#6b6a61',
        ink: '#0b0b0b',
      },
      fontFamily: {
        display: ['var(--font-baloo)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
