/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        peach: {
          50: '#fff5f0',
          100: '#ffe6d5',
        },
        orange:{
          50: '#FFDDC0',
          100:'#FF7700'
        }
      },
    },
  },
  plugins: [],
};