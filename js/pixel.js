/* LS Confecções — Meta Pixel nas páginas que não têm o carregador da home.
   Respeita o consentimento (js/consent.js chama LS_loadTracking ao aceitar)
   e carrega na 1ª interação ou após 2,5 s, para não competir com o LCP. */
(function () {
  'use strict';

  var PIXEL = '891991662958124';
  var carregado = false;

  // Páginas de produto/categoria geram ViewContent; blog e páginas institucionais só PageView
  function conteudo() {
    var path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
    if (/^\/blog(\/|$)|politica|termos|mapa-do-site|calculadora|404|obrigado/.test(path) || path === '') return null;
    var h1 = document.querySelector('h1');
    return {
      content_name: h1 ? h1.textContent.replace(/\s+/g, ' ').trim() : document.title,
      content_category: 'Produto',
      content_type: 'product_group'
    };
  }

  function carregar() {
    if (carregado || typeof window.fbq === 'function') { carregado = true; return; }
    carregado = true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL);
    window.fbq('track', 'PageView');
    var c = conteudo();
    if (c) window.fbq('track', 'ViewContent', c);
  }

  var anterior = window.LS_loadTracking;
  window.LS_loadTracking = function () {
    if (typeof anterior === 'function') anterior();
    carregar();
  };

  if (!(window.LS_CONSENT && window.LS_CONSENT.granted)) return;
  var evs = ['scroll', 'mousemove', 'touchstart', 'click', 'keydown'];
  function primeira() {
    evs.forEach(function (ev) { window.removeEventListener(ev, primeira); });
    carregar();
  }
  evs.forEach(function (ev) { window.addEventListener(ev, primeira, { passive: true }); });
  setTimeout(carregar, 2500);
})();
