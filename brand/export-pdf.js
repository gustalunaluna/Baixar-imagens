const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  const filePath = path.resolve(__dirname, 'brand-guide.html');
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle', timeout: 30000 });

  await page.waitForTimeout(3000);

  await page.pdf({
    path: path.resolve(__dirname, 'ls-confex-brand-guide.pdf'),
    width: '1920px',
    height: '1080px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  console.log('PDF exported successfully.');
})();
