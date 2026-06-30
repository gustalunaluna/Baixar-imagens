/* ============================================================
   LS Confecções — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. DOM refs ──────────────────────────────────────── */
  const header    = document.querySelector('.header');
  const hamburger = document.querySelector('.hamburger');
  const nav       = document.querySelector('.nav');
  const navLinks  = document.querySelectorAll('.nav-links a');

  /* ── Header load animation ─────────────────────────────── */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      if (header) header.classList.add('header-ready');
    });
  });

  /* ── 2. Header scroll behaviour ───────────────────────── */
  function onScroll () {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ── 3. Hamburger / mobile menu ───────────────────────── */
  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('active') &&
          !nav.contains(e.target) &&
          !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 4. Smooth scroll for anchor links ────────────────── */
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

  /* ── 5. Intersection Observer — fade-up animation ─────── */
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

  /* ── 6. Product filter (produtos.html) ─────────────────── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
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

  /* ── 7. Scroll hint arrow — hide after scrolling down ─── */
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    window.addEventListener('scroll', function () {
      scrollHint.classList.toggle('hidden', window.scrollY > 80);
    }, { passive: true });
  }

  /* ── 8. onerror fallback already inline in HTML ───────── */
  /* (handled via onerror attribute on each img tag)         */

  /* ── 9. Rastreamento WhatsApp ────────────────────────── */
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

  /* ── 10. Lightbox ─────────────────────────────────────── */
  var lightbox      = document.getElementById('lightbox');
  var lightboxImg   = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');

  function openLightbox (src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox () {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightbox) {
    document.querySelectorAll('.catalog-img-wrap img').forEach(function (img) {
      img.addEventListener('click', function () {
        if (this.style.display === 'none') return;
        openLightbox(this.src, this.alt);
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
