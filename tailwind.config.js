/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Futuristic Dark Theme Palette
        background: '#0f172a', // Deep Slate
        surface: '#1e293b', // Slate 800
        primary: {
          DEFAULT: '#0ea5e9', // Sky Blue
          glow: '#38bdf8', // Light Blue
        },
        accent: {
          cyan: '#06b6d4', // Cyan
          purple: '#8b5cf6', // Violet
          neon: '#00f0ff', // Bright Cyan for heavy glow
        },
        text: {
          main: '#f8fafc', // Slate 50
          muted: '#94a3b8', // Slate 400
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 3s infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { textShadow: '0 0 10px rgba(14, 165, 233, 0.5)' },
          '100%': { textShadow: '0 0 20px rgba(14, 165, 233, 1), 0 0 30px rgba(6, 182, 212, 0.8)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.15) 0%, rgba(15, 23, 42, 0) 50%)',
      },
    },
  },
  plugins: [],
}

