import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'Dr-Snatch/arthur3.com',
  },
  collections: {
    blog: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description' }),
        pubDate: fields.date({ label: 'Publish Date' }),
        updatedDate: fields.date({ label: 'Updated Date' }),
        heroImage: fields.image({ label: 'Hero Image', directory: 'src/assets', publicPath: '/_astro/' }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        content: fields.mdx({ label: 'Content' }),
      },
    }),
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Short Description' }),
        headline: fields.text({ label: 'Headline', description: 'A stronger one-line positioning statement for cards and hero sections.' }),
        problem: fields.text({ label: 'Problem', description: 'What difficult problem does this system solve?' }),
        system: fields.text({ label: 'System', description: 'How is the system designed at a high level?' }),
        result: fields.text({ label: 'Result', description: 'What shipped or what outcome did the work produce?' }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'In Progress', value: 'in-progress' },
            { label: 'Released', value: 'released' },
            { label: 'On Hold', value: 'on-hold' },
            { label: 'Archived', value: 'archived' },
          ],
          defaultValue: 'in-progress',
        }),
        featured: fields.checkbox({ label: 'Featured on homepage?', defaultValue: false }),
        flagship: fields.checkbox({ label: 'Flagship system?', defaultValue: false }),
        tags: fields.text({ label: 'Tags (comma-separated)' }),
        repoUrl: fields.text({ label: 'GitHub URL' }),
        liveUrl: fields.text({ label: 'Live / App Store URL' }),
        pubDate: fields.date({ label: 'Start Date' }),
        content: fields.mdx({ label: 'Full Description' }),
      },
    }),
    labExperiments: collection({
      label: 'Lab Experiments',
      slugField: 'title',
      path: 'src/content/lab/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description' }),
        problem: fields.text({ label: 'Problem', description: 'What technical question or risk prompted this note?' }),
        approach: fields.text({ label: 'Approach', description: 'What did you test or build to answer it?' }),
        result: fields.text({ label: 'Result', description: 'What decision or outcome came from the work?' }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Experiment', value: 'experiment' },
            { label: 'Prototype', value: 'prototype' },
            { label: 'Shipped', value: 'shipped' },
            { label: 'Abandoned', value: 'abandoned' },
          ],
          defaultValue: 'experiment',
        }),
        tags: fields.text({ label: 'Tags (comma-separated)' }),
        liveUrl: fields.text({ label: 'Live Demo URL' }),
        repoUrl: fields.text({ label: 'GitHub URL' }),
        pubDate: fields.date({ label: 'Date' }),
        content: fields.mdx({ label: 'Write-up' }),
      },
    }),
  },
});
