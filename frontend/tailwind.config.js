/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
    colors: {
         hull: '#0E1116',
         panel: '#212A38',
         panel2: '#2B3648',
         line: '#4A5568',
         amber: '#F2A93B',
         compass: '#6FA5FF',
         ink: '#FFFFFF',
         mute: '#C7CFDA',
         good: '#5FD68A',
         bad: '#F26B5B',
}, 
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        instrument: 'inset 0 0 0 1px #4A5568, 0 8px 24px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}
