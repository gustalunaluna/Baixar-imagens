# Acessibilidade — LS Confecções

## Contraste mínimo (WCAG AA)

| Combinação | Ratio | Status |
|---|---|---|
| `#1A1A1A` sobre `#FFFFFF` | 16:1 | ✅ |
| `#0D1B2A` sobre `#D4FF6A` | 9.8:1 | ✅ |
| `#D4FF6A` sobre `#0D1B2A` | 9.8:1 | ✅ |
| `#6B7280` sobre `#FFFFFF` | 4.6:1 | ✅ AA (texto normal) |
| `#D4FF6A` sobre `#FFFFFF` | 1.3:1 | ❌ NÃO usar texto lime em fundo branco |

**Nunca use texto `#D4FF6A` em fundo branco.**

## Imagens

```html
<!-- Imagem informativa: alt descritivo -->
<img src="imagens/produto-01.jpg" alt="Mochila esportiva preta com alças acolchoadas — LS Confecções">

<!-- Imagem decorativa: alt vazio (não omitir o atributo) -->
<img src="imagens/background-pattern.png" alt="">

<!-- Ícone SVG com texto: aria-hidden no SVG -->
<button>
  <svg aria-hidden="true" focusable="false">...</svg>
  Ver catálogo
</button>

<!-- Ícone SVG sem texto visível: title dentro do SVG -->
<button aria-label="Fechar menu">
  <svg role="img" aria-label="Fechar">
    <title>Fechar</title>
    <path d="..."/>
  </svg>
</button>
```

## Formulários

```html
<!-- Sempre associar label e input -->
<label for="whatsapp">WhatsApp <span aria-hidden="true">*</span></label>
<input id="whatsapp" name="whatsapp" type="tel" required aria-required="true"
       aria-describedby="whatsapp-hint whatsapp-error">
<span id="whatsapp-hint" class="hint">Ex: (11) 99999-9999</span>
<span id="whatsapp-error" class="error" role="alert" hidden>
  Número inválido. Use o formato (11) 99999-9999.
</span>
```

## Foco visível

```css
/* Nunca remover outline sem substituir */
:focus-visible {
  outline: 2px solid var(--color-dark);
  outline-offset: 3px;
  border-radius: 4px;
}
/* Remover apenas quando não necessário (mouse) */
:focus:not(:focus-visible) { outline: none; }
```

## Skip link

Adicionar no topo de cada página HTML:
```html
<a href="#conteudo-principal" class="skip-link">Pular para o conteúdo</a>
<main id="conteudo-principal">...</main>
```
```css
.skip-link {
  position: absolute; top: -100px; left: 16px;
  background: var(--color-dark); color: var(--color-brand);
  padding: 10px 20px; border-radius: 0 0 8px 8px;
  font-weight: 700; text-decoration: none; z-index: 9999;
  transition: top 0.2s;
}
.skip-link:focus { top: 0; }
```

## ARIA em componentes interativos

```html
<!-- Accordion -->
<button aria-expanded="false" aria-controls="faq-1">Pergunta</button>
<div id="faq-1" hidden>Resposta</div>

<!-- Modal -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Solicitar Orçamento</h2>
  ...
</div>

<!-- Carrossel -->
<div role="region" aria-label="Produtos em destaque">
  <div role="group" aria-roledescription="slide" aria-label="1 de 6">...</div>
</div>
```

## Movimento e animações

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Checklist antes de entregar

- [ ] Todas as imagens têm `alt` (descritivo ou vazio)
- [ ] Todos os inputs têm `<label>` associado
- [ ] Contraste texto ≥ 4.5:1 (texto normal) ou ≥ 3:1 (texto grande/bold)
- [ ] Foco visível em todos os elementos interativos
- [ ] Hierarquia de headings correta (um `<h1>` por página)
- [ ] Skip link presente
- [ ] Navegação por teclado funciona sem mouse
