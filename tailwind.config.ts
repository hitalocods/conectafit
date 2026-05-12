import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',
        graphite: '#111113',
        fog: '#F6F6F7',
        violetGlow: '#A855F7',
        fitGreen: '#31E981',
      },
      boxShadow: {
        premium: '0 24px 80px rgba(0,0,0,.16)',
        glow: '0 0 48px rgba(168,85,247,.28)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
