# arthur3.com

Portfolio, case-study site, and technical notes for Arthur Wheildon.

Built with Astro and deployed to Cloudflare. Content is file-based and editable through Keystatic.

## Stack

- Astro 5
- Cloudflare adapter for server output
- MDX content collections
- React for the persistent terminal UI
- Keystatic for Git-backed content editing

## Main Sections

- `/` home and flagship case-study surface
- `/projects` project index and individual case studies
- `/lab` engineering notes and experiments
- `/blog` blog index and post pages
- `/contact` contact page
- `/keystatic` CMS

## Content Model

Content lives under `src/content/`:

- `blog/` for blog posts
- `projects/` for project case studies
- `lab/` for engineering notes

Schemas are defined in `src/content.config.ts` and the Keystatic editor mirrors those fields in `keystatic.config.ts`.

## Key Files

- `src/pages/index.astro` home page and homepage content wiring
- `src/components/Terminal.jsx` persistent terminal shell and virtual filesystem
- `src/components/Nav.astro` navigation, terminal launcher, and mobile menu
- `src/layouts/SectionPage.astro` shared section landing-page layout
- `src/layouts/BlogPost.astro` blog post layout
- `src/styles/global.css` design tokens and global typography/surface rules
- `src/consts.ts` site metadata and contact links

## Development

```bash
npm install
npm run dev
```

Other useful commands:

- `npm run build` build the site
- `npm run preview` preview the production build

## Notes

- The site runs in Astro `output: "server"` mode for Cloudflare.
- The terminal is a React island loaded through `src/components/TerminalBar.astro`.
- Keystatic stores content in the GitHub repo configured in `keystatic.config.ts`.
