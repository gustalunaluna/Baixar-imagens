/* LS Confecções — consentimento de cookies (LGPD + Google Consent Mode v2)
   Deve ser carregado no <head>, ANTES de qualquer chamada gtag/config. */
(function () {
  'use strict';

  var KEY = 'ls_consent_v1';
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) { /* modo privado */ }

  var granted = stored === 'accepted';

  // --- Consent Mode v2: estado inicial (negado até haver escolha) ---
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }
  gtag('consent', 'default', {
    ad_storage: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });

  // Sinaliza para o carregador de tracking se pode disparar
  window.LS_CONSENT = { granted: granted };

  function apply(state) {
    var g = state === 'accepted';
    gtag('consent', 'update', {
      ad_storage: g ? 'granted' : 'denied',
      analytics_storage: g ? 'granted' : 'denied',
      ad_user_data: g ? 'granted' : 'denied',
      ad_personalization: g ? 'granted' : 'denied'
    });
    if (typeof window.fbq === 'function') {
      window.fbq('consent', g ? 'grant' : 'revoke');
    }
    window.LS_CONSENT.granted = g;
    try { localStorage.setItem(KEY, state); } catch (e) {}
    if (g && typeof window.LS_loadTracking === 'function') {
      window.LS_loadTracking();
    }
  }

  function buildBanner() {
    if (document.getElementById('ls-cookie-banner')) return;

    var el = document.createElement('div');
    el.id = 'ls-cookie-banner';
    el.className = 'ls-cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-label', 'Aviso de cookies');
    el.innerHTML =
      '<div class="ls-cookie-inner">' +
        '<p class="ls-cookie-text">Usamos cookies para medir o desempenho do site e melhorar sua experiência. ' +
        'Você pode aceitar ou recusar os cookies de análise e publicidade. ' +
        '<a href="/politica-de-privacidade">Saiba mais</a>.</p>' +
        '<div class="ls-cookie-actions">' +
          '<button type="button" class="ls-cookie-btn ls-cookie-btn--ghost" data-consent="rejected">Recusar</button>' +
          '<button type="button" class="ls-cookie-btn ls-cookie-btn--accept" data-consent="accepted">Aceitar</button>' +
        '</div>' +
      '</div>';

    el.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-consent]');
      if (!btn) return;
      apply(btn.getAttribute('data-consent'));
      el.classList.remove('is-visible');
      setTimeout(function () { el.remove(); }, 300);
    });

    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('is-visible'); });
  }

  // Evento da Meta: vai pelo Pixel (navegador) e pela API de Conversões (/api/meta-capi)
  // com o mesmo event_id, para a Meta não contar duas vezes. Só com consentimento.
  function cookie(nome) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + nome + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }
  window.LS_evento = function (nome, dados) {
    if (!window.LS_CONSENT.granted) return;
    dados = dados || {};
    var id = nome + '.' + Date.now() + '.' + Math.random().toString(36).slice(2, 10);
    if (typeof window.fbq === 'function') window.fbq('track', nome, dados, { eventID: id });
    var fbc = cookie('_fbc');
    var clid = new URLSearchParams(location.search).get('fbclid');
    if (!fbc && clid) fbc = 'fb.1.' + Date.now() + '.' + clid;
    var corpo = JSON.stringify({ event_name: nome, event_id: id, event_source_url: location.href, custom_data: dados, fbp: cookie('_fbp'), fbc: fbc });
    try {
      if (navigator.sendBeacon) navigator.sendBeacon('/api/meta-capi', corpo);
      else fetch('/api/meta-capi', { method: 'POST', body: corpo, keepalive: true });
    } catch (e) { /* o Pixel já registrou pelo navegador */ }
  };

  if (!stored) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', buildBanner);
    } else {
      buildBanner();
    }
  }
})();
