/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand navy (button color requested: #00264d) as the primary scale.
        navy: {
          50: '#e8eef6',
          100: '#c6d4e6',
          200: '#93aacb',
          300: '#5f80b0',
          400: '#31578f',
          500: '#123a6b',
          600: '#0a2f57',
          700: '#00264d', // <- primary brand / button color
          800: '#001d3b',
          900: '#001229',
        },
        gold: {
          50: '#fff8e6',
          100: '#ffedbf',
          200: '#ffdd85',
          300: '#ffcb4d',
          400: '#f5a623', // accent
          500: '#e0900f',
          600: '#b8730a',
        },
      },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(0, 38, 77, 0.25)',
        'card-hover': '0 22px 44px -16px rgba(0, 38, 77, 0.38)',
        glow: '0 0 0 4px rgba(245, 166, 35, 0.25)',
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #00264d 0%, #0a2f57 55%, #123a6b 100%)',
        'gold-gradient': 'linear-gradient(135deg, #f5a623 0%, #e0900f 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.55)' },
          '70%': { boxShadow: '0 0 0 16px rgba(37, 211, 102, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        float: 'float 4s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s infinite',
        marquee: 'marquee 22s linear infinite',
      },
    },
  },
  plugins: [],
}
