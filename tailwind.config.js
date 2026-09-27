/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          50: '#f0f7f4',
          100: '#ddede6',
          200: '#bfdccf',
          300: '#94c2af',
          400: '#64a38b',
          500: '#41866f',
          600: '#2f6c58',
          700: '#245647',
          800: '#1b4337',
          900: '#113127',
          950: '#071b14',
        },
        gold: {
          50: '#fcfaf2',
          100: '#f8f2df',
          200: '#f0e3bc',
          300: '#e5cf92',
          400: '#d9b964',
          500: '#c59b27',
          600: '#a87e1a',
          700: '#876017',
          800: '#6e4c19',
          900: '#5c3e19',
          950: '#341f0a',
        },
        cedar: {
          50: '#faf6f2',
          100: '#f3eae1',
          200: '#e6d3c2',
          300: '#d5b79d',
          400: '#bf9475',
          500: '#a77653',
          600: '#8e5f41',
          700: '#734b35',
          800: '#5f3e2e',
          900: '#4e3428',
        },
        cream: {
          50: '#fdfbf7',
          100: '#f8f5ee',
          200: '#eee7d8',
          300: '#dfd4be',
        },
        slate: {
          850: '#172033',
        }
      },
      fontFamily: {
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(27, 67, 55, 0.08)',
        'elevated': '0 10px 30px -4px rgba(27, 67, 55, 0.12)',
        'card': '0 2px 14px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'glass': '0 8px 32px 0 rgba(15, 35, 28, 0.08)',
        'glass-lg': '0 16px 48px -4px rgba(15, 35, 28, 0.15)',
        'glow-gold': '0 0 25px -4px rgba(197, 155, 39, 0.35)',
        'glow-pine': '0 0 30px -6px rgba(27, 67, 55, 0.35)',
        'luxury': '0 20px 40px -15px rgba(7, 27, 20, 0.16), 0 0 0 1px rgba(7, 27, 20, 0.05)',
        'luxury-hover': '0 25px 50px -12px rgba(7, 27, 20, 0.22), 0 0 0 1px rgba(197, 155, 39, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up': 'fadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
