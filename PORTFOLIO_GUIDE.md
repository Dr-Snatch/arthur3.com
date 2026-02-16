# Portfolio Site Guide

## 📁 File Structure

```
src/
├── components/
│   ├── Nav.astro              # Navigation bar
│   └── portfolio/
│       ├── ProjectCard.astro  # Reusable project card
│       └── Section.astro      # Reusable section wrapper
├── data/
│   └── projects.ts            # ⭐ Add projects here!
└── pages/
    └── index.astro            # Main landing page
```

## ✨ How to Add Content

### Adding New Projects

1. Open `src/data/projects.ts`
2. Add a new project to the array:

```typescript
{
  title: 'My Cool Project',
  description: 'What this project does and why it matters.',
  link: 'https://project-url.com',
  tags: ['React', 'TypeScript', 'Design'],
}
```

That's it! The project will automatically appear on your homepage.

### Updating Navigation Links

1. Open `src/components/Nav.astro`
2. Edit the `navLinks` array:

```typescript
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
  // Add more links here
];
```

### Changing Site Information

Edit `src/consts.ts`:

```typescript
export const SITE_TITLE = 'Your Name';
export const SITE_DESCRIPTION = 'Your tagline';
```

### Updating Social Links

In `src/pages/index.astro`, find the Contact Section and update the links:

```astro
<a href="https://github.com/yourusername" target="_blank" class="social-link">GitHub</a>
```

## 🎨 Customizing Styles

### Global Colors

Edit `src/styles/global.css`:

```css
:root {
  --accent: #2337ff;       /* Primary accent color */
  --accent-dark: #000d8a;  /* Darker accent */
}
```

### Component Styles

- **Nav**: `src/components/Nav.astro` (bottom of file)
- **ProjectCard**: `src/components/portfolio/ProjectCard.astro`
- **Section**: `src/components/portfolio/Section.astro`
- **Homepage**: `src/pages/index.astro`

## 🚀 Adding New Sections

Copy this template in `index.astro`:

```astro
<Section id="new-section" background="alt">
  <div class="section-header centered">
    <h2>Section Title</h2>
    <p class="section-description">
      Your description here.
    </p>
  </div>
</Section>
```

## 📝 Quick Tips

- Use `background="alt"` for alternating section colors
- Add `centered` class to center section content
- Project tags automatically style themselves
- All components are responsive by default

## 🔧 Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

**Need help?** All components have clear comments and are designed to be self-explanatory!
