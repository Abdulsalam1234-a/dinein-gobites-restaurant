/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030B18',
          900: '#050F22',
          DEFAULT: '#0A1F44', // Specified Navy Blue
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
          DEFAULT: '#C9A84C', // Specified Gold
          600: '#B08E35',
          700: '#8C6F24',
          800: '#685017',
          900: '#46340D',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-sm': '0 0 15px rgba(201, 168, 76, 0.15)',
        'gold-md': '0 0 25px rgba(201, 168, 76, 0.25)',
        'gold-lg': '0 0 40px rgba(201, 168, 76, 0.35)',
        'navy-deep': '0 20px 40px -15px rgba(3, 11, 24, 0.9)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
