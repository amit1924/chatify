import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neonPink: '#ff00ff',
        neonCyan: '#00ffff',
        neonPurple: '#8000ff',
      },
      boxShadow: {
        neon: '0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        float: 'float 10s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [daisyui],
};
