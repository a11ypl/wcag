import assert from 'node:assert/strict';
import { readFile, readdir, mkdir, access } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from '../../a11yfirst-lab/node_modules/playwright/index.mjs';

const root = resolve(import.meta.dirname, '../..');
const publicRoot = process.env.HEADER_PUBLIC_DIR || resolve(root, 'public');
const output = resolve(root, 'output/header-stability');
const before = process.env.HEADER_BEFORE_DIR;
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
});
const context = await browser.newContext();
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };
await context.route('**/*', async route => {
  const url = new URL(route.request().url());
  if (url.hostname !== 'a11yfirst.test') return route.abort();
  let path = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  if (!extname(path)) path += '.html';
  try {
    const original = before && ['/assets/styles.css', '/assets/header.js', '/index.html'].includes(path);
    const file = original ? resolve(before, path.split('/').at(-1)) : resolve(publicRoot, `.${path}`);
    let body = await readFile(file);
    if (before && extname(path) === '.html' && !body.includes('assets/header.js')) {
      body = Buffer.from(body.toString().replace('</body>', '<script src="/assets/header.js"></script></body>'));
    }
    return route.fulfill({ body, contentType: types[extname(path)] || 'application/octet-stream' });
  } catch {
    return route.fulfill({ status: 404, body: 'Not found' });
  }
});

const pages = [
  '/', '/kontakt', '/szkolenia', '/baza-wiedzy/aria',
  '/wcag-prostym-jezykiem/3-3-7-powtarzajace-sie-wpisy',
  '/semantyczny-html',
];
// Event pages can be developed locally before they are included in the repository.
try {
  await access(resolve(publicRoot, 'webinary.html'));
  pages.push('/webinary');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const scenarios = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 992, height: 768 },
  { width: 390, height: 844 },
  { width: 320, height: 640 },
  { width: 1024, height: 768, spacing: true },
];
let checks = 0;
try {
  await mkdir(output, { recursive: true });
  const page = await context.newPage();
  for (const scenario of scenarios) {
    await page.setViewportSize({ width: scenario.width, height: scenario.height });
    for (const path of pages) {
      await page.goto(`http://a11yfirst.test${path}`);
      await page.evaluate(() => document.fonts.ready);
      if (scenario.spacing) {
        await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }' });
        await page.evaluate(async () => {
          document.body.getBoundingClientRect();
          await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})));
        });
      }
      const result = await page.evaluate(async () => {
        const sample = () => {
          const header = document.querySelector('header');
          const banner = document.querySelector('.site-banner').getBoundingClientRect();
          const main = document.querySelector('main').getBoundingClientRect();
          return [header.getBoundingClientRect().height, banner.width, banner.height, main.top + scrollY, document.documentElement.scrollHeight];
        };
        scrollTo(0, 0);
        await new Promise(requestAnimationFrame);
        const initial = sample();
        const failures = [];
        for (const y of [39, 41, 79, 81, 85, 119, 120, 121, 160, 300, 85, 40, 0]) {
          const expectedY = Math.min(y, Math.max(0, document.documentElement.scrollHeight - innerHeight));
          scrollTo(0, y);
          for (let frame = 0; frame < 4; frame++) {
            await new Promise(requestAnimationFrame);
            const current = sample();
            if (current.some((value, i) => Math.abs(value - initial[i]) > 1) || Math.abs(scrollY - expectedY) > 1) {
              failures.push({ y, frame, scrollY, expectedY, initial, current });
            }
          }
        }
        const header = document.querySelector('header').getBoundingClientRect();
        const links = [...document.querySelectorAll('header a')].map(link => link.getBoundingClientRect());
        return { failures, clippedLinks: links.filter(rect => rect.left < 0 || rect.right > innerWidth || rect.top < header.top || rect.bottom > header.bottom).length };
      });
      assert.equal(result.failures.length, 0, `${path} at ${scenario.width}px: scroll changes layout: ${JSON.stringify(result.failures[0])}`);
      assert.equal(result.clippedLinks, 0, `${path}: header links must remain visible`);
      checks++;
    }
    console.log(`PASS ${pages.length} pages at ${scenario.width}px${scenario.spacing ? ' with text spacing' : ''}`);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://a11yfirst.test/kontakt');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').getAttribute('href'), '#main');
  await page.keyboard.press('Enter');
  assert.equal(new URL(page.url()).hash, '#main');
  await page.keyboard.press('Tab');
  assert.ok(await page.evaluate(() => document.querySelector('main').contains(document.activeElement)), 'Skip link must move sequential keyboard navigation into main');
  await page.goto('http://a11yfirst.test/kontakt');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: resolve(output, 'desktop.png') });
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('http://a11yfirst.test/kontakt');
  await page.screenshot({ path: resolve(output, 'mobile.png') });

  // Reintroducing a cached legacy script must not move the page with the new CSS.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://a11yfirst.test/wcag-prostym-jezykiem/3-3-7-powtarzajace-sie-wpisy');
  await page.evaluate(() => {
    window.addEventListener('scroll', () => document.body.classList.toggle('header-compact', scrollY > 80));
    scrollTo(0, 85);
  });
  const positions = await page.evaluate(async () => {
    const values = [];
    for (let frame = 0; frame < 30; frame++) {
      await new Promise(requestAnimationFrame);
      values.push(scrollY);
    }
    return values;
  });
  assert.ok(positions.every(y => y === 85), 'Cached legacy script must not restart the scroll loop');

  let htmlCount = 0;
  for (const entry of await readdir(publicRoot, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const file = resolve(entry.parentPath, entry.name);
    const html = await readFile(file, 'utf8');
    if (!html.includes('site-banner')) continue;
    assert.ok(!/assets\/header\.js/.test(html), `${file}: obsolete header script`);
    for (const match of html.matchAll(/(?:\.\.\/|\/)?assets\/styles\.css(?:\?[^"\s]*)?/g)) {
      assert.ok(match[0].endsWith('?v=20'), `${file}: old stylesheet URL`);
    }
    htmlCount++;
  }
  console.log(`PASS ${checks} browser scenarios, keyboard skip link, cached legacy script, ${htmlCount} HTML pages; screenshots: ${output}`);
} finally {
  await browser.close();
}
