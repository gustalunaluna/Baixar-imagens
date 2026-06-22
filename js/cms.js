/**
 * LS Confecções — CMS Integration
 * Fetches products and categories from the CMS API and renders them dynamically.
 * CMS_URL is set in js/cms-config.js
 */

(function () {
  'use strict'

  if (typeof window.CMS_URL === 'undefined') {
    console.warn('[CMS] CMS_URL not defined. Create js/cms-config.js with: window.CMS_URL = "https://seu-cms.vercel.app"')
    return
  }

  const BASE = window.CMS_URL.replace(/\/$/, '')

  // ── Placeholder SVG ──────────────────────────────────────────────────
  const PLACEHOLDER_SVG = `
    <div class="catalog-img-placeholder" style="display:flex">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
    </div>`

  // ── WhatsApp link helper ──────────────────────────────────────────────
  function waLink(nome) {
    const text = encodeURIComponent(`Olá! Tenho interesse no produto: ${nome}.`)
    const wa = encodeURIComponent(`https://wa.me/5511999370418?text=${text}`)
    return `obrigado.html?r=${wa}`
  }

  // ── Render a product card ─────────────────────────────────────────────
  function renderCard(p, isFirst) {
    const cat = p.categoria ? p.categoria.nome : ''
    const catSlug = p.categoria ? p.categoria.slug : ''
    const imgAttr = isFirst ? 'fetchpriority="high"' : 'loading="lazy"'
    const imgHtml = p.imagem
      ? `<img src="${p.imagem}" alt="${p.nome} — LS Confecções" width="400" height="400" ${imgAttr}
            onerror="this.onerror=null;this.style.display='none';this.parentElement.querySelector('.catalog-img-placeholder').style.display='flex'">
         <div class="catalog-img-placeholder" style="display:none">
           <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
         </div>`
      : PLACEHOLDER_SVG

    return `
      <div class="catalog-product-card fade-up" data-category="${catSlug}">
        <div class="catalog-img-wrap">${imgHtml}</div>
        <div class="catalog-body">
          ${cat ? `<span class="product-tag">${cat}</span>` : ''}
          <h4>${p.nome}</h4>
          ${p.descricao ? `<p>${p.descricao}</p>` : ''}
          <a href="${waLink(p.nome)}" class="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">Solicitar Orçamento</a>
        </div>
      </div>`
  }

  // ── Load full catalog (produtos.html) ─────────────────────────────────
  async function loadCatalog() {
    const grid = document.querySelector('.catalog-grid')
    if (!grid) return

    // Show skeleton
    grid.innerHTML = Array(6).fill(0).map(() => `
      <div class="catalog-product-card" style="opacity:.4;pointer-events:none">
        <div class="catalog-img-wrap" style="background:#1a1a1a;aspect-ratio:1"></div>
        <div class="catalog-body">
          <div style="height:12px;background:#1a1a1a;margin-bottom:8px;width:60%"></div>
          <div style="height:18px;background:#1a1a1a;margin-bottom:8px"></div>
          <div style="height:12px;background:#1a1a1a;margin-bottom:4px"></div>
          <div style="height:12px;background:#1a1a1a;width:80%"></div>
        </div>
      </div>`).join('')

    try {
      const res = await fetch(`${BASE}/api/public/produtos`)
      if (!res.ok) throw new Error('API error ' + res.status)
      const products = await res.json()

      if (!products.length) {
        grid.innerHTML = '<p style="color:#888;grid-column:1/-1;text-align:center;padding:3rem">Nenhum produto encontrado.</p>'
        return
      }

      grid.innerHTML = products.map((p, i) => renderCard(p, i === 0)).join('')

      // Re-init filter after rendering
      if (typeof window.initCatalogFilter === 'function') {
        window.initCatalogFilter()
      } else {
        initFilter()
      }

      // Re-init fade animations
      if (typeof window.initFadeUp === 'function') window.initFadeUp()

      // Load categories into filter bar
      loadFilterBar(products)

    } catch (err) {
      console.error('[CMS] Failed to load products:', err)
      grid.innerHTML = '<p style="color:#888;grid-column:1/-1;text-align:center;padding:3rem">Erro ao carregar produtos. Tente recarregar a página.</p>'
    }
  }

  // ── Build filter bar from actual categories in fetched products ────────
  function loadFilterBar(products) {
    const bar = document.querySelector('.filter-bar')
    if (!bar) return

    const seen = new Map()
    products.forEach(p => {
      if (p.categoria && !seen.has(p.categoria.slug)) {
        seen.set(p.categoria.slug, p.categoria.nome)
      }
    })

    const extras = Array.from(seen.entries()).map(([slug, nome]) =>
      `<button class="filter-btn" data-filter="${slug}">${nome}</button>`
    ).join('')

    bar.innerHTML = `<button class="filter-btn active" data-filter="all">Todas</button>${extras}`
    initFilter()
  }

  // ── Filter logic ──────────────────────────────────────────────────────
  function initFilter() {
    const bar = document.querySelector('.filter-bar')
    const grid = document.querySelector('.catalog-grid')
    if (!bar || !grid) return

    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
        this.classList.add('active')

        const filter = this.dataset.filter
        grid.querySelectorAll('.catalog-product-card').forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter
          card.classList.toggle('hidden', !match)
          if (match) {
            card.classList.remove('fade-up')
            void card.offsetWidth
            card.classList.add('fade-up')
          }
        })
      })
    })
  }

  // ── Load featured products (index.html) ───────────────────────────────
  async function loadDestaque() {
    const grid = document.querySelector('.destaques-grid, .features-grid, [data-cms="destaque"]')
    if (!grid) return

    try {
      const res = await fetch(`${BASE}/api/public/produtos?destaque=true`)
      if (!res.ok) throw new Error('API error ' + res.status)
      const products = await res.json()
      if (!products.length) return

      grid.innerHTML = products.map((p, i) => renderCard(p, i === 0)).join('')
      if (typeof window.initFadeUp === 'function') window.initFadeUp()
    } catch (err) {
      console.error('[CMS] Failed to load featured products:', err)
    }
  }

  // ── Boot ──────────────────────────────────────────────────────────────
  function init() {
    if (document.querySelector('.catalog-grid')) loadCatalog()
    if (document.querySelector('[data-cms="destaque"]')) loadDestaque()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
