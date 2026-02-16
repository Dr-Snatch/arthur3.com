import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'Dr-Snatch/arthur3.com',
  },
  collections: {
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description' }),
        pubDate: fields.date({ label: 'Publish Date' }),
        heroImage: fields.image({ label: 'Hero Image', directory: 'src/assets', publicPath: '/_astro/' }),
        content: fields.mdx({ label: 'Content' }),
      },
    }),
  },
});
