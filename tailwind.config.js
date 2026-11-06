/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        petrol: {
          950: 'rgb(var(--color-petrol-950) / <alpha-value>)',
          900: 'rgb(var(--color-petrol-900) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-petrol-900) / <alpha-value>)',
          800: 'rgb(var(--color-petrol-800) / <alpha-value>)',
          700: 'rgb(var(--color-petrol-700) / <alpha-value>)',
          600: 'rgb(var(--color-petrol-600) / <alpha-value>)',
        },
        navy: {
          950: '#030B18',
          900: '#050F22',
          DEFAULT: '#0A1F44',
          800: '#0F2B5C',
          700: '#163B7C',
          600: '#1F4F9F',
        },
        gold: {
          50: '#FBF8EF',
          100: '#F6EED8',
          200: '#EEDBAF',
          300: '#E4C783',
          400: '#D8B65C',
          DEFAULT: '#C9A84C',
          600: '#B08E35',
          700: '#8C6F24',
          800: '#685017',
          900: '#46340D',
        },
        mustard: {
          DEFAULT: 'rgb(var(--color-mustard) / <alpha-value>)',
          hover: 'rgb(var(--color-mustard-hover) / <alpha-value>)',
          light: 'rgb(var(--color-mustard-light) / <alpha-value>)',
        },
        sage: {
          DEFAULT: 'rgb(var(--color-sage) / <alpha-value>)',
          hover: 'rgb(var(--color-sage-hover) / <alpha-value>)',
          light: 'rgb(var(--color-sage-light) / <alpha-value>)',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card-soft': '0 10px 30px -5px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'card-elevated': '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
        'hero-pill': '0 15px 35px -5px rgba(11, 78, 106, 0.25)',
      }
    },
  },
  plugins: [],
}
