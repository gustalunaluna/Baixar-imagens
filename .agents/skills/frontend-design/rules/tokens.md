# Design Tokens — LS Confecções

## Colors

| Token | Value | Use |
|---|---|---|
| `--color-brand` | `#D4FF6A` | CTAs, destaques, accents |
| `--color-dark` | `#0D1B2A` | Fundos escuros, texto sobre claro |
| `--color-text` | `#1A1A1A` | Texto principal |
| `--color-muted` | `#6B7280` | Texto secundário, placeholders |
| `--color-surface` | `#F9FAFB` | Fundos de cards, seções alternadas |
| `--color-white` | `#FFFFFF` | Fundos, texto sobre escuro |
| `--color-border` | `#E5E7EB` | Bordas, divisores |
| `--color-success` | `#16A34A` | Confirmações, badges positivos |
| `--color-error` | `#DC2626` | Erros de formulário |

## Typography

| Token | Value |
|---|---|
| `--font-sans` | `'Inter', 'Helvetica Neue', Arial, sans-serif` |
| `--font-brand` | `'Space Grotesk', 'Inter', sans-serif` |
| `--font-mono` | `'JetBrains Mono', 'Courier New', monospace` |

### Type scale

| Name | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| Display | 56–72px | 800 | 1.05 | Hero headlines |
| H1 | 40–48px | 700 | 1.1 | Page titles |
| H2 | 28–36px | 700 | 1.2 | Section titles |
| H3 | 20–24px | 600 | 1.3 | Card titles |
| Body | 16–18px | 400 | 1.6 | Texto corrido |
| Small | 13–14px | 400 | 1.5 | Labels, captions |
| Mono | 14px | 400 | 1.4 | Dados, contato |

## Spacing scale (múltiplos de 4px)

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128px`

## Border radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `6px` | Badges, tags |
| `--radius-md` | `12px` | Inputs, small cards |
| `--radius-card` | `16px` | Cards padrão |
| `--radius-lg` | `24px` | Cards grandes, modais |
| `--radius-btn` | `100px` | Botões pill |
| `--radius-full` | `9999px` | Avatars, círculos |

## Shadows

```css
--shadow-xs:   0 1px 3px rgba(0,0,0,0.06);
--shadow-sm:   0 2px 8px rgba(0,0,0,0.08);
--shadow-card: 0 4px 24px rgba(0,0,0,0.08);
--shadow-md:   0 8px 32px rgba(0,0,0,0.10);
--shadow-hover:0 12px 40px rgba(0,0,0,0.14);
--shadow-lg:   0 20px 60px rgba(0,0,0,0.18);
```

## Breakpoints

```css
/* Mobile first */
/* sm  */ @media (min-width: 640px)  { }
/* md  */ @media (min-width: 768px)  { }
/* lg  */ @media (min-width: 1024px) { }
/* xl  */ @media (min-width: 1280px) { }
/* 2xl */ @media (min-width: 1536px) { }
```

## Z-index scale

```
1   → Background elements
10  → Cards, content
20  → Dropdowns, tooltips
30  → Sticky header
40  → Modais overlay
50  → Modais conteúdo
100 → Toast notifications
```
