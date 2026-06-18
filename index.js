#!/usr/bin/env node

const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Uso: node index.js <url> [pasta-destino]');
  console.log('Exemplo: node index.js "https://www.bolovo.com.br/bags/pochetes?page=4" ./imagens');
  process.exit(1);
}

const targetUrl = args[0];
const outputDir = args[1] || './imagens';

async function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 100);
}

async function downloadImage(imgUrl, destPath, referer) {
  try {
    const response = await axios.get(imgUrl, {
      responseType: 'arraybuffer',
      timeout: 20000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Referer': referer,
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
    });

    const contentType = response.headers['content-type'] || '';
    if (!contentType.startsWith('image/')) return false;

    fs.writeFileSync(destPath, response.data);
    return true;
  } catch {
    return false;
  }
}

function resolveUrl(src, baseUrl) {
  if (!src) return null;
  try {
    return new URL(src, baseUrl).href;
  } catch {
    return null;
  }
}

function isImageUrl(u) {
  if (!u) return false;
  // Aceita extensões de imagem comuns, ou URLs que passem pelo CDN de imagens
  return /\.(jpg|jpeg|png|webp|gif|avif|svg)(\?|$|&)/i.test(u)
    || /\/(image|img|foto|photo|media|cdn|static|asset|product|thumb)/i.test(u);
}

async function scrollPage(page) {
  // Faz scroll gradual para ativar lazy-load, aguardando novas imagens surgirem
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const step = 250;
      const delay = 120;
      let last = 0;
      const tick = () => {
        const total = document.body.scrollHeight;
        window.scrollBy(0, step);
        if (window.scrollY + window.innerHeight >= total) {
          if (window.scrollY === last) { resolve(); return; }
          last = window.scrollY;
        }
        setTimeout(tick, delay);
      };
      tick();
    });
  });
  // Aguarda imagens que possam ter sido inseridas dinamicamente
  await new Promise(r => setTimeout(r, 2500));
  // Volta ao topo e faz um segundo scroll para capturar mais
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const step = 400;
      const delay = 80;
      const tick = () => {
        const total = document.body.scrollHeight;
        window.scrollBy(0, step);
        if (window.scrollY + window.innerHeight >= total) { resolve(); return; }
        setTimeout(tick, delay);
      };
      tick();
    });
  });
  await new Promise(r => setTimeout(r, 1500));
}

async function collectImageUrls(page, baseUrl) {
  return page.evaluate((base) => {
    const toAbs = (src) => {
      if (!src) return null;
      try { return new URL(src, base).href; } catch { return null; }
    };

    // Todos os atributos comuns de imagem lazy-load
    const lazyAttrs = [
      'src', 'data-src', 'data-lazy', 'data-lazy-src', 'data-original',
      'data-url', 'data-image', 'data-full', 'data-zoom-image',
      'data-large-image', 'data-hi-res', 'data-img-url',
    ];

    const urls = new Set();

    // <img> com todos os atributos possíveis
    document.querySelectorAll('img').forEach(img => {
      lazyAttrs.forEach(attr => {
        const v = img.getAttribute(attr);
        if (v) urls.add(toAbs(v));
      });
      // srcset
      const srcset = img.getAttribute('srcset') || img.getAttribute('data-srcset') || '';
      srcset.split(',').forEach(entry => {
        const u = entry.trim().split(/\s+/)[0];
        if (u) urls.add(toAbs(u));
      });
    });

    // <source> dentro de <picture>
    document.querySelectorAll('source').forEach(src => {
      const srcset = src.getAttribute('srcset') || src.getAttribute('data-srcset') || '';
      srcset.split(',').forEach(entry => {
        const u = entry.trim().split(/\s+/)[0];
        if (u) urls.add(toAbs(u));
      });
      const s = src.getAttribute('src');
      if (s) urls.add(toAbs(s));
    });

    // background-image inline
    document.querySelectorAll('[style]').forEach(el => {
      const bg = el.style.backgroundImage;
      if (bg) {
        const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
        if (m) urls.add(toAbs(m[1]));
      }
    });

    // background-image computado (captura classes CSS com imagens)
    document.querySelectorAll('*').forEach(el => {
      try {
        const bg = window.getComputedStyle(el).backgroundImage;
        if (bg && bg !== 'none') {
          const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
          if (m && !m[1].startsWith('data:')) urls.add(toAbs(m[1]));
        }
      } catch {}
    });

    // Qualquer atributo que contenha URL de imagem (ex: data-image-url em sites customizados)
    document.querySelectorAll('[data-image-url],[data-img],[data-photo]').forEach(el => {
      ['data-image-url','data-img','data-photo'].forEach(attr => {
        const v = el.getAttribute(attr);
        if (v) urls.add(toAbs(v));
      });
    });

    return [...urls].filter(Boolean);
  }, baseUrl);
}

async function scrapeAndDownload(url, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  console.log(`\nAbrindo: ${url}`);
  console.log(`Salvando em: ${path.resolve(destDir)}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--ignore-certificate-errors',
      '--disable-blink-features=AutomationControlled',
    ],
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  await page.setViewport({ width: 1366, height: 768 });

  // Intercepta respostas de imagem para capturar URLs carregadas dinamicamente via JS
  const networkImageUrls = new Set();
  page.on('response', response => {
    const ct = response.headers()['content-type'] || '';
    if (ct.startsWith('image/')) {
      networkImageUrls.add(response.url());
    }
  });

  console.log('Carregando página...');
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  } catch (e) {
    if (e.message.includes('timeout')) {
      console.log('Aviso: timeout no carregamento inicial, continuando...');
    } else {
      await browser.close();
      throw e;
    }
  }

  // Aguarda conteúdo principal aparecer
  await new Promise(r => setTimeout(r, 2000));

  console.log('Fazendo scroll para carregar imagens lazy...');
  await scrollPage(page);

  console.log('Coletando URLs de imagens...');
  const domUrls = await collectImageUrls(page, url);

  await browser.close();

  // Junta URLs do DOM + interceptadas pela rede
  const allUrls = [...new Set([...domUrls, ...networkImageUrls])];

  // Filtra só imagens reais (exclui data:, SVG tiny de ícones, etc.)
  const validUrls = allUrls.filter(u => {
    if (!u || !u.startsWith('http')) return false;
    if (u.includes('data:')) return false;
    return isImageUrl(u);
  });

  // Remove duplicatas por nome de arquivo (pega a URL com maior resolução em caso de srcset)
  const deduped = [];
  const seen = new Set();
  for (const u of validUrls) {
    try {
      const key = new URL(u).pathname;
      if (!seen.has(key)) { seen.add(key); deduped.push(u); }
    } catch { deduped.push(u); }
  }

  console.log(`\nImagens encontradas: ${deduped.length}`);
  if (deduped.length === 0) {
    console.log('Nenhuma imagem encontrada. O site pode usar proteção extra contra bots.');
    return;
  }

  let baixadas = 0;
  let falhas = 0;

  for (let i = 0; i < deduped.length; i++) {
    const imgUrl = deduped[i];
    try {
      const urlObj = new URL(imgUrl);
      const rawName = path.basename(urlObj.pathname) || `imagem_${i + 1}`;
      const baseName = await sanitizeFilename(rawName);
      const ext = path.extname(baseName) || '.jpg';
      const nameWithoutExt = path.basename(baseName, ext);
      const fileName = `${String(i + 1).padStart(3, '0')}_${nameWithoutExt}${ext}`;
      const destPath = path.join(destDir, fileName);

      process.stdout.write(`[${i + 1}/${deduped.length}] ${fileName}... `);
      const ok = await downloadImage(imgUrl, destPath, url);

      if (ok) {
        console.log('OK');
        baixadas++;
      } else {
        console.log('falhou');
        falhas++;
      }
    } catch {
      falhas++;
    }
  }

  console.log(`\nConcluído! Baixadas: ${baixadas} | Falhas: ${falhas}`);
  console.log(`Pasta: ${path.resolve(destDir)}`);
}

scrapeAndDownload(targetUrl, outputDir).catch(err => {
  console.error('Erro:', err.message);
  process.exit(1);
});
