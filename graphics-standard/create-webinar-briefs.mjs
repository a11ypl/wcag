import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname);
const out = join(root, 'campaigns/webinary-wrzesien-2026');
const ref = '../../../a11yfirst-graphics/assets/characters';
const common = {
  eyebrow: 'Webinary Accessibility First',
  cta: 'Zobacz szczegóły i zapisz się',
  url: 'https://www.a11yfirst.pl/webinary',
};
const items = [
  {
    id: 'webinary-zbiorczo',
    title: 'Dwa webinary we wrześniu',
    body: 'Praktyka, dostępność i web development',
    details: ['17 września · wtyczki · 17:00', '24 września · semantyczny HTML · 17:00'],
    scene: 'Damian i Ola wspólnie sprawdzają formularz internetowy przy laptopie.',
    characters: ['AF-M01', 'AF-F01'],
    illustration: ref + '/af-pair-height-candidate-v02.png',
    illustration_alt: 'Damian i Ola stoją obok siebie przy laptopie i wspólnie sprawdzają formularz internetowy.',
  },
  {
    id: 'webinar-17-wtyczki',
    title: 'Narzędzia do badania dostępności',
    body: 'Nieoczywiste wtyczki i praktyczne zastosowania',
    details: ['17 września 2026 · godz. 17:00', 'Prowadzą: Damian Żłobicki i Ola Migus'],
    scene: 'Damian i Ola analizują strukturę strony oraz formularz na laptopie.',
    characters: ['AF-M01', 'AF-F01'],
    illustration: ref + '/af-pair-height-candidate-v02.png',
    illustration_alt: 'Damian i Ola analizują formularz internetowy i narzędzia wspierające badanie dostępności.',
  },
  {
    id: 'webinar-24-html',
    title: 'Semantyczny HTML, nie taki straszny',
    body: 'Właściwe elementy HTML jako fundament dostępności',
    details: ['24 września 2026 · godz. 17:00', 'Prowadzi: Damian Żłobicki'],
    scene: 'Damian pokazuje na laptopie różnicę między właściwym elementem HTML a przypadkowym kontenerem.',
    characters: ['AF-M01'],
    illustration: ref + '/af-m01-candidate-v03.png',
    illustration_alt: 'Damian pokazuje na laptopie przykłady semantycznego HTML.',
  },
];
const formats = ['square', 'portrait', 'story', 'landscape'];
for (const item of items) {
  for (const format of formats) {
    const brief = {
      id: item.id + '-' + format,
      template: item.id === 'webinary-zbiorczo' ? 'overview' : 'webinar',
      format,
      status: 'mockup',
      ...common,
      title: item.title,
      body: item.body,
      details: item.details,
      scene: item.scene,
      characters: item.characters,
      illustration: item.illustration,
      illustration_alt: item.illustration_alt,
    };
    const dir = join(out, 'briefs');
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, brief.id + '.json'), JSON.stringify(brief, null, 2) + '\n');
  }
}
console.log('Utworzono ' + items.length * formats.length + ' briefów makiet.');
