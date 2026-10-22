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
          950: '#05222E',
          900: '#073346',
          DEFAULT: '#0B4E6A',
          800: '#0E5D7E',
          700: '#14749D',
          600: '#1B8EBF',
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
          DEFAULT: '#F4B728',
          hover: '#E2A51B',
          light: '#FDE68A',
        },
        sage: {
          DEFAULT: '#27A472',
          hover: '#1F8C60',
          light: '#D1FAE5',
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
