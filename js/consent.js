/* LS Confecções — consentimento de cookies (Google Consent Mode v2, sem banner)
   Deve ser carregado no <head>, ANTES de qualquer chamada gtag/config. */
(function () {
  'use strict';

  // Sem banner: Google Analytics e Meta Pixel carregam para todos os visitantes.
  // Os dados sao usados apenas de forma agregada (visitas, origem, paginas).
  var granted = true;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }
  gtag('consent', 'default', {
    ad_storage: 'granted',
    analytics_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    functionality_storage: 'granted',
    security_storage: 'granted'
  });

  window.LS_CONSENT = { granted: granted };
  try { localStorage.removeItem('ls_consent_v1'); } catch (e) {}

  // Evento da Meta: vai pelo Pixel (navegador) e pela API de Conversões (/api/meta-capi)
  // com o mesmo event_id, para a Meta não contar duas vezes.
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

})();
