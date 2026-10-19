// @ts-check
const { test, expect } = require('@playwright/test');

const paginas = ['/', '/produtos.html', '/blog.html', '/brindes.html', '/calculadora-preco-marca.html', '/blog/como-precificar-bolsas-da-sua-marca.html'];

for (const url of paginas) {
  test(`${url} abre com título, H1 e sem rolagem lateral`, async ({ page }) => {
    const erros = [];
    page.on('pageerror', e => erros.push(e.message));
    await page.goto(url);
    await expect(page).toHaveTitle(/LS Confecções/);
    await expect(page.locator('h1')).toHaveCount(1);
    const largura = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(largura).toBeLessThanOrEqual(1);
    expect(erros).toEqual([]);
  });
}

test('botão de WhatsApp aponta para o número comercial', async ({ page }) => {
  await page.goto('/');
  const link = page.locator('a[href*="5511999370418"]').first();
  await expect(link).toHaveCount(1);
});

test('calculadora de preço aceita vírgula decimal', async ({ page }) => {
  await page.goto('/calculadora-preco-marca.html');
  const campos = page.locator('input[inputmode="decimal"]');
  await campos.nth(0).fill('50');
  await campos.nth(1).fill('150,00');
  await expect(page.locator('body')).toContainText('66,7%');
});
