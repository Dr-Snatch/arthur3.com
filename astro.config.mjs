// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://arthur3.com',
  output: 'server',
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [mdx(), sitemap(), react(), keystatic()],
  prefetch: {
    defaultStrategy: 'hover',
  },
  session: {
    driver: 'memory',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
  vite: {
    build: {
      target: 'es2022',
    },
  },
});
