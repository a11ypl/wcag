import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve, extname } from 'node:path';
import { chromium } from '../../a11yfirst-lab/node_modules/playwright/index.mjs';

const root = resolve(import.meta.dirname, '../..');
const publicRoot = process.env.HEADER_PUBLIC_DIR || resolve(root, 'public');
const htmlFiles = execFileSync('git', ['ls-files', 'public'], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(path => path.endsWith('.html'));
for (const path of ['public/webinary.html', 'public/webinary/semantyczny-html-nie-taki-straszny.html', 'public/webinary/nieoczywiste-wtyczki-do-badania-dostepnosci-cyfrowej.html']) {
  if (!htmlFiles.includes(path)) htmlFiles.push(path);
}
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'a11yfirst.test') return route.abort();
    let path = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
    if (!extname(path)) path += '.html';
    try {
      const body = await readFile(resolve(publicRoot, `.${path}`));
      const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };
      return route.fulfill({ body, contentType: mime[extname(path)] || 'application/octet-stream' });
    } catch {
      return route.fulfill({ status: 404, body: 'Missing local resource' });
    }
  });
  for (const path of htmlFiles) {
    await page.goto(`http://a11yfirst.test/${path.slice('public/'.length)}`);
    await page.locator('main').waitFor({ timeout: 5000 });
    assert.equal(await page.locator('h1').count(), 1, path);
    assert.equal(await page.locator('html').getAttribute('lang'), 'pl', path);
    const atRest = await page.evaluate(() => ({ y: scrollY, height: document.querySelector('header')?.offsetHeight }));
    await page.evaluate(() => scrollTo(0, 85));
    const samples = await page.evaluate(async () => {
      const samples = [];
      for (let i = 0; i < 4; i++) {
        await new Promise(requestAnimationFrame);
        samples.push({ y: scrollY, height: document.querySelector('header')?.offsetHeight });
      }
      return samples;
    });
    assert.ok(samples.every(sample => sample.height === atRest.height), `${path}: header changed size`);
    assert.ok(samples.every(sample => sample.y === samples[0].y), `${path}: page moved without input`);
    assert.deepEqual(errors.splice(0), [], `${path}: script errors`);
  }
  console.log(`PASS: ${htmlFiles.length} pages, headings, language, scripts and stable header`);

  const money = text => Number(text.replace(/[^\d,]/g, '').replace(',', '.'));
  for (const path of ['sklep', 'szkolenie-ai-asystent', 'szkolenie-poglebiajace', 'wcag-dla-specjalistow']) {
    await page.goto(`http://a11yfirst.test/${path}`);
    assert.equal(await page.locator('[id*="discount"], .checkout-discount').count(), 0, `${path}: discount field`);
    assert.doesNotMatch(await page.locator('body').textContent(), /kod rabatowy|jestemwgrupie/i, `${path}: discount text`);
  }
  for (const [path, prefix, price] of [['szkolenie-ai-asystent', 'ai', 1999], ['szkolenie-poglebiajace', 'poglebiajace', 1649]]) {
    await page.goto(`http://a11yfirst.test/${path}`);
    assert.equal(money(await page.locator(`#${prefix}TotalPrice`).textContent()), price);
  }
  await page.goto('http://a11yfirst.test/sklep');
  assert.equal(await page.locator('[value="DOC01"]').count(), 0);
  await page.locator('[data-checkout-select="shop-product-2"]').click();
  assert.ok(await page.locator('#shop-product-2').isChecked());
  assert.ok(!await page.locator('#shop-product-1').isChecked());
  assert.equal(money(await page.locator('#shopTotalPrice').textContent()), 69);
  await page.locator('[data-checkout-select="shop-product-3"]').click();
  assert.equal(money(await page.locator('#shopTotalPrice').textContent()), 138);
  console.log('PASS: no discount codes, training prices and shop totals');

  await page.goto('http://a11yfirst.test/wcag-dla-specjalistow');
  await page.locator('#toggleDaysBtn').click();
  await page.locator('#pricing-day-1').check();
  assert.equal(money(await page.locator('#totalPrice').textContent()), 999);
  await page.locator('#pricing-day-2').check();
  assert.equal(money(await page.locator('#totalPrice').textContent()), 1998);
  await page.locator('#pricing-day-3').check();
  assert.equal(money(await page.locator('#totalPrice').textContent()), 2499);
  console.log('PASS: WCAG course day changes and full-course price');

  await page.goto('http://a11yfirst.test/baza-wiedzy/aria');
  const summary = page.locator('[data-aria-reference-list] summary').first();
  await summary.focus();
  await page.keyboard.press('Enter');
  assert.ok(await summary.evaluate(node => node.parentElement.open));
  await page.keyboard.press('Space');
  assert.ok(!await summary.evaluate(node => node.parentElement.open));
  await page.locator('#aria-search').fill('aria-label');
  assert.ok(await page.locator('[data-name][data-type]:visible').count() > 0);
  assert.deepEqual(errors, []);
  console.log('PASS: ARIA disclosures with keyboard and search');
} finally {
  await browser.close();
}
