/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        neutral: {
          white: '#FFFFFF',
          lightest: '#EEEEEE',
          lighter: '#CCCCCC',
          light: '#AAAAAA',
          DEFAULT: '#666666',
          dark: '#444444',
          darker: '#222222',
          darkest: '#000000',
        },
        primary: {
          lightest: '#FAF5EC',
          lighter: '#F5ECDA',
          light: '#DCEB7D',
          DEFAULT: '#CEA346',
          dark: '#A48238',
          darker: '#52411C',
          darkest: '#3D3015',
        },
        secondary: {
          lightest: '#FAEDED',
          lighter: '#F6D0B0',
          light: '#E18183',
          DEFAULT: '#D54B4F',
          dark: '#AA3C3F',
          darker: '#551E1F',
          darkest: '#3F1617',
        },
      },
      fontFamily: {
        heading: ['"Roboto Serif"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        // Escala de encabezados (mobile por defecto, desktop en sm+)
        'h1': ['2.5rem', { lineHeight: '1.2' }], // Mobile: 40px, Desktop: 56px (3.5rem)
        'h2': ['2.25rem', { lineHeight: '1.2' }], // Mobile: 36px, Desktop: 48px (3rem)
        'h3': ['2rem', { lineHeight: '1.2' }], // Mobile: 32px, Desktop: 40px (2.5rem)
        'h4': ['1.5rem', { lineHeight: '1.4' }], // Mobile: 24px, Desktop: 32px (2rem)
        'h5': ['1.25rem', { lineHeight: '1.4' }], // Mobile: 20px, Desktop: 24px (1.5rem)
        'h6': ['1.125rem', { lineHeight: '1.4' }], // Mobile: 18px, Desktop: 20px (1.25rem)
        'tagline': ['1rem', { lineHeight: '1.5' }],
        // Tamaños desktop para usar con responsive
        'h1-desktop': ['3.5rem', { lineHeight: '1.2' }],
        'h2-desktop': ['3rem', { lineHeight: '1.2' }],
        'h3-desktop': ['2.5rem', { lineHeight: '1.2' }],
        'h4-desktop': ['2rem', { lineHeight: '1.3' }],
        'h5-desktop': ['1.5rem', { lineHeight: '1.4' }],
        'h6-desktop': ['1.25rem', { lineHeight: '1.4' }],
      },
      lineHeight: {
        relaxed: '1.5',
      },
      screens: {
        // Breakpoints para aplicar tamaños desktop en sm y superiores
        sm: '640px',
      }
    },
  },
  plugins: [],
} 