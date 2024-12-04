/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          primary: 'var(--primary-color)',
          secondary: 'var(--secondary-color)',
          accent: 'var(--accent-color)',
        },
      },
      backgroundColor: {
        theme: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
        },
      },
      textColor: {
        theme: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
