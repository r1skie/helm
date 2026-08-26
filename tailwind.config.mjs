/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dynamic: 'rgb(var(--color-dynamic) / <alpha-value>)',
        content: 'rgb(var(--color-content) / <alpha-value>)',
        altwhite: 'rgb(var(--color-altwhite) / <alpha-value>)',
        base: 'rgb(var(--color-base) / <alpha-value>)',
        sidebar: 'rgb(var(--color-sidebar) / <alpha-value>)',
        item: 'rgb(var(--color-item) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)',
      },
      borderRadius: { '2xl': '1rem' },
    },
  },
  plugins: [],
};

export default config;
