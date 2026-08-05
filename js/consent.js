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

  if (!stored) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', buildBanner);
    } else {
      buildBanner();
    }
  }
})();
