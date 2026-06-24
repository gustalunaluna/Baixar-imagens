# Hierarquia Visual — LS Confecções

## O modelo F e Z de leitura

Usuários ocidentais leem em padrão F (listas longas) ou Z (layouts com imagem).

**Layout hero (Z-pattern):**
```
[LOGO + NAV]          [WHATSAPP]
[HEADLINE GRANDE]     [IMAGEM DO PRODUTO]
[DESC + CTA]          
```

**Seção de lista de produtos (F-pattern):**
```
[TÍTULO DA SEÇÃO]
[Card] [Card] [Card] [Card]
[Card] [Card] [Card] [Card]
              [VER MAIS →]
```

## Peso visual por elemento

Ordenar do maior para o menor impacto:

1. **Imagem hero full-bleed** — âncora visual da página
2. **Headline principal (H1)** — 48–72px, peso 800, uma linha se possível
3. **CTA primário** — botão lima `#D4FF6A`, maior que os secundários
4. **Subheadline / descrição** — 18–20px, peso 400, cor `#6B7280`
5. **Cards de produto** — grid consistente, imagens alinhadas
6. **Prova social (logos, números)** — tamanho médio, grayscale
7. **Rodapé** — peso visual mínimo

## Regras de espaçamento entre seções

```css
/* Seções principais — muito espaço para respirar */
section { padding: 96px 0; }

/* Seções compactas (banners, CTAs) */
.section-compact { padding: 64px 0; }

/* Mobile: reduzir em ~40% */
@media (max-width: 768px) {
  section { padding: 60px 0; }
  .section-compact { padding: 40px 0; }
}
```

## Tamanhos de fonte por nível

| Nível | Desktop | Mobile | Peso | Cor |
|---|---|---|---|---|
| Display/Hero H1 | 56–72px | 36–48px | 800 | `#1A1A1A` |
| Section H2 | 36–44px | 28–32px | 700 | `#1A1A1A` |
| Card H3 | 20–24px | 18–20px | 600 | `#1A1A1A` |
| Body | 16–18px | 16px | 400 | `#1A1A1A` |
| Caption/Label | 12–14px | 12px | 500 | `#6B7280` |
| Badge/Tag | 11–13px | 11px | 700 | variável |

**Regra:** nunca mais de 3 tamanhos de fonte na mesma seção.

## Alinhamento

- **Texto longo (parágrafos):** sempre `text-align: left`
- **Headlines de seção:** `center` quando a seção é simétrica; `left` quando tem imagem ao lado
- **Números/stats:** `center`
- **Cards:** conteúdo `left` dentro do card

## Contraste entre seções

Alternar fundos para criar ritmo visual:

```
[Seção 1] fundo branco    #FFFFFF
[Seção 2] fundo cinza     #F9FAFB
[Seção 3] fundo escuro    #0D1B2A  ← prova social, CTA final
[Seção 4] fundo lima      #D4FF6A  ← momento de energia, números
[Seção 5] fundo branco    #FFFFFF
```

Nunca colocar duas seções escuras consecutivas.

## Hierarquia do CTA

Em cada página, o CTA principal deve ser visualmente dominante:

```css
/* CTA principal — deve "saltar" da página */
.btn-primary {
  background: #D4FF6A;
  color: #0D1B2A;
  font-size: 18px;
  font-weight: 800;
  padding: 18px 36px;
  border-radius: 100px;
  /* Sem sombra extra — o contraste de cor já é suficiente */
}

/* CTA secundário — presente mas subordinado */
.btn-secondary {
  background: transparent;
  border: 2px solid currentColor;
  font-size: 16px;
  font-weight: 600;
  padding: 16px 32px;
}
```

## Densidade de informação

- **Hero:** máximo 3 elementos de texto (headline + subhead + CTA)
- **Cards:** máximo 4 linhas de informação (nome + categoria + detalhe + ação)
- **Formulário:** máximo 4 campos visíveis inicialmente
- **Seção "como funciona":** máximo 4 passos

Se tiver mais informação, esconder em accordion, modal ou "ver mais".
