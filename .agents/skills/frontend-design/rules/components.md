# Componentes — LS Confecções

## Hero Section

```html
<section class="hero">
  <div class="hero__content">
    <span class="hero__badge">Fabricante B2B • São Paulo</span>
    <h1 class="hero__title">Sua marca,<br><em>nossa produção.</em></h1>
    <p class="hero__desc">Bolsas, mochilas e acessórios com private label desde o mínimo de 30 unidades.</p>
    <div class="hero__actions">
      <a href="#contato" class="btn-primary">Solicitar Orçamento</a>
      <a href="#catalogo" class="btn-ghost">Ver catálogo →</a>
    </div>
  </div>
  <div class="hero__image">
    <img src="imagens/destaque-mochila-esportiva.jpg" alt="Mochila esportiva LS Confecções" width="600" height="700" fetchpriority="high">
  </div>
</section>
```

```css
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  min-height: 90vh;
  padding: 80px 5%;
}
.hero__badge {
  display: inline-block;
  background: var(--color-brand);
  color: var(--color-dark);
  font-size: 13px;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: var(--radius-btn);
  letter-spacing: 0.5px;
  margin-bottom: 24px;
}
@media (max-width: 768px) {
  .hero { grid-template-columns: 1fr; min-height: auto; padding: 60px 5%; }
  .hero__image { order: -1; }
}
```

## Product Card

```html
<article class="product-card">
  <a href="/produtos#slug" class="product-card__link">
    <div class="product-card__media">
      <img src="imagens/produto-01.jpg" alt="Nome do produto - LS Confecções"
           width="380" height="440" loading="lazy">
      <span class="product-card__badge">Private Label</span>
    </div>
    <div class="product-card__info">
      <h3 class="product-card__name">Nome do Produto</h3>
      <p class="product-card__meta">A partir de 30 un.</p>
    </div>
  </a>
</article>
```

```css
.product-card {
  border-radius: var(--radius-card);
  overflow: hidden;
  background: var(--color-white);
  box-shadow: var(--shadow-card);
  transition: transform var(--transition), box-shadow var(--transition);
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-hover);
}
.product-card__media { position: relative; aspect-ratio: 3/4; overflow: hidden; }
.product-card__media img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.product-card:hover .product-card__media img { transform: scale(1.05); }
.product-card__badge {
  position: absolute; top: 12px; left: 12px;
  background: var(--color-dark); color: var(--color-brand);
  font-size: 11px; font-weight: 700; padding: 4px 10px;
  border-radius: var(--radius-btn); letter-spacing: 0.5px;
}
.product-card__info { padding: 16px 20px; }
.product-card__name { font-size: 18px; font-weight: 700; color: var(--color-text); }
.product-card__meta { font-size: 13px; color: var(--color-muted); margin-top: 4px; }
```

## Stats / Numbers

```html
<div class="stats-grid">
  <div class="stat">
    <span class="stat__number">+10</span>
    <span class="stat__label">anos de mercado</span>
  </div>
  <div class="stat">
    <span class="stat__number">+800</span>
    <span class="stat__label">modelos produzidos</span>
  </div>
  <div class="stat">
    <span class="stat__number">30 un</span>
    <span class="stat__label">pedido mínimo</span>
  </div>
</div>
```

```css
.stats-grid { display: flex; gap: 48px; justify-content: center; flex-wrap: wrap; }
.stat { text-align: center; }
.stat__number {
  display: block; font-size: 56px; font-weight: 900;
  color: var(--color-brand); line-height: 1;
  font-family: var(--font-brand);
}
.stat__label { font-size: 15px; color: var(--color-muted); margin-top: 6px; }
```

## Lead Form

```html
<form class="lead-form" id="contato" novalidate>
  <div class="form-group">
    <label for="nome">Nome da marca *</label>
    <input type="text" id="nome" name="nome" required autocomplete="organization"
           placeholder="Ex: Minha Marca">
  </div>
  <div class="form-group">
    <label for="whatsapp">WhatsApp *</label>
    <input type="tel" id="whatsapp" name="whatsapp" required
           autocomplete="tel" inputmode="numeric" placeholder="(11) 99999-9999">
  </div>
  <div class="form-group">
    <label for="produto">Produto de interesse</label>
    <select id="produto" name="produto">
      <option value="">Selecione...</option>
      <option>Mochila</option>
      <option>Bolsa</option>
      <option>Eco Bag</option>
      <option>Pochete</option>
      <option>Nécessaire</option>
    </select>
  </div>
  <button type="submit" class="btn-primary btn--full">Solicitar Orçamento</button>
</form>
```

```css
.lead-form { display: flex; flex-direction: column; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 14px; font-weight: 600; color: var(--color-text); }
.form-group input,
.form-group select {
  padding: 14px 18px; border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md); font-size: 16px;
  transition: border-color var(--transition);
  background: var(--color-white);
}
.form-group input:focus,
.form-group select:focus { outline: none; border-color: var(--color-dark); }
.btn--full { width: 100%; justify-content: center; }
```

## Brand Logo Grid (clientes)

```html
<section class="clientes">
  <p class="clientes__label">Marcas que confiam na gente</p>
  <div class="clientes__grid">
    <img src="imagens/logo-bolovo.png" alt="Bolovo" width="120" height="60" loading="lazy">
    <img src="imagens/logo-coroa.png"  alt="Coroa"  width="120" height="60" loading="lazy">
    <img src="imagens/logo-flamengo.png" alt="Flamengo" width="120" height="60" loading="lazy">
    <!-- etc -->
  </div>
</section>
```

```css
.clientes__grid {
  display: flex; flex-wrap: wrap; gap: 32px 48px;
  align-items: center; justify-content: center;
}
.clientes__grid img {
  height: 48px; width: auto; object-fit: contain;
  filter: grayscale(1) opacity(0.6);
  transition: filter var(--transition);
}
.clientes__grid img:hover { filter: grayscale(0) opacity(1); }
```
