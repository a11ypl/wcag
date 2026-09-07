import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const formats = { square: [1080, 1080], portrait: [1080, 1350], story: [1080, 1920], landscape: [1920, 1080] };
const budgets = { training: 32, webinar: 32, tip: 30, carousel: 24, overview: 45 };
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const words = text => String(text).trim().split(/\s+/u).filter(Boolean).length;

export async function validateBrief(brief, briefDir, registry) {
  if (!brief || typeof brief !== 'object' || Array.isArray(brief)) throw new Error('Brief musi być obiektem.');
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(brief.id ?? '')) throw new Error('Niepoprawne id briefu.');
  if (!Object.hasOwn(formats, brief.format)) throw new Error('Nieznany format.');
  if (!Object.hasOwn(budgets, brief.template)) throw new Error('Nieznana makieta.');
  if (brief.style !== undefined && !['standard', 'immersive'].includes(brief.style)) throw new Error('Nieznany styl makiety.');
  if (!['mockup', 'production'].includes(brief.status)) throw new Error('Wymagany status mockup albo production.');
  for (const key of ['title', 'eyebrow', 'body', 'cta', 'url', 'scene', 'illustration', 'illustration_alt']) {
    if (brief[key] !== undefined && typeof brief[key] !== 'string') throw new Error(`${key} musi być tekstem.`);
  }
  if (!brief.title?.trim()) throw new Error('Brak nagłówka.');
  if (!brief.scene?.trim()) throw new Error('Brak opisu sceny.');
  if (!Array.isArray(brief.details ?? []) || (brief.details ?? []).length > 3 || (brief.details ?? []).some(x => typeof x !== 'string')) throw new Error('details: maksymalnie trzy teksty.');
  if (!Array.isArray(brief.characters ?? []) || (brief.characters ?? []).some(x => typeof x !== 'string')) throw new Error('characters musi być listą identyfikatorów.');
  if (new Set(brief.characters ?? []).size !== (brief.characters ?? []).length) throw new Error('Powtórzony identyfikator postaci.');
  const content = [brief.eyebrow, brief.title, brief.body, ...(brief.details ?? []), brief.cta, brief.url].filter(Boolean).join(' ');
  if (words(brief.title) > (brief.template === 'overview' ? 6 : 8)) throw new Error('Nagłówek przekracza budżet słów.');
  if (words(content) > budgets[brief.template]) throw new Error(`Treść przekracza budżet ${budgets[brief.template]} słów; skróć tekst.`);
  if (brief.url && new URL(brief.url).protocol !== 'https:') throw new Error('Link musi używać HTTPS.');
  const selected = (brief.characters ?? []).map(id => {
    const character = registry.characters.find(c => c.id === id);
    if (!character) throw new Error(`Nieznana postać ${id}.`);
    return character;
  });
  let illustrationBytes;
  if (brief.illustration) {
    if (!['.png', '.jpg', '.jpeg', '.webp'].includes(extname(brief.illustration).toLowerCase())) throw new Error('Ilustracja musi być lokalnym plikiem PNG, JPEG lub WebP.');
    illustrationBytes = await readFile(resolve(briefDir, brief.illustration));
  }
  if (brief.status === 'production') {
    if (/\[do uzupełnienia\]/iu.test(content)) throw new Error('Produkcja zawiera dane do uzupełnienia.');
    if (!illustrationBytes || !brief.illustration_alt?.trim()) throw new Error('Produkcja wymaga ilustracji i jej opisu.');
    for (const character of selected) {
      if (character.status !== 'approved' || !character.approved_at || !character.approval_evidence || !character.approved_reference) throw new Error(`Postać ${character.id} nie została zaakceptowana.`);
      const bytes = await readFile(resolve(packageRoot, character.approved_reference));
      if (sha256(bytes) !== character.approved_sha256) throw new Error(`Zmieniono zatwierdzoną referencję ${character.id}.`);
    }
    const review = brief.visual_review;
    if (review?.status !== 'pass' || !review.notes?.trim() || !review.reviewer?.trim() || review.illustration_sha256 !== sha256(illustrationBytes)) throw new Error('Brak aktualnej oceny wizualnej tej ilustracji.');
  }
  return { selected, illustrationBytes, wordCount: words(content) };
}

const dataUrl = (bytes, mime) => `data:${mime};base64,${bytes.toString('base64')}`;

export async function compose(briefPath, outputDir) {
  const brief = JSON.parse(await readFile(briefPath, 'utf8'));
  const registry = JSON.parse(await readFile(resolve(packageRoot, 'references/characters.json'), 'utf8'));
  const { selected, illustrationBytes, wordCount } = await validateBrief(brief, dirname(resolve(briefPath)), registry);
  const [width, height] = formats[brief.format];
  const [regular, bold, logo] = await Promise.all([
    readFile(resolve(packageRoot, 'assets/fonts/LiberationSans-Regular.ttf')),
    readFile(resolve(packageRoot, 'assets/fonts/LiberationSans-Bold.ttf')),
    readFile(resolve(packageRoot, 'assets/brand/accessibility-first-logo-transparent.png'))
  ]);
  const css = await readFile(resolve(packageRoot, 'assets/layout.css'), 'utf8');
  const illustration = illustrationBytes
    ? `<img src="${dataUrl(illustrationBytes, extname(brief.illustration).toLowerCase() === '.webp' ? 'image/webp' : extname(brief.illustration).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg')}" alt="${escapeHtml(brief.illustration_alt)}">`
    : `<div class="scene-placeholder"><svg viewBox="0 0 240 150" aria-hidden="true"><rect x="22" y="14" width="196" height="112" rx="12"/><path d="M9 137h222M106 51l-22 22 22 22M134 51l22 22-22 22"/></svg><p class="scene-label">Miejsce na ilustrację</p><p>${escapeHtml(brief.scene)}</p></div>`;
  const detailHtml = brief.details?.length ? `<ul class="details">${brief.details.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul>` : '';
  const footer = `${brief.cta ? `<p class="cta">${escapeHtml(brief.cta)} <span aria-hidden="true">↗</span></p>` : ''}${brief.url ? `<a class="url" href="${escapeHtml(brief.url)}">${escapeHtml(brief.url.replace(/^https:\/\//, ''))}</a>` : ''}`;
  const styleClass = brief.style ?? 'standard';
  const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(brief.title)} — Accessibility First</title><style>@font-face{font-family:AF;src:url('${dataUrl(regular, 'font/ttf')}');font-weight:400;font-display:block}@font-face{font-family:AF;src:url('${dataUrl(bold, 'font/ttf')}');font-weight:700;font-display:block}${css}</style></head><body><article class="artboard ${brief.format} ${brief.template} ${styleClass}" style="--width:${width}px;--height:${height}px" aria-label="${brief.status === 'mockup' ? 'Makieta grafiki' : 'Grafika'}"><header><svg class="brand" role="img" aria-label="Accessibility First" viewBox="262 148 1279 96"><image href="${dataUrl(logo, 'image/png')}" width="1800" height="400"/></svg>${brief.status === 'mockup' ? '<p class="draft">Makieta · 0.1</p>' : ''}</header><div class="content"><section class="copy">${brief.eyebrow ? `<p class="eyebrow">${escapeHtml(brief.eyebrow)}</p>` : ''}<h1>${escapeHtml(brief.title)}</h1>${brief.body ? `<p class="body-copy">${escapeHtml(brief.body)}</p>` : ''}${detailHtml}</section><figure class="illustration">${illustration}</figure></div><footer>${footer}</footer></article></body></html>`;
  const publication = [brief.status === 'mockup' ? 'MAKIETA. Przykładowa treść do oceny układu, nie ogłoszenie wydarzenia.' : '', 'Accessibility First', brief.eyebrow, brief.title, brief.body, ...(brief.details ?? []), brief.cta, brief.url].filter(Boolean).join('\n');
  const alt = [brief.status === 'mockup' ? 'Makieta Accessibility First.' : 'Accessibility First.', brief.title, brief.body, ...(brief.details ?? []), brief.cta, brief.url, brief.illustration_alt].filter(Boolean).join(' ');
  const referenceFiles = selected.map(c => ({ id: c.id, file: c.approved_reference ?? c.identity_source, status: c.status }));
  if (registry.pair_reference && ['AF-M01', 'AF-F01'].every(id => selected.some(c => c.id === id))) referenceFiles.push({ id: registry.pair_reference.id, file: registry.pair_reference.file, status: registry.pair_reference.status });
  const references = await Promise.all(referenceFiles.map(async r => ({ ...r, sha256: sha256(await readFile(resolve(packageRoot, r.file))) })));
  const prompt = `Use case: illustration-story / identity-preserve.\nAsset: Accessibility First illustration without text or logos.\nScene: ${brief.scene}\nFormat of final composition: ${brief.format}; prepare an illustration suitable for a separate image area.\n${selected.map(c => `${c.id}: ${c.fixed_traits.join('; ')}. Wardrobe constraints: ${(c.wardrobe_constraints ?? []).join(' ')}. Relative height: ${(c.height_constraints ?? []).join(' ')}. Reference status: ${c.status}.`).join('\n')}\nStyle: mature editorial comic; clean dark outlines, warm controlled cel shading.\nPreserve all approved identity traits; change only clothing, pose and setting needed for this scene.\nNo text, logos, watermark, extra characters or decorative holograms. Keep important faces and hands inside frame.\n${selected.some(c => c.status !== 'approved') ? 'STOP: character candidates require approval before scene production. This is a planning prompt only.' : ''}\n`;
  await mkdir(outputDir, { recursive: true });
  for (const name of ['graphic.html', 'manifest.json']) {
    try { await access(resolve(outputDir, name)); } catch { continue; }
    throw new Error(`Wynik ${name} już istnieje; wybierz nowy katalog wersji.`);
  }
  await Promise.all([
    writeFile(resolve(outputDir, 'graphic.html'), html),
    writeFile(resolve(outputDir, 'brief.json'), JSON.stringify(brief, null, 2) + '\n'),
    writeFile(resolve(outputDir, 'publication.txt'), publication + '\n'),
    writeFile(resolve(outputDir, 'alt.txt'), alt + '\n'),
    writeFile(resolve(outputDir, 'illustration-prompt.txt'), prompt),
    writeFile(resolve(outputDir, 'manifest.json'), JSON.stringify({ id: brief.id, status: brief.status, width, height, wordCount, references, logo_sha256: sha256(logo), illustration_sha256: illustrationBytes ? sha256(illustrationBytes) : null, html_sha256: sha256(Buffer.from(html)), visual_review: brief.visual_review ?? null, generation: 'not-called-by-composer', layout_review: 'pending-render' }, null, 2) + '\n')
  ]);
  return { outputDir: resolve(outputDir), status: brief.status, width, height, wordCount };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    const brief = args[args.indexOf('--brief') + 1];
    const out = args[args.indexOf('--out') + 1];
    if (!args.includes('--brief') || !args.includes('--out') || !brief || !out) throw new Error('Użycie: compose.mjs --brief /ścieżka/brief.json --out /ścieżka/nowy-wynik');
    console.log(JSON.stringify(await compose(resolve(brief), resolve(out))));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
