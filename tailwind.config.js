/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        heliox: { 50: '#fff7ed', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c' },
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'none' } },
        pulseRing: { '0%': { transform: 'scale(1)', opacity: '0.6' }, '100%': { transform: 'scale(1.8)', opacity: '0' } },
      },
      animation: { fadeUp: 'fadeUp .4s ease-out both', pulseRing: 'pulseRing 2s ease-out infinite' },
    },
  },
  plugins: [],
};
