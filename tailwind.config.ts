import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // 黒紫テーマのカスタムカラー
        'dark-purple': {
          50: '#f8f7ff',
          100: '#f0eeff',
          200: '#e0dcff',
          300: '#c7bfff',
          400: '#a897ff',
          500: '#8a6bff',
          600: '#7c3aff',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        'night': {
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#d9d9de',
          300: '#b8b8c4',
          400: '#9191a5',
          500: '#74748a',
          600: '#5e5e73',
          700: '#4d4d5e',
          800: '#42424f',
          900: '#3a3a45',
          950: '#1a1a20',
        },
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
export default config
