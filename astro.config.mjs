// @ts-check
import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  server: {
    host: '0.0.0.0',
    port: 4321
  },

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  },

  env: {
    schema: {
      PUBLIC_API_URL: envField.string({ context: 'client', access: 'public' })
    }
  }
});