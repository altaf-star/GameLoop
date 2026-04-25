/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // PlayStation-inspired palette — near-black background with an electric blue accent.
        ps: {
          bg: '#0a0e1a',
          surface: '#121827',
          card: '#1a2235',
          border: '#243049',
          blue: '#0070d1',
          blueLight: '#3b9fff',
          text: '#e6edf7',
          muted: '#8a97b0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(59, 159, 255, 0.35)',
      },
      // Custom keyframes powering the hero background + scroll reveal.
      // Long durations (15-40s) keep motion slow and ambient so text stays readable.
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':      { transform: 'translate(60px, -40px) scale(1.1)' },
          '66%':      { transform: 'translate(-40px, 60px) scale(0.95)' },
        },
        float2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':      { transform: 'translate(-50px, 50px) scale(1.05)' },
          '66%':      { transform: 'translate(50px, -30px) scale(0.9)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '0.7' },
        },
      },
      animation: {
        'marquee':    'marquee 50s linear infinite',
        'float-1':    'float1 18s ease-in-out infinite',
        'float-2':    'float2 22s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
