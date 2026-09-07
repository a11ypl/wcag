import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { sha256 } from './compose.mjs';

const require = createRequire(import.meta.url);
let browser;
try {
  const { chromium } = require('playwright');
  const dirs = process.argv.slice(2);
  if (!dirs.length) throw new Error('Użycie: render.mjs katalog-wyniku [kolejny-katalog]');
  browser = await chromium.launch({ headless: true });
  let failures = 0;
  for (const dir of dirs) {
    const root = resolve(dir);
    const manifest = JSON.parse(await readFile(resolve(root, 'manifest.json'), 'utf8'));
    const html = await readFile(resolve(root, 'graphic.html'));
    const page = await browser.newPage({ viewport: { width: manifest.width, height: manifest.height }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route(/^https?:/, route => route.abort());
    await page.goto(pathToFileURL(resolve(root, 'graphic.html')).href);
    await page.evaluate(() => document.fonts.ready);
    const layout = await page.evaluate(() => {
      const root = document.querySelector('.artboard');
      const outside = [];
      const rr = root.getBoundingClientRect();
      for (const el of root.querySelectorAll('header,.content,.copy,h1,.body-copy,.details,.illustration,footer,.cta,.url,.scene-placeholder')) {
        const r = el.getBoundingClientRect();
        if (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2 || r.left < rr.left - 1 || r.top < rr.top - 1 || r.right > rr.right + 1 || r.bottom > rr.bottom + 1) outside.push({ element: el.tagName + '.' + el.className, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight });
      }
      const boxes = ['header', '.copy', '.illustration', 'footer'].map(selector => ({ selector, r: document.querySelector(selector).getBoundingClientRect() }));
      const overlaps = [];
      const immersive = root.classList.contains('immersive');
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
        if (immersive && (boxes[i].selector === '.illustration' || boxes[j].selector === '.illustration')) continue;
        const a = boxes[i].r, b = boxes[j].r;
        if (Math.min(a.right,b.right)-Math.max(a.left,b.left)>2 && Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>2) overlaps.push([boxes[i].selector,boxes[j].selector]);
      }
      return { outside, overlaps, imagesLoaded: [...document.images].every(img => img.complete && img.naturalWidth > 0), fontsLoaded: document.fonts.check('700 30px AF') && document.fonts.check('400 30px AF'), width: root.offsetWidth, height: root.offsetHeight };
    });
    const passed = !errors.length && !layout.outside.length && !layout.overlaps.length && layout.imagesLoaded && layout.fontsLoaded && layout.width === manifest.width && layout.height === manifest.height;
    const report = { status: passed ? 'pass' : 'fail', scope: 'technical-layout-only; identity and anatomy require visual review', ...layout, errors, html_sha256: sha256(html) };
    await writeFile(resolve(root, 'layout-qa.json'), JSON.stringify(report, null, 2) + '\n');
    if (passed) {
      await page.locator('.artboard').screenshot({ path: resolve(root, 'graphic.png') });
      const pngHash = sha256(await readFile(resolve(root, 'graphic.png')));
      await writeFile(resolve(root, 'manifest.json'), JSON.stringify({ ...manifest, html_sha256: sha256(html), png_sha256: pngHash, layout_review: 'pass' }, null, 2) + '\n');
    } else {
      failures++;
      await page.locator('.artboard').screenshot({ path: resolve(root, 'graphic-debug.png') });
    }
    console.log(JSON.stringify({ directory: root, ...report }));
    await page.close();
  }
  if (failures) process.exitCode = 1;
} catch (error) { console.error(error.message); process.exitCode = 1; }
finally { if (browser) await browser.close(); }
