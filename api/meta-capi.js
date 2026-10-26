// API de Conversões da Meta: repete no servidor os eventos que o Pixel envia pelo navegador.
// O navegador manda o mesmo event_id para o Pixel e para cá; a Meta junta os dois (deduplicação).
// Só recebe eventos de quem aceitou os cookies (o envio sai de js/consent.js).
// Precisa da variável META_CAPI_TOKEN na Vercel; sem ela, não faz nada.

const PIXEL = '891991662958124';
const EVENTOS = ['PageView', 'ViewContent', 'Contact', 'Lead'];
const DOMINIOS = ['www.lsconfex.com.br', 'lsconfex.com.br'];

function lerCorpo(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  if (typeof req.body === 'string') return Promise.resolve(JSON.parse(req.body));
  return new Promise((resolve, reject) => {
    let txt = '';
    req.on('data', c => { txt += c; if (txt.length > 8000) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(txt || '{}')); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
  const token = process.env.META_CAPI_TOKEN;
  if (!token) { res.statusCode = 204; return res.end(); }

  let d;
  try { d = await lerCorpo(req); } catch (e) { res.statusCode = 400; return res.end(); }

  let url;
  try { url = new URL(String(d.event_source_url || '')); } catch (e) { url = null; }
  if (!EVENTOS.includes(d.event_name) || !d.event_id || !url || !DOMINIOS.includes(url.hostname)) {
    res.statusCode = 400; return res.end();
  }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress;
  const user_data = { client_ip_address: ip, client_user_agent: String(req.headers['user-agent'] || '') };
  if (/^fb\.\d\.\d+\.[\w.-]+$/.test(d.fbp || '')) user_data.fbp = d.fbp;
  if (/^fb\.\d\.\d+\.[\w.-]+$/.test(d.fbc || '')) user_data.fbc = d.fbc;

  const custom_data = {};
  for (const k of ['content_name', 'content_category', 'content_type']) {
    if (d.custom_data && typeof d.custom_data[k] === 'string') custom_data[k] = d.custom_data[k].slice(0, 200);
  }

  const evento = {
    event_name: d.event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id: String(d.event_id).slice(0, 100),
    event_source_url: url.href.slice(0, 1000),
    action_source: 'website',
    user_data,
    custom_data
  };

  try {
    const r = await fetch(`https://graph.facebook.com/v21.0/${PIXEL}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [evento] })
    });
    if (!r.ok) console.error('CAPI', r.status, (await r.text()).slice(0, 300));
  } catch (e) {
    console.error('CAPI falhou', e.message);
  }
  res.statusCode = 204;
  res.end();
};
