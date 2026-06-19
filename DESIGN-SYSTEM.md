# Design System — LS Confecções

## Identidade Visual

**Estilo:** Streetwear B2B — escuro, direto, sem enfeites. Geometria limpa, tipografia pesada, acento neon.  
**Domínio:** lsconfex.com.br  
**Público:** Marcas, empresas e compradores B2B de bolsas, mochilas e brindes corporativos.

---

## Cores

### Paleta Principal

| Nome | Variável CSS | Hex | Uso |
|---|---|---|---|
| Preto | `--color-black` | `#0a0a0a` | Fundo principal, headers, cards escuros |
| Escuro | `--color-dark` | `#111111` | Fundos alternativos escuros |
| Escuro médio | `--color-dark-mid` | `#1c1c1c` | Superfícies secundárias sobre fundo preto |
| Escuro claro | `--color-dark-light` | `#2a2a2a` | Bordas, separadores no tema escuro |
| **Acento neon** | `--color-accent` | `#e8ff00` | **Cor de destaque principal** — badges, botões primários, spans, eyebrows |
| Acento escurecido | `--color-accent-dim` | `#c8db00` | Hover do acento, estados ativos |
| Branco | `--color-white` | `#ffffff` | Textos sobre fundos escuros |
| Off-white | `--color-off-white` | `#f0f0f0` | Backgrounds de imagens, placeholders |
| Claro | `--color-light` | `#f4f4f4` | Seções de fundo claro (brindes-section) |
| Cinza | `--color-gray` | `#777777` | Textos secundários |
| Cinza claro | `--color-gray-light` | `#bbbbbb` | Textos de suporte, legendas |
| WhatsApp | `--color-whatsapp` | `#25d366` | Botão WhatsApp |
| WhatsApp escuro | `--color-whatsapp-dk` | `#1da851` | Hover do botão WhatsApp |

### Uso das Cores por Contexto

| Contexto | Background | Texto | Acento |
|---|---|---|---|
| Seção escura | `#0a0a0a` | `#ffffff` | `#e8ff00` |
| Seção clara | `#f4f4f4` | `#0a0a0a` | `#0a0a0a` (opacidade reduzida) |
| Barra de diferenciais | `#e8ff00` | `#000000` | — |
| Header / nav | `#0a0a0a` | `#ffffff` | `#e8ff00` |
| Footer | `#0a0a0a` | `#888888` | `#e8ff00` |
| Cards de produto | `#ffffff` | `#0a0a0a` | `#e8ff00` (badge) |

---

## Tipografia

### Fontes

| Papel | Família | Variável CSS |
|---|---|---|
| Títulos / headings | **Barlow Condensed** | `--font-heading` |
| Corpo / texto corrido | **Barlow** | `--font-body` |

Importação Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">
```

### Escala de Tamanhos

| Elemento | Tamanho | Peso | Observação |
|---|---|---|---|
| `h1` | `clamp(3rem, 7vw, 6rem)` | 900 | Fluid — cresce com a tela |
| `h2` | `clamp(2.2rem, 4.5vw, 3.8rem)` | 900 | |
| `h3` | `clamp(1.4rem, 2.5vw, 2rem)` | 900 | |
| `h4` | `1.3rem` | 900 | |
| `h5` | `1rem` | 700 | |
| Eyebrow (label acima de título) | `0.75rem` | 700 | Letter-spacing: 0.2–0.35em, uppercase |
| Corpo | `1rem` | 400 | Line-height: 1.6–1.7 |
| Texto secundário | `0.82–0.9rem` | 400 | Cor: `#666` ou `#888` |
| Botão primário | `0.95rem` | 800 | Letter-spacing: 0.12em, uppercase |
| Botão pequeno | `0.8rem` | 700 | Letter-spacing: 0.08em, uppercase |

---

## Botões

### Primário
```css
background: #e8ff00;
color: #000;
font-family: 'Barlow Condensed', sans-serif;
font-size: 0.95rem;
font-weight: 800;
letter-spacing: 0.12em;
text-transform: uppercase;
padding: 0.8rem 2rem;
border-radius: 0; /* sem arredondamento */
```

### Secundário
```css
background: transparent;
color: #fff;
border: 1px solid #444;
font-family: 'Barlow Condensed', sans-serif;
font-size: 0.8rem;
font-weight: 700;
letter-spacing: 0.08em;
text-transform: uppercase;
padding: 0.55rem 1.2rem;
```

### Representante (especial)
```css
background: #0a0a0a;
color: #e8ff00;
border: 1px solid #e8ff00;
/* mesma tipografia do secundário */
```

### WhatsApp
```css
background: #25d366;
color: #fff;
/* hover: #1da851 */
```

> **Regra de design:** Todos os botões têm `border-radius: 0` — cantos retos são parte da identidade streetwear da marca.

---

## Espaçamento

| Token | Variável CSS | Valor |
|---|---|---|
| XS | `--space-xs` | `0.5rem` (8px) |
| SM | `--space-sm` | `1rem` (16px) |
| MD | `--space-md` | `1.5rem` (24px) |
| LG | `--space-lg` | `2rem` (32px) |
| XL | `--space-xl` | `3rem` (48px) |
| 2XL | `--space-2xl` | `5rem` (80px) |
| 3XL | `--space-3xl` | `7rem` (112px) |

Em mobile (≤ 768px): `--space-3xl` reduz para `4rem`, `--space-2xl` para `3rem`.

---

## Layout

| Token | Valor |
|---|---|
| Largura máxima do container | `1200px` |
| Altura do header | `80px` |
| Padding lateral do container | `1.5rem` |

---

## Bordas e Sombras

### Border-radius
| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | `4px` | Elementos pequenos (tags) |
| `--radius-md` | `8px` | Cards secundários |
| `--radius-lg` | `16px` | Modais, overlays |
| `--radius-full` | `9999px` | Pílulas (toggle do menu mobile) |
| **Padrão** | `0` | **Botões, cards de produto — identidade streetwear** |

### Sombras
| Token | Valor | Uso |
|---|---|---|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.15)` | Hover leve |
| `--shadow-md` | `0 6px 24px rgba(0,0,0,0.25)` | Cards em hover |
| `--shadow-lg` | `0 12px 48px rgba(0,0,0,0.35)` | Modais, dropdowns |

---

## Transições

| Token | Valor | Uso |
|---|---|---|
| `--transition-fast` | `0.2s ease` | Hover de botão |
| `--transition-base` | `0.3s ease` | Hover de card |
| `--transition-slow` | `0.5s ease` | Animações de entrada |

---

## Breakpoints (Responsividade)

| Breakpoint | Largura | O que muda |
|---|---|---|
| Desktop | > 900px | Layout padrão, grids completos |
| Tablet | ≤ 900px | Grids reduzem para 2 colunas |
| Mobile | ≤ 768px | Imagens hero alternativas |
| Mobile pequeno | ≤ 540px | Grid 1–2 colunas, fontes reduzidas |
| Mobile mínimo | ≤ 480px | Botões full-width, espaçamentos mínimos |

---

## Analytics e Rastreamento

| Ferramenta | ID |
|---|---|
| Google Analytics 4 | `G-Q8WG4J3F78` |

A tag GA4 está instalada em todas as páginas (`index.html`, `produtos.html`, `brindes.html`, `obrigado.html`).

Todos os botões de WhatsApp passam por `obrigado.html?r=URL_WHATSAPP` para rastreamento de conversão.

---

## Páginas

| Arquivo | Título | Descrição |
|---|---|---|
| `index.html` | Início | Home principal — hero, produtos em destaque, linhas, como funciona, FAQ, contato |
| `produtos.html` | Catálogo | Grade completa de produtos com filtros por categoria |
| `brindes.html` | Brindes Corporativos | Página dedicada a brindes B2B — ecobags, mochilas, pochetes |
| `obrigado.html` | Obrigado | Página de conversão — redireciona para WhatsApp após captura de lead |

---

## Favicon

SVG com fundo preto e letras "LS" em neon `#e8ff00`, borda amarela fina.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#0a0a0a"/>
  <rect x="4" y="4" width="92" height="92" fill="none" stroke="#e8ff00" stroke-width="3"/>
  <text x="50" y="73" font-family="'Arial Black', Impact, sans-serif"
    font-size="60" font-weight="900" fill="#e8ff00"
    text-anchor="middle" letter-spacing="-4">LS</text>
</svg>
```
