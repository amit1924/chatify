import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // custom colors for dark shadow/chat look
        chatBg: '#1f2937', // dark slate
        chatPrimary: '#06b6d4', // cyan for highlights
        chatSecondary: '#374151', // slightly lighter for messages
      },
      boxShadow: {
        chat: '0 4px 12px rgba(0, 0, 0, 0.5)', // dark shadow
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['dark'], // default dark theme
  },
};
