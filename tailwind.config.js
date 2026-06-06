/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Outfit"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        sky: {
          950: '#030712',
          900: '#060d1f',
          800: '#0b1a3a',
        },
        frost: {
          400: '#7dd3fc',
          500: '#38bdf8',
          600: '#0ea5e9',
        },
        ember: {
          400: '#fb923c',
          500: '#f97316',
        },
      },
      animation: {
        shimmer:  'shimmer 1.6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.4s ease-out both',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
