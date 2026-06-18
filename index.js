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

async function downloadImage(imgUrl, destPath) {
  try {
    const response = await axios.get(imgUrl, {
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
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

function getExtension(imgUrl, contentType) {
  const urlPath = new URL(imgUrl).pathname;
  const ext = path.extname(urlPath);
  if (ext) return ext;
  const map = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/svg+xml': '.svg' };
  return map[contentType] || '.jpg';
}

async function scrapeAndDownload(url, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  console.log(`\nAbrindo: ${url}`);
  console.log(`Salvando em: ${path.resolve(destDir)}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors'],
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');

  // Tenta networkidle2 primeiro; se timeout, continua com o que já carregou
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  } catch (e) {
    if (e.message.includes('timeout')) {
      console.log('Aviso: timeout ao aguardar rede quieta, continuando com o que carregou...');
    } else {
      throw e;
    }
  }

  // Scroll para carregar imagens lazy-loaded
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = document.body.scrollHeight;
      let current = 0;
      const step = 300;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        current += step;
        if (current >= total) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  await new Promise(r => setTimeout(r, 1500));

  // Coleta todas as URLs de imagens
  const imageUrls = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const bgImgs = Array.from(document.querySelectorAll('[style]'))
      .map(el => {
        const match = el.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    const srcset = imgs.flatMap(img => {
      if (!img.srcset) return [];
      return img.srcset.split(',').map(s => s.trim().split(/\s+/)[0]);
    });

    return [...new Set([
      ...imgs.map(img => img.src).filter(Boolean),
      ...imgs.map(img => img.getAttribute('data-src')).filter(Boolean),
      ...imgs.map(img => img.getAttribute('data-lazy-src')).filter(Boolean),
      ...srcset,
      ...bgImgs,
    ])];
  });

  await browser.close();

  // Filtra URLs válidas
  const validUrls = imageUrls
    .filter(u => u && u.startsWith('http'))
    .filter(u => /\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/i.test(u) || u.includes('/image') || u.includes('/img'));

  console.log(`Imagens encontradas: ${validUrls.length}`);

  let baixadas = 0;
  let falhas = 0;

  for (let i = 0; i < validUrls.length; i++) {
    const imgUrl = validUrls[i];
    try {
      const urlObj = new URL(imgUrl);
      const baseName = await sanitizeFilename(path.basename(urlObj.pathname) || `imagem_${i + 1}`);
      const ext = path.extname(baseName) || '.jpg';
      const nameWithoutExt = path.basename(baseName, ext);
      const fileName = `${String(i + 1).padStart(3, '0')}_${nameWithoutExt}${ext}`;
      const destPath = path.join(destDir, fileName);

      process.stdout.write(`[${i + 1}/${validUrls.length}] Baixando ${fileName}... `);
      const ok = await downloadImage(imgUrl, destPath);

      if (ok) {
        console.log('OK');
        baixadas++;
      } else {
        console.log('FALHOU');
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
