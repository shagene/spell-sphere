import type { Config } from "tailwindcss";
const { fontFamily } = require('tailwindcss/defaultTheme');

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...fontFamily.sans],
      },
      colors: {
        'usmc-scarlet': {
          light: '#FF3333',
          DEFAULT: '#CC0000',
          dark: '#990000',
        },
        'usmc-gold': {
          light: '#FFFF00',
          DEFAULT: '#FFC300',
          dark: '#CC9900',
        },
        'navy-blue': {
          light: '#333399',
          DEFAULT: '#000080',
          dark: '#000033',
        },
        background: {
          light: 'var(--background-light)',
          DEFAULT: 'var(--background)',
          dark: 'var(--background-dark)',
        },
        foreground: {
          light: 'var(--foreground-light)',
          DEFAULT: 'var(--foreground)',
          dark: 'var(--foreground-dark)',
        },
        primary: {
          light: 'var(--primary-light)',
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
          foreground: {
            light: 'var(--primary-foreground-light)',
            DEFAULT: 'var(--primary-foreground)',
            dark: 'var(--primary-foreground-dark)',
          },
        },
        secondary: {
          light: 'var(--secondary-light)',
          DEFAULT: 'var(--secondary)',
          dark: 'var(--secondary-dark)',
          foreground: {
            light: 'var(--secondary-foreground-light)',
            DEFAULT: 'var(--secondary-foreground)',
            dark: 'var(--secondary-foreground-dark)',
          },
        },
        muted: {
          light: 'var(--muted-light)',
          DEFAULT: 'var(--muted)',
          dark: 'var(--muted-dark)',
          foreground: {
            light: 'var(--muted-foreground-light)',
            DEFAULT: 'var(--muted-foreground)',
            dark: 'var(--muted-foreground-dark)',
          },
        },
        accent: {
          light: 'var(--accent-light)',
          DEFAULT: 'var(--accent)',
          dark: 'var(--accent-dark)',
          foreground: {
            light: 'var(--accent-foreground-light)',
            DEFAULT: 'var(--accent-foreground)',
            dark: 'var(--accent-foreground-dark)',
          },
        },
        card: {
          light: 'var(--card-light)',
          DEFAULT: 'var(--card)',
          dark: 'var(--card-dark)',
          foreground: {
            light: 'var(--card-foreground-light)',
            DEFAULT: 'var(--card-foreground)',
            dark: 'var(--card-foreground-dark)',
          },
        },
        destructive: {
          light: 'var(--destructive-light)',
          DEFAULT: 'var(--destructive)',
          dark: 'var(--destructive-dark)',
          foreground: {
            light: 'var(--destructive-foreground-light)',
            DEFAULT: 'var(--destructive-foreground)',
            dark: 'var(--destructive-foreground-dark)',
          },
        },
        border: {
          light: 'var(--border-light)',
          DEFAULT: 'var(--border)',
          dark: 'var(--border-dark)',
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
