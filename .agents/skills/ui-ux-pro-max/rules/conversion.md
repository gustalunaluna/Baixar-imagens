# Padrões de Conversão — LS Confecções

## Funil de conversão

```
Visita → Interesse (produto) → Confiança (prova social) → Ação (orçamento/WhatsApp)
```

Cada página deve mover o usuário para o próximo passo desse funil.

## Hero — maximizar impacto inicial

**Fórmula:**
```
[Badge de credibilidade] → pequeno, acima do headline
[Headline: proposta de valor em <8 palavras]
[Subheadline: quem atende + diferencial concreto]
[CTA primário] + [CTA secundário ghost]
[Prova rápida: X marcas · Y anos · Z modelos]
```

**Exemplos de headline forte:**
- ✅ "Sua marca nas peças certas."
- ✅ "De 30 unidades. Com o seu logo."
- ❌ "Fabricante de bolsas e mochilas com qualidade premium"

## CTAs — textos que convertem

| ❌ Genérico | ✅ Específico |
|---|---|
| "Clique aqui" | "Solicitar orçamento grátis" |
| "Enviar" | "Quero receber proposta" |
| "Saiba mais" | "Ver catálogo completo →" |
| "Entrar em contato" | "Chamar no WhatsApp agora" |
| "Comprar" | "Pedir amostras" |

**Regra:** o CTA deve dizer **o que acontece** ao clicar, não apenas pedir ação.

## Urgência e escassez (ética)

Usar apenas quando verdadeiro:
```html
<!-- Pedido mínimo real — cria urgência de planejamento -->
<p class="hint">Pedido mínimo: 30 unidades por modelo</p>

<!-- Prazo real de produção -->
<p class="hint">Prazo médio de produção: 25 dias úteis após aprovação</p>

<!-- Não inventar "últimas unidades" ou "oferta por tempo limitado" -->
```

## Prova social — hierarquia de impacto

1. **Logos de marcas conhecidas** (Flamengo, Vasco) — reconhecimento imediato
2. **Números concretos** (+10 anos, +800 modelos, +50 marcas)
3. **Depoimentos com foto + nome da marca** — mais confiável que texto anônimo
4. **Fotos de produtos entregues** — prova visual da qualidade

```html
<!-- Posicionamento ideal: logo após o hero, antes do catálogo -->
<section class="social-proof">
  <p class="social-proof__label">Marcas que confiam na LS Confecções</p>
  <div class="logos-grid">...</div>
  <div class="stats-row">
    <div class="stat"><span>+10</span>anos</div>
    <div class="stat"><span>+800</span>modelos</div>
    <div class="stat"><span>+50</span>marcas atendidas</div>
  </div>
</section>
```

## Formulário de lead — otimização

**Regra dos 3 campos:** para 1º contato, pedir apenas o necessário para qualificar:
1. Nome da marca (saber com quem falar)
2. WhatsApp (canal de contato preferido)
3. Produto de interesse (qualificar a necessidade)

Campos extras (CNPJ, quantidade, prazo) só após primeiro contato.

```html
<!-- Microcopy que reduz atrito -->
<label for="whatsapp">
  WhatsApp
  <span class="field-hint">Só para responder seu orçamento, sem spam</span>
</label>

<!-- Botão com expectativa clara -->
<button type="submit">
  Quero receber orçamento →
  <span class="btn-sub">Resposta em até 2 horas úteis</span>
</button>
```

## Páginas de produto — estrutura

```
1. Imagem grande (hero do produto)
2. Nome + categoria
3. Descrição curta (2–3 linhas)
4. Detalhes técnicos (material, dimensões, personalização disponível)
5. Pedido mínimo + prazo
6. CTA: "Solicitar orçamento para este produto"
7. Produtos relacionados
```

## Above-the-fold por página

O que deve aparecer SEM scroll em cada página:

**index.html:**
- Headline + subheadline + CTA
- Imagem de produto hero
- Navegação com WhatsApp visível

**produtos.html:**
- Título da categoria + filtros
- Grid com pelo menos 4 produtos visíveis
- Sem texto longo introdutório (vai para baixo da dobra)

**brindes.html:**
- Proposta de valor clara ("Brindes corporativos com sua marca")
- Imagem de brinde hero
- Formulário de orçamento ou CTA para WhatsApp

## Exit intent / recuperação

Em mobile, quando o usuário inicia scroll para cima (sinal de saída):
```js
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current < lastScroll && current > 200) {
    // Usuário voltando para cima — mostrar CTA fixo
    document.querySelector('.sticky-cta').classList.add('visible');
  }
  lastScroll = current;
});
```

```css
.sticky-cta {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: #0D1B2A; padding: 16px 20px;
  transform: translateY(100%);
  transition: transform 300ms ease;
  z-index: 40;
}
.sticky-cta.visible { transform: translateY(0); }
```
