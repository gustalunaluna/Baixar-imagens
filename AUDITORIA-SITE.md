# Auditoria Completa do Site — LS Confecções

> ✅ **Atualização (01/07/2026):** Todos os itens de prioridade alta e média listados abaixo foram corrigidos e pushados para `claude/optimistic-gauss-7f5apn`. Ver commit "fix: corrige achados da auditoria (SEO, acessibilidade, performance)". A otimização completa de todas as imagens do site (item de prioridade baixa, ~31MB restantes fora as já tratadas) ainda pode ser feita em uma passada futura se desejado.

Data: 2026-07-01 · Páginas auditadas: `index.html`, `produtos.html`, `brindes.html`
Metodologia: 6 pilares (adaptado do GSD para HTML/CSS estático) + SEO técnico + WCAG 2.1 AA + performance + testes funcionais.

---

## Placar geral

| Área | Nota | Resumo |
|---|---|---|
| SEO técnico | 3/4 | Base forte (schema, sitemap, canonical, alt text), mas falta imagem OG e há inconsistências de link |
| Acessibilidade (WCAG AA) | 2/4 | Boa fundação (skip links, foco visível, reduced-motion), mas contraste, formulário e touch targets falham |
| Performance | 2/4 | Várias imagens não otimizadas, uma logo de cliente servida 19x maior que o necessário |
| Funcional | 4/4 | Nenhum link/imagem quebrado, nenhum erro de console da própria aplicação |
| **6 Pilares (GSD)** | **16/24** | Ver detalhamento abaixo |

### 6 Pilares (GSD)

| Pilar | Nota | Achado-chave |
|---|---|---|
| Copywriting | 3/4 | Tom direto e consistente com a marca; nenhum texto genérico ("clique aqui" etc.) |
| Visuais | 3/4 | Hierarquia visual clara; ícones decorativos com `aria-hidden` aplicado de forma inconsistente |
| Cor | 2/4 | `--color-gray:#777` falha AA em texto normal sobre branco (4.48:1, precisa 4.5:1) |
| Tipografia | 3/4 | Família consistente (Barlow/Barlow Condensed); alguns tamanhos mobile muito pequenos (0.62rem) |
| Espaçamento | 3/4 | Escala de variáveis consistente; vários estilos inline bypassam o sistema |
| Experiência (UX) | 2/4 | Erros do formulário não são anunciados por leitor de tela; slider com autoplay ignora `prefers-reduced-motion` |

---

## 🔴 Prioridade Alta (corrigir primeiro)

1. **Imagem Open Graph ausente** — `og:image`/`twitter:image` apontam para `imagens/og-image.jpg`, que **não existe**. Isso quebra a prévia de compartilhamento no WhatsApp, Facebook, LinkedIn e Twitter nas 3 páginas. *(index.html:54,61 · produtos.html:54,61 · brindes.html:47,54)*

2. **Contraste de texto cinza abaixo do padrão AA** — `--color-gray:#777777` sobre fundo branco ≈ **4.48:1** (mínimo exigido: 4.5:1) e a variante `.prod-tag{color:#888}` ≈ **3.54:1** (falha clara). Usado em várias seções (`.section-header p`, `.catalog-body p`, `.step-card p`). **Fix**: escurecer para `#5c5c5c` ou mais escuro.

3. **Formulário não anuncia erros para leitores de tela** — `#leadError` (index.html:728) não tem `role="alert"`/`aria-live`, e os campos inválidos não recebem `aria-invalid`/`aria-describedby`. Usuário de leitor de tela não fica sabendo por que a submissão falhou.

4. **Logo de cliente 19x maior que o necessário** — `imagens/logo-vasco.png` tem 620×784px e **1,9MB**, mas é exibida a apenas ~100×60px (`.client-logo{max-width:100px;max-height:60px}`). Redimensionar/comprimir economizaria quase 1,9MB de transferência por visita.

5. **Falta o elemento `<main>`** — Nenhuma das 3 páginas usa a landmark semântica `<main>`, prejudicando a navegação por leitores de tela.

## 🟡 Prioridade Média

6. **Alvos de toque pequenos no mobile** — `.filter-btn` (produtos.html, breakpoint 480px), `.hamburger` e `.social-link` (36-38px) ficam abaixo do mínimo recomendado de 44×44px.

7. **`aria-controls` ausente no menu hambúrguer** — o botão alterna `aria-expanded` corretamente, mas não referencia `aria-controls="nav"`.

8. **Slider de categorias e contador animado ignoram `prefers-reduced-motion`** — o autoplay do slider (`setInterval` a cada 5.5s) e a animação de contagem dos números (`requestAnimationFrame`) continuam rodando mesmo quando o usuário pediu menos movimento no sistema.

9. **Hierarquia de headings pulando níveis** — `produtos.html` vai direto de `<h1>` para `<h3>` nos cards de produto, sem `<h2>` intermediário na seção do catálogo.

10. **Imagens pesadas não otimizadas** — ~31,7MB de imagens únicas referenciadas nas 3 páginas juntas; destaques: `aleda hero.png` (3MB), `tote-rosa.png` (2,4MB), `destaque-mochila-executiva-b2b.png` (2,3MB), `brinde mochila.png` (1,9MB). Conversão para WebB/JPEG otimizado reduziria drasticamente o tempo de carregamento, especialmente no mobile.

## 🟢 Prioridade Baixa / Observações

- Meta description de `produtos.html` está um pouco curta (132 caracteres, ideal 150-160).
- Menu "Catálogo" mistura link absoluto (`https://www.lsconfex.com.br/...`) com os demais links relativos — inconsistente, ainda que funcional.
- Schema `ItemList` em `produtos.html` lista apenas 16 produtos com URLs idênticas, mas a página tem ~75 produtos reais.
- Ícones SVG decorativos sem `aria-hidden` em alguns cards de diferenciais (`index.html`, `brindes.html`).
- `select` de "categoria" no formulário não tem atributo `required` no HTML, mesmo sendo validado como obrigatório via JS.

## ✅ Pontos Fortes (não mexer)

- Nenhum link interno ou imagem quebrada nas 3 páginas.
- `alt` text presente e descritivo em praticamente todas as imagens de conteúdo.
- `robots.txt` e `sitemap.xml` corretos e consistentes.
- Skip links funcionais, foco visível (`:focus-visible`) em todo o site.
- Suporte a `prefers-reduced-motion` já implementado nas animações CSS (falta só cobrir as animações via JS, ver item 8).
- Rótulos de formulário corretamente associados aos campos (`for`/`id`).
- Lightbox de imagens com `role="dialog"`, `aria-modal` e gestão de foco corretos.
- `lang="pt-BR"` e `charset` corretos em todas as páginas.

---

## Próximos passos sugeridos

Posso implementar as correções de **Prioridade Alta** (1-5) agora, que são rápidas e de alto impacto. As de prioridade média também são simples. A otimização de imagens (item 10) é a mais trabalhosa — recomendo tratá-la separadamente.
