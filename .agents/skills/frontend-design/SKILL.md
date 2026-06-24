---
name: frontend-design
description: Frontend design system, component patterns, and visual implementation for LS Confecções web properties
metadata:
  tags: frontend, design, css, html, components, responsive, ui
---

## When to use

Use this skill whenever working on HTML pages, CSS, JavaScript, or React/Next.js components for the LS Confecções website (`index.html`, `produtos.html`, `brindes.html`, `cms/`) to ensure visual consistency, accessibility, and performance.

## Design tokens

Load [rules/tokens.md](rules/tokens.md) before writing any CSS or inline styles to use the correct colors, typography, and spacing.

## Component patterns

Load [rules/components.md](rules/components.md) when building or modifying cards, buttons, forms, navigation, and hero sections.

## Responsive design

Load [rules/responsive.md](rules/responsive.md) before making layout changes — the site must work on mobile (360px+), tablet (768px+), and desktop (1280px+).

## Accessibility

Load [rules/accessibility.md](rules/accessibility.md) when adding images, forms, interactive elements, or color combinations.

## Performance

- Images: always use `loading="lazy"` on below-the-fold images; use `fetchpriority="high"` on the hero image only
- Prefer WebP/AVIF with JPG fallback
- No render-blocking scripts — use `defer` or `async`
- CSS: prefer `transform` and `opacity` for animations (GPU-composited); avoid animating `width`, `height`, `top`, `left`
- Minimize layout shifts: always set explicit `width` and `height` on `<img>` tags

## CSS conventions

```css
/* Use CSS custom properties for all design values */
:root {
  --color-brand:   #D4FF6A;
  --color-dark:    #0D1B2A;
  --color-text:    #1A1A1A;
  --color-muted:   #6B7280;
  --color-surface: #F9FAFB;
  --radius-card:   16px;
  --radius-btn:    100px;
  --shadow-card:   0 4px 24px rgba(0,0,0,0.08);
  --shadow-hover:  0 12px 40px rgba(0,0,0,0.14);
  --font-sans:     'Inter', 'Helvetica Neue', sans-serif;
  --font-brand:    'Space Grotesk', sans-serif;
  --transition:    200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Utility-first approach for spacing */
/* Use multiples of 4px: 4, 8, 12, 16, 24, 32, 48, 64, 96 */
```

## Button hierarchy

```html
<!-- Primary CTA -->
<button class="btn-primary">Solicitar Orçamento</button>

<!-- Secondary -->
<button class="btn-secondary">Ver Catálogo</button>

<!-- Ghost -->
<button class="btn-ghost">Saiba mais →</button>
```

- Primary: `background: var(--color-brand); color: var(--color-dark); font-weight: 700`
- Secondary: `background: transparent; border: 2px solid var(--color-dark)`
- Ghost: `background: none; text-decoration: underline`
- All buttons: `border-radius: var(--radius-btn); padding: 14px 28px; cursor: pointer`
- Hover state: `transform: translateY(-2px); box-shadow: var(--shadow-hover)`

## Card pattern

```html
<article class="card">
  <div class="card__image">
    <img src="..." alt="[produto] - LS Confecções" width="400" height="300" loading="lazy">
  </div>
  <div class="card__body">
    <h3 class="card__title">Nome do produto</h3>
    <p class="card__desc">Descrição breve</p>
    <a href="#" class="btn-primary">Ver detalhes</a>
  </div>
</article>
```

## Forms

- Always pair `<label>` with `<input>` using `for`/`id`
- Show validation errors inline below the field, not in alerts
- Use `autocomplete` attributes on all fields
- Phone fields: `type="tel"`, `autocomplete="tel"`, `inputmode="numeric"`
- Required fields: add `aria-required="true"` and visual asterisk in label

## Animations

```css
/* Entrance animations — prefer these patterns */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Apply with staggered delay for lists */
.card:nth-child(1) { animation: fadeUp 0.5s ease both; }
.card:nth-child(2) { animation: fadeUp 0.5s 0.1s ease both; }
.card:nth-child(3) { animation: fadeUp 0.5s 0.2s ease both; }

/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; }
}
```

## SEO & meta tags

Every page must have:
- `<title>` — unique, under 60 chars, includes "LS Confecções"
- `<meta name="description">` — 120–155 chars
- `<meta property="og:image">` — 1200×630px
- `<link rel="canonical">` — absolute URL
- Heading hierarchy: one `<h1>` per page, then `<h2>`, `<h3>`
