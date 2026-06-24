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

  /* ── 6. Product filter (produtos.html) ────────────────── */
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const catalogCards  = document.querySelectorAll('.catalog-product-card');

  if (filterBtns.length && catalogCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const category = this.dataset.filter;

        // Update active button
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        // Filter cards
        catalogCards.forEach(function (card) {
          const cardCat = card.dataset.category;

          if (category === 'all' || cardCat === category) {
            card.classList.remove('hidden');
            // Re-trigger fade animation
            card.classList.remove('animate-in');
            requestAnimationFrame(function () {
              card.classList.add('fade-up');
              requestAnimationFrame(function () {
                card.classList.add('animate-in');
              });
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

})();
