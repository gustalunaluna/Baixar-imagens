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

  /* ── 6. Product filter + pagination (produtos.html) ─────── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const catalogCards = Array.from(document.querySelectorAll('.catalog-product-card'));
  const pagination   = document.getElementById('catalog-pagination');
  const pageNumbers  = document.getElementById('page-numbers');
  const pagePrev     = document.getElementById('page-prev');
  const pageNext     = document.getElementById('page-next');

  var ITEMS_PER_PAGE = 12;
  var currentPage    = 1;
  var activeFilter   = 'all';

  function getVisible () {
    return catalogCards.filter(function (card) {
      var cat = card.dataset.category || '';
      return activeFilter === 'all' || cat.split(' ').indexOf(activeFilter) !== -1;
    });
  }

  function showPage (page) {
    var visible = getVisible();
    var total   = Math.ceil(visible.length / ITEMS_PER_PAGE);
    currentPage = Math.max(1, Math.min(page, total || 1));

    var start = (currentPage - 1) * ITEMS_PER_PAGE;
    var end   = start + ITEMS_PER_PAGE;

    // Hide all, then show only current page slice
    catalogCards.forEach(function (card) { card.classList.add('hidden'); });
    visible.forEach(function (card, i) {
      if (i >= start && i < end) {
        card.classList.remove('hidden');
        card.classList.remove('animate-in');
        requestAnimationFrame(function () {
          card.classList.add('fade-up');
          requestAnimationFrame(function () { card.classList.add('animate-in'); });
        });
      }
    });

    // Prev / Next
    if (pagePrev) pagePrev.disabled = currentPage <= 1;
    if (pageNext) pageNext.disabled = currentPage >= total;

    // Page numbers with ellipsis
    if (pageNumbers) {
      pageNumbers.innerHTML = '';
      if (total <= 1) { if (pagination) pagination.style.display = 'none'; return; }
      if (pagination) pagination.style.display = '';

      var pages = [];
      if (total <= 7) {
        for (var i = 1; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        if (currentPage > 3) pages.push('…');
        for (var i = Math.max(2, currentPage - 1); i <= Math.min(total - 1, currentPage + 1); i++) pages.push(i);
        if (currentPage < total - 2) pages.push('…');
        pages.push(total);
      }

      pages.forEach(function (p) {
        if (p === '…') {
          var span = document.createElement('span');
          span.className = 'page-ellipsis';
          span.textContent = '…';
          pageNumbers.appendChild(span);
        } else {
          var btn = document.createElement('button');
          btn.className = 'page-num' + (p === currentPage ? ' active' : '');
          btn.textContent = p;
          btn.setAttribute('aria-label', 'Página ' + p);
          if (p !== currentPage) {
            btn.addEventListener('click', function () {
              showPage(parseInt(this.textContent, 10));
              scrollToCatalog();
            });
          }
          pageNumbers.appendChild(btn);
        }
      });
    }
  }

  function scrollToCatalog () {
    var grid = document.querySelector('.catalog-grid');
    if (!grid) return;
    var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 80;
    window.scrollTo({ top: grid.getBoundingClientRect().top + window.scrollY - headerH - 24, behavior: 'smooth' });
  }

  if (filterBtns.length && catalogCards.length) {
    if (pagePrev) pagePrev.addEventListener('click', function () { showPage(currentPage - 1); scrollToCatalog(); });
    if (pageNext) pageNext.addEventListener('click', function () { showPage(currentPage + 1); scrollToCatalog(); });

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        activeFilter = this.dataset.filter;
        currentPage  = 1;
        showPage(1);
      });
    });

    showPage(1); // init
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
