/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'bg-primary': 'var(--bg-primary)',
        'accent-color': 'var(--accent-color)',
      },
      textColor: {
        'text-primary': 'var(--text-primary)',
        'bg-primary': 'var(--bg-primary)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}