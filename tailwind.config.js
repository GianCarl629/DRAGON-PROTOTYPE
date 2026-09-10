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
          900: '#13332a',
          950: '#0a1d17',
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
          100: '#f8f4ec',
          200: '#eee6d5',
          300: '#dfd2ba',
        },
        slate: {
          850: '#172033',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(27, 67, 55, 0.08)',
        'elevated': '0 10px 30px -4px rgba(27, 67, 55, 0.12)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
