# 📂 Easy-to-Understand File Structure

## Where Everything Lives

```
arthur3.com/
│
├── 📄 PORTFOLIO_GUIDE.md          ← Read this for instructions!
├── 📄 FILE_STRUCTURE.md           ← You are here
│
└── src/
    │
    ├── 🎨 styles/
    │   └── global.css             → Site-wide colors and fonts
    │
    ├── 📦 components/
    │   ├── Nav.astro              → Top navigation bar
    │   │                             ✏️ Edit nav links here
    │   │
    │   └── portfolio/
    │       ├── ProjectCard.astro  → Single project card
    │       │                         (automatically used by index.astro)
    │       │
    │       └── Section.astro      → Reusable section wrapper
    │                                 (handles spacing & backgrounds)
    │
    ├── 📊 data/
    │   └── projects.ts            → ⭐ ADD YOUR PROJECTS HERE ⭐
    │                                 Just copy/paste an entry!
    │
    ├── 🏠 pages/
    │   └── index.astro            → Homepage (main landing page)
    │                                 Uses all the components above
    │
    └── 📝 consts.ts               → Site title & description
```

## 🎯 Common Tasks (Copy & Paste!)

### 1️⃣ Add a New Project

**File:** `src/data/projects.ts`

```typescript
// Just add this to the projects array:
{
  title: 'Project Name',
  description: 'Brief description of what it does.',
  link: 'https://link-to-project.com',
  tags: ['Tag1', 'Tag2', 'Tag3'],
}
```

### 2️⃣ Add a Navigation Link

**File:** `src/components/Nav.astro`

```typescript
// Add to navLinks array:
{ href: '/your-page', label: 'Your Link' },
```

### 3️⃣ Add a New Section to Homepage

**File:** `src/pages/index.astro`

```astro
<!-- Copy this template: -->
<Section id="section-name" background="alt">
  <div class="section-header centered">
    <h2>Section Title</h2>
    <p class="section-description">
      Your content here
    </p>
  </div>
</Section>
```

### 4️⃣ Change Colors

**File:** `src/styles/global.css`

```css
:root {
  --accent: #2337ff;       /* Change this */
  --accent-dark: #000d8a;  /* And this */
}
```

## 🚀 That's It!

Everything is designed to be **copy-paste friendly**. No complex coding needed!

**Questions?** Check `PORTFOLIO_GUIDE.md` for detailed explanations.
