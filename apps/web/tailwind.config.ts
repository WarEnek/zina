import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0f1c',
        panel: '#111a2b',
        accent: '#25c2a0',
      },
    },
  },
  plugins: [],
} satisfies Config
