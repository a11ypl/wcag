import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({headless:true});
const reports = [];
try {
  for(const width of [1440,360]) {
    const page = await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
    const errors = [];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route(/^https?:/,route=>route.abort());
    await page.goto(pathToFileURL(resolve(root,'review/index.html')).href);
    await page.evaluate(()=>document.fonts.ready);
    await page.locator('img').evaluateAll(async images => { for(const im of images) { im.loading='eager'; if(!im.complete) await new Promise(resolve=>{im.onload=resolve;im.onerror=resolve;}); } });
    const initial = await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,missingImages:[...document.images].filter(im=>!im.complete||!im.naturalWidth).map(im=>im.getAttribute('src')),h1Count:document.querySelectorAll('h1').length,missingAlt:document.querySelectorAll('img:not([alt])').length}));
    await page.keyboard.press('Tab');
    const focus = await page.evaluate(()=>({element:document.activeElement.tagName,text:document.activeElement.textContent,outline:getComputedStyle(document.activeElement).outlineWidth}));
    await page.keyboard.press('Enter');
    const skipTarget = await page.evaluate(()=>location.hash==='#main');
    await page.locator('summary').first().focus();
    await page.keyboard.press('Enter');
    const detailsKeyboard = await page.locator('details').first().getAttribute('open') !== null;
    await page.keyboard.press('Enter');
    await page.evaluate(()=>{document.activeElement.blur();window.scrollTo(0,0);});
    await page.screenshot({path:resolve(root,`review/overview-${width}.png`)});
    await page.locator('#characters').screenshot({path:resolve(root,`review/characters-${width}.png`)});
    await page.addStyleTag({content:'body *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}'});
    const spacing = await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,clipped:[...document.querySelectorAll('p,h1,h2,h3,summary,a')].filter(el=>getComputedStyle(el).overflow==='hidden'&&(el.scrollHeight>el.clientHeight||el.scrollWidth>el.clientWidth)).map(el=>el.textContent.slice(0,70))}));
    const pass=!errors.length&&!initial.overflow&&!initial.missingImages.length&&!initial.missingAlt&&initial.h1Count===1&&skipTarget&&detailsKeyboard&&!spacing.overflow&&!spacing.clipped.length&&parseFloat(focus.outline)>0;
    reports.push({width,status:pass?'pass':'fail',...initial,focus,skipTarget,detailsKeyboard,spacing,errors});
    await page.close();
  }
} finally { await browser.close(); }
await writeFile(resolve(root,'review/review-qa.json'),JSON.stringify(reports,null,2)+'\n');
console.log(JSON.stringify(reports));
if(reports.some(r=>r.status==='fail'))process.exitCode=1;
