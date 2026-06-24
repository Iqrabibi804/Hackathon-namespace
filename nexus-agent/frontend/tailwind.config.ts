import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        blue: {
          primary: '#2563EB',
          light: '#3B82F6',
          lighter: '#93C5FD',
          bg: '#EFF6FF',
        },
        purple: {
          DEFAULT: '#7C3AED',
          light: '#A78BFA',
          bg: '#F5F3FF',
        },
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(37,99,235,0.12)',
        blue: '0 4px 20px rgba(37,99,235,0.25)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        'marquee': 'marquee-scroll 30s linear infinite',
        'blink': 'blink 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
