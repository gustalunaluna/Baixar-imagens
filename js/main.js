(function () {
 'use strict';
 const header = document.querySelector('.header');
 const hamburger = document.querySelector('.hamburger');
 const nav = document.querySelector('.nav');
 const navLinks = document.querySelectorAll('.nav-links a');
 requestAnimationFrame(function () {
 requestAnimationFrame(function () {
 if (header) header.classList.add('header-ready');
 });
 });
 var headerTicking = false;
 function applyHeader () {
 header.classList.toggle('scrolled', window.scrollY > 80);
 headerTicking = false;
 }
 function onScroll () {
 if (headerTicking) return;
 headerTicking = true;
 requestAnimationFrame(applyHeader);
 }
 window.addEventListener('scroll', onScroll, { passive: true });
 applyHeader();
 if (hamburger && nav) {
 hamburger.addEventListener('click', function () {
 hamburger.classList.toggle('active');
 nav.classList.toggle('active');
 document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
 hamburger.setAttribute('aria-expanded', nav.classList.contains('active') ? 'true' : 'false');
 });
 navLinks.forEach(function (link) {
 link.addEventListener('click', function () {
 hamburger.classList.remove('active');
 nav.classList.remove('active');
 document.body.style.overflow = '';
 hamburger.setAttribute('aria-expanded', 'false');
 });
 });
 document.addEventListener('click', function (e) {
 if (nav.classList.contains('active') &&
 !nav.contains(e.target) &&
 !hamburger.contains(e.target)) {
 hamburger.classList.remove('active');
 nav.classList.remove('active');
 document.body.style.overflow = '';
 hamburger.setAttribute('aria-expanded', 'false');
 }
 });
 }
 document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
 anchor.addEventListener('click', function (e) {
 const target = document.querySelector(this.getAttribute('href'));
 if (target) {
 e.preventDefault();
 const headerH = parseInt(
 getComputedStyle(document.documentElement)
 .getPropertyValue('--header-h'), 10
 ) || 80;
 const top = target.getBoundingClientRect().top + window.scrollY - headerH;
 window.scrollTo({ top: top, behavior: 'smooth' });
 }
 });
 });
 const fadeEls = document.querySelectorAll('.fade-up');
 if (fadeEls.length) {
 const observer = new IntersectionObserver(
 function (entries) {
 entries.forEach(function (entry) {
 if (entry.isIntersecting) {
 entry.target.classList.add('animate-in');
 observer.unobserve(entry.target);
 }
 });
 },
 { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
 );
 fadeEls.forEach(function (el) {
 observer.observe(el);
 });
 }
 const filterBtns = document.querySelectorAll('.filter-btn');
 const catalogCards = document.querySelectorAll('.catalog-product-card');
 if (filterBtns.length && catalogCards.length) {
 filterBtns.forEach(function (btn) {
 btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
 });
 filterBtns.forEach(function (btn) {
 btn.addEventListener('click', function () {
 var category = this.dataset.filter;
 filterBtns.forEach(function (b) {
 b.classList.remove('active');
 b.setAttribute('aria-pressed', 'false');
 });
 this.classList.add('active');
 this.setAttribute('aria-pressed', 'true');
 catalogCards.forEach(function (card) {
 var cat = (card.dataset.category || '');
 if (category === 'all' || cat.split(' ').indexOf(category) !== -1) {
 card.classList.remove('hidden');
 card.classList.remove('animate-in');
 requestAnimationFrame(function () {
 card.classList.add('fade-up');
 requestAnimationFrame(function () { card.classList.add('animate-in'); });
 });
 } else {
 card.classList.add('hidden');
 }
 });
 });
 });
 }
 const scrollHint = document.querySelector('.scroll-hint');
 if (scrollHint) {
 var hintTicking = false;
 var applyScrollHint = function () {
 scrollHint.classList.toggle('hidden', window.scrollY > 80);
 hintTicking = false;
 };
 var updateScrollHint = function () {
 if (hintTicking) return;
 hintTicking = true;
 requestAnimationFrame(applyScrollHint);
 };
 applyScrollHint();
 window.addEventListener('scroll', updateScrollHint, { passive: true });
 window.addEventListener('pageshow', updateScrollHint);
 }
 document.querySelectorAll('a[href*="wa.me"]').forEach(function (link) {
 link.addEventListener('click', function () {
 if (typeof gtag === 'function') {
 gtag('event', 'contact_whatsapp', { event_category: 'engagement', event_label: document.title });
 }
 if (typeof fbq === 'function') {
 fbq('track', 'Contact');
 }
 });
 });
 var lightbox = document.getElementById('lightbox');
 var lightboxImg = document.getElementById('lightbox-img');
 var lightboxClose = document.getElementById('lightbox-close');
 var lightboxTrigger = null;
 function openLightbox (src, alt, trigger) {
 lightboxImg.src = src;
 lightboxImg.alt = alt || '';
 lightbox.classList.add('active');
 document.body.style.overflow = 'hidden';
 lightboxTrigger = trigger || null;
 if (lightboxClose) lightboxClose.focus();
 }
 function closeLightbox () {
 lightbox.classList.remove('active');
 document.body.style.overflow = '';
 if (lightboxTrigger) { lightboxTrigger.focus(); lightboxTrigger = null; }
 }
 if (lightbox) {
 document.querySelectorAll('.catalog-img-wrap img').forEach(function (img) {
 img.addEventListener('click', function () {
 if (this.style.display === 'none') return;
 openLightbox(this.src, this.alt, this);
 });
 });
 if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
 lightbox.addEventListener('click', function (e) {
 if (e.target === lightbox) closeLightbox();
 });
 document.addEventListener('keydown', function (e) {
 if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
 });
 }
})();

/* ── Scripts extraídos do HTML (stagger, slider, footer-year) ── */
(function() {
    // Stagger para cards de produto
    const productCards = document.querySelectorAll('.products-grid .product-card');
    if (productCards.length) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      productCards.forEach(c => obs.observe(c));
    }

    // Stagger para slider de categorias
    const catSlider = document.getElementById('catSlider');
    if (catSlider) {
      const obsC = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          catSlider.classList.add('stagger-visible');
          obsC.disconnect();
        }
      }, { threshold: 0.15 });
      obsC.observe(catSlider);
    }
  })();

(function() {
    const slider   = document.getElementById('catSlider');
    const prevBtn  = document.getElementById('catPrev');
    const nextBtn  = document.getElementById('catNext');
    const dotsWrap = document.getElementById('catDots');
    if (!slider || !prevBtn || !nextBtn) return;

    let current = 0;
    let autoTimer = null;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    function getVisible() {
      const w = window.innerWidth;
      if (w <= 480) return 1.2;
      if (w <= 640) return 2;
      if (w <= 1024) return 3;
      return 4;
    }

    const cards = Array.from(slider.querySelectorAll('.category-card'));
    const total = cards.length;

    function maxIndex() {
      return Math.max(0, total - Math.floor(getVisible()));
    }

    /* dots */
    function buildDots() {
      dotsWrap.innerHTML = '';
      const count = maxIndex() + 1;
      for (let i = 0; i < count; i++) {
        const d = document.createElement('button');
        d.className = 'cat-dot' + (i === current ? ' active' : '');
        d.setAttribute('aria-label', 'Ir para slide ' + (i + 1));
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      }
    }

    function updateDots() {
      const dots = dotsWrap.querySelectorAll('.cat-dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, maxIndex()));
      const cardW = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(slider).gap) || 20;
      slider.style.transform = `translateX(-${current * (cardW + gap)}px)`;
      updateDots();
    }

    function goNext() { goTo(current < maxIndex() ? current + 1 : 0); }
    function goPrev() { goTo(current > 0 ? current - 1 : maxIndex()); }

    prevBtn.addEventListener('click', () => { goPrev(); resetAuto(); });
    nextBtn.addEventListener('click', () => { goNext(); resetAuto(); });

    /* autoplay */
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function startAuto() {
      if (prefersReducedMotion) return;
      autoTimer = setInterval(goNext, 5500);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    /* pause on hover */
    slider.closest('.cat-slider-wrap').addEventListener('mouseenter', () => clearInterval(autoTimer));
    slider.closest('.cat-slider-wrap').addEventListener('mouseleave', startAuto);

    /* drag / swipe */
    function onDragStart(x) {
      isDragging = true;
      dragStartX = x;
      dragStartScroll = current;
      slider.style.transition = 'none';
      slider.classList.add('is-dragging');
    }
    function onDragMove(x) {
      if (!isDragging) return;
      const cardW = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(slider).gap) || 20;
      const delta = dragStartX - x;
      const base = dragStartScroll * (cardW + gap);
      slider.style.transform = `translateX(-${base + delta}px)`;
    }
    function onDragEnd(x) {
      if (!isDragging) return;
      isDragging = false;
      slider.style.transition = '';
      slider.classList.remove('is-dragging');
      const delta = dragStartX - x;
      const cardW = cards[0].getBoundingClientRect().width;
      if (Math.abs(delta) > cardW * 0.2) {
        delta > 0 ? goNext() : goPrev();
      } else {
        goTo(current);
      }
    }

    slider.addEventListener('mousedown',  e => onDragStart(e.clientX));
    window.addEventListener('mousemove',  e => { if (isDragging) onDragMove(e.clientX); });
    window.addEventListener('mouseup',    e => onDragEnd(e.clientX));
    slider.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX), { passive: true });
    slider.addEventListener('touchmove',  e => onDragMove(e.touches[0].clientX), { passive: true });
    slider.addEventListener('touchend',   e => onDragEnd(e.changedTouches[0].clientX));

    /* prevent link click after drag */
    slider.addEventListener('click', e => {
      if (Math.abs(dragStartX - (e.clientX || 0)) > 5) e.preventDefault();
    });

    /* recalc on resize */
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { buildDots(); goTo(Math.min(current, maxIndex())); }, 150);
    });

    /* init */
    buildDots();
    startAuto();
  })();
(function(){document.getElementById('footer-year')&&(document.getElementById('footer-year').textContent=new Date().getFullYear());})();
/* Barra de progresso de leitura — só em artigos de blog */
(function(){
  var art = document.querySelector('.blog-article');
  if(!art) return;
  var bar = document.createElement('div');
  bar.className = 'read-progress';
  bar.setAttribute('aria-hidden','true');
  document.body.appendChild(bar);
  function update(){
    var rect = art.getBoundingClientRect();
    var total = art.offsetHeight - window.innerHeight;
    var scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total,0));
    bar.style.width = (total > 0 ? (scrolled/total*100) : 0) + '%';
  }
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
})();
