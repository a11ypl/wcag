import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEvents } from '../cms/lib/events.mjs';
import { renderEvent, renderEventList, renderEventCards, renderHomeWebinars } from '../cms/lib/render-event.mjs';
import { validateRenderedHtml } from '../cms/lib/validate.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const site=JSON.parse(readFileSync(join(root,'cms/content/site.json'),'utf8'));
const events=loadEvents(root);
const out=join(root,'public');
const now=Date.now();
const pages=[['webinary',renderEventList(site,events,now)],...events.map(e=>[`webinary/${e.slug}`,renderEvent(site,e,now)])];
for(const [slug,html] of pages) {
  const issues=validateRenderedHtml(html,slug);
  if(issues.some(i=>i.level==='error')) throw new Error(JSON.stringify(issues));
  mkdirSync(dirname(join(out,`${slug}.html`)),{recursive:true});
  writeFileSync(join(out,`${slug}.html`),html);
}
const trainingPath=join(out,'szkolenia.html');
let training=readFileSync(trainingPath,'utf8');
const markerStart='<!-- generated:webinars:start -->',markerEnd='<!-- generated:webinars:end -->';
const listing=`${markerStart}\n<section class="program training-page webinar-list" aria-labelledby="webinary-title"><div class="container"><h2 class="section-title" id="webinary-title">Webinary online</h2>${renderEventCards(events,now)}<p class="training-list-footer"><a class="btn btn-secondary-light" href="/webinary">Wszystkie webinary Accessibility First</a></p></div></section>\n${markerEnd}`;
training=training.includes(markerStart)?training.replace(/<!-- generated:webinars:start -->[\s\S]*?<!-- generated:webinars:end -->/,listing):training.replace('        <section class="features training-picker"',`${listing}\n        <section class="features training-picker"`);
const trainingStyles='<link rel="stylesheet" href="/assets/events.css?v=5">';
if(!training.includes(trainingStyles)) training=training.replace('</head>',`  ${trainingStyles}\n</head>`);
writeFileSync(trainingPath,training);
const sitemapPath=join(out,'sitemap.xml');
let sitemap=readFileSync(sitemapPath,'utf8').replace(/\s*<!-- generated:webinars:start -->[\s\S]*?<!-- generated:webinars:end -->/,'');
sitemap=sitemap.replace('</urlset>',`  ${markerStart}\n${pages.map(([slug])=>`  <url><loc>${site.baseUrl}/${slug}</loc></url>`).join('\n')}\n  ${markerEnd}\n</urlset>`);
writeFileSync(sitemapPath,sitemap);
console.log(`Events build: ${pages.length} pages, training listing and sitemap. No deployment performed.`);

const homePath=join(out,'index.html');
let home=readFileSync(homePath,'utf8');
const homeSection=renderHomeWebinars(events,now);
const homeBlock=homeSection?`${markerStart}\n${homeSection}\n${markerEnd}`:'';
if(home.includes(markerStart)) home=home.replace(/<!-- generated:webinars:start -->[\s\S]*?<!-- generated:webinars:end -->/,homeBlock);
else if(homeSection) home=home.replace('  </main>',`${homeBlock}\n  </main>`);
const homeStyles='<link rel="stylesheet" href="/assets/events.css?v=5">';
if(homeSection && !home.includes(homeStyles)) home=home.replace('</head>',`  ${homeStyles}\n</head>`);
if(home!==readFileSync(homePath,'utf8')) writeFileSync(homePath,home);
console.log(`Home webinar announcements: ${homeSection?'ready':'waiting for approved graphics and speakers'}.`);
