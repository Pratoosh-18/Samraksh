import defaultTheme from "tailwindcss/defaultTheme";
/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          50: '#fdf0eb',  
          100: '#fbdad1', 
          200: '#f8b9a7', 
          300: '#f59774',  
          400: '#f07542',  
          500: '#ED5722',  
          600: '#d14e1f',  
          700: '#b2451b',  
          800: '#923a16',  
          900: '#733010',  
        },
        accent: {
          50: '#E5F6F7',  
          100: '#C4E7E9',
          200: '#A0D7D9',
          300: '#7BC6C8',
          400: '#5BAEAE',
          500: '#105161',  
          600: '#0E4B4C',
          700: '#0B3738',
          800: '#092A2B',
          900: '#061B1C',  
        },
      },
      animation: {
        'bounce-slow': 'bounce-slow 2.5s infinite',
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(-20%)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
