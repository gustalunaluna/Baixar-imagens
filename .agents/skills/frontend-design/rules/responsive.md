# Responsive Design — LS Confecções

## Strategy: Mobile First

Always write base CSS for mobile (360px+), then add breakpoints for larger screens.

```css
/* ✅ Correto — mobile first */
.grid { grid-template-columns: 1fr; }
@media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }

/* ❌ Evitar — desktop first exige muitos overrides */
.grid { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
```

## Container width

```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}
@media (min-width: 768px)  { .container { padding: 0 40px; } }
@media (min-width: 1280px) { .container { padding: 0 60px; } }
```

## Grid patterns por breakpoint

| Layout | Mobile | Tablet (768px) | Desktop (1024px) |
|---|---|---|---|
| Hero | 1 coluna, imagem em cima | 1 coluna | 2 colunas (50/50) |
| Produtos | 2 colunas | 3 colunas | 4 colunas |
| Destaques | 1 coluna | 2 colunas | 3 colunas |
| Stats | 2 colunas | 3 colunas | 4 colunas inline |
| Formulário | Full width | 60% centrado | 480px centrado |

## Typography scaling

```css
/* Display headline */
.headline { font-size: clamp(32px, 6vw, 64px); }

/* Section title */
.section-title { font-size: clamp(24px, 4vw, 40px); }

/* Body — não escalar abaixo de 16px */
body { font-size: 16px; }
@media (min-width: 1024px) { body { font-size: 17px; } }
```

## Navigation

- **Mobile:** hamburger menu com drawer lateral (transform: translateX)
- **Desktop:** links horizontais no header
- Altura mínima do header: `64px` mobile, `72px` desktop
- Botão hamburger: `44×44px` (touch target mínimo)

```css
.nav-links { display: none; }
.nav-links.open { display: flex; flex-direction: column; }
@media (min-width: 768px) {
  .nav-links { display: flex; flex-direction: row; }
  .hamburger { display: none; }
}
```

## Touch targets

Todos os elementos clicáveis devem ter `min-height: 44px; min-width: 44px` para atender WCAG 2.5.5.

## Images

```html
<!-- Hero image: responsivo com sizes -->
<img src="imagens/hero.jpg"
     srcset="imagens/hero-480.jpg 480w, imagens/hero-800.jpg 800w, imagens/hero-1200.jpg 1200w"
     sizes="(max-width: 768px) 100vw, 50vw"
     alt="..."
     width="1200" height="800"
     fetchpriority="high">

<!-- Product card: lazy -->
<img src="imagens/produto-01.jpg"
     sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 23vw"
     loading="lazy"
     width="400" height="480" alt="...">
```

## Specific pages

### index.html
- Hero: texto + CTA acima da imagem no mobile; side-by-side no desktop
- Produtos em destaque: carrossel no mobile, grid 3col no desktop
- Logos de clientes: scroll horizontal no mobile, flex-wrap no desktop

### produtos.html
- Filtros: dropdown colapsável no mobile, sidebar fixa no desktop
- Grid: 2col mobile → 3col tablet → 4col desktop

### brindes.html
- Cards de brindes: 1col mobile → 2col tablet → 3col desktop
- Formulário de orçamento: sempre full-width no mobile
