/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        cursive: ['Dancing Script', 'cursive'],
      },
      colors: {
        cream: {
          50: '#FFFEFA',
          100: '#FFF8F0', // Warm Cream
          200: '#FFF0E0',
          300: '#FDE4CC',
        },
        peach: {
          50: '#FFF5F0',
          100: '#FCE9DE', // Light Peach
          200: '#FAD8C8', // Soft Peach
          300: '#F5C2AB',
          400: '#EEA286',
          500: '#E48162',
        },
        beige: {
          100: '#F6EEE7',
          200: '#EAD5C5', // Nude Beige
          300: '#DCBEA7',
          400: '#CDA78A',
        },
        ivory: '#FFFCF7', // Warm Ivory
        terracotta: {
          DEFAULT: '#C77B61', // Terracotta Accent
          50: '#FDF6F3',
          100: '#F9EBE6',
          200: '#F1CFBF',
          300: '#E7B199',
          400: '#DC9275',
          500: '#C77B61',
          600: '#B6664C',
          700: '#9E4E36',
          800: '#833924',
          900: '#692716',
        },
        cocoa: {
          DEFAULT: '#765344', // Cocoa Brown
          400: '#946E5E',
          500: '#765344',
          600: '#624234',
        },
        coffee: {
          DEFAULT: '#49352D', // Dark Coffee
          700: '#49352D',
          800: '#3A2821',
          900: '#291A14',
        },
      },
      boxShadow: {
        'soft-peach': '0 4px 20px -2px rgba(250, 216, 200, 0.45)',
        'boutique': '0 10px 30px -5px rgba(118, 83, 68, 0.08)',
        'boutique-hover': '0 20px 35px -5px rgba(199, 123, 97, 0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
