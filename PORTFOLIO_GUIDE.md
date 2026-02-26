# Portfolio Site Guide

## File Structure

```
src/
├── consts.ts                          ⭐ Site title, about text, social links
├── data/
│   └── projects.ts                   ⭐ Your portfolio projects
├── content/
│   └── blog/                         ⭐ Blog posts (.md or .mdx files)
├── styles/
│   └── global.css                    Global colours and base styles
├── components/
│   ├── Nav.astro                     Navigation bar
│   ├── Footer.astro                  Footer
│   ├── BaseHead.astro                <head> tags (SEO, favicon)
│   ├── FormattedDate.astro           Date formatting helper
│   └── portfolio/
│       ├── Section.astro             Section wrapper with optional alt background
│       └── ProjectCard.astro         Project card component
├── layouts/
│   └── BlogPost.astro                Layout for individual blog posts
└── pages/
    ├── index.astro                   Homepage
    ├── blog/
    │   ├── index.astro               Blog listing page
    │   └── [...slug].astro           Individual blog post page
    └── rss.xml.js                    RSS feed
```

---

## How to Change Things

### Site title, tagline, about text, social links

Open `src/consts.ts` — everything you'd regularly update lives here:

```ts
export const SITE_TITLE = 'Arthur3.com';
export const SITE_DESCRIPTION = 'Your tagline here';
export const ABOUT_TEXT = 'Your about blurb here.';

export const SOCIAL_LINKS = [
  { label: 'GitHub',   href: 'https://github.com/yourusername' },
  { label: 'Twitter',  href: 'https://twitter.com/yourusername' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/yourusername' },
  { label: 'Email',    href: 'mailto:you@example.com' },
];
```

Remove any entry from `SOCIAL_LINKS` to hide that button entirely.

---

### Projects

Open `src/data/projects.ts` and add/edit the array:

```ts
{
  title: 'My Project',
  description: 'What it does and why it matters.',
  link: 'https://github.com/yourusername/project',
  tags: ['React', 'TypeScript'],
}
```

---

### Blog posts

Add a new `.md` file to `src/content/blog/`:

```md
---
title: 'My Post Title'
description: 'A short summary'
pubDate: '2024-01-15'
---

Your content here...
```

---

### Navigation links

Open `src/components/Nav.astro` and edit the `navLinks` array:

```ts
const navLinks = [
  { href: '/',          label: 'Home' },
  { href: '/blog',      label: 'Blog' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#contact',  label: 'Contact' },
];
```

---

### Colours

Open `src/styles/global.css` and edit the `:root` block:

```css
:root {
  --accent: #C62828;       /* Link / highlight colour */
  --accent-dark: #A52020;  /* Hover state */
}
```

The cream background (`#f8ebd5`) is set on `body` in the same file.

---

## Development

```bash
npm run dev      # Start local dev server at localhost:4321
npm run build    # Build for production
npm run preview  # Preview the production build locally
```
