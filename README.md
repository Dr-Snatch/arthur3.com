# arthur3.com

Personal portfolio and blog. Built with Astro, deployed on Cloudflare Pages.

## Stack

- [Astro](https://astro.build) — static site framework
- [Cloudflare Pages](https://pages.cloudflare.com) — hosting, auto-deploys on push to `main`
- Fonts: Syne (headings), Inter (body), JetBrains Mono (code/labels) via Google Fonts
- No JS frameworks — plain Astro components

## Theme

Adapts automatically to the OS/browser preference:
- **Dark** — green hacker (`#080C08` bg, `#00FF41` accent)
- **Light** — clean indigo (`#FAFAFA` bg, `#6366F1` accent)

All colours are CSS custom properties defined in `src/styles/global.css`.

## Customising

Most editable content lives in two files:

**`src/consts.ts`** — site title, description, social links

**`src/data/projects.ts`** — the "other projects" cards below the featured section

Featured projects (BeatMap, RPtext) are defined inline in `src/pages/index.astro`.

## Commands

| Command           | Action                              |
| :---------------- | :---------------------------------- |
| `npm install`     | Install dependencies                |
| `npm run dev`     | Start dev server at localhost:4321  |
| `npm run build`   | Build to `./dist/`                  |
| `npm run preview` | Preview build locally               |

## Structure

```
src/
  components/
    Nav.astro
    Footer.astro
    portfolio/
      ProjectCard.astro
  consts.ts          — site-wide config
  data/
    projects.ts      — other projects list
  pages/
    index.astro      — main portfolio page
    blog/            — blog index and posts
  styles/
    global.css       — CSS variables + base styles
  layouts/
    BlogPost.astro
public/
  favicon.png
  logo.png
```
