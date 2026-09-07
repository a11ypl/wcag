import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname);
const campaign = join(root, 'campaigns/webinary-wrzesien-2026/style-v5-final');
const ref = '../../../../a11yfirst-graphics/assets/sources';
const common = {
  style: 'immersive',
  eyebrow: 'Webinary o dostępności',
  cta: 'Zapisz się na webinar',
  url: 'https://www.a11yfirst.pl/webinary',
};
const items = [
  {
    id: 'webinary-zbiorczo',
    title: 'Dwa webinary we wrześniu',
    body: 'Praktyka dostępności cyfrowej dla osób, które tworzą i sprawdzają strony.',
    details: ['17 września · narzędzia do badania dostępności · 17:00', '24 września · semantyczny HTML · 17:00'],
    scene: 'Damian i Ola wspólnie analizują dostępność strony w nowoczesnym biurze.',
    characters: ['AF-M01', 'AF-F01'],
    illustration: ref + '/recent-offer-landscape.png',
    illustration_alt: 'Ilustracja w stylu komiksowym: Damian siedzi przy monitorze, a Ola wskazuje element na ekranie w biurze.',
  },
  {
    id: 'webinar-17-wtyczki',
    title: 'Narzędzia do badania dostępności',
    body: 'Nieoczywiste wtyczki i praktyczne zastosowania.',
    details: ['17 września 2026 · godz. 17:00', 'Prowadzą: Damian Żłobicki i Ola Migus'],
    scene: 'Damian i Ola sprawdzają formularz oraz strukturę strony na dużym monitorze.',
    characters: ['AF-M01', 'AF-F01'],
    illustration: ref + '/recent-offer-landscape.png',
    illustration_alt: 'Ilustracja w stylu komiksowym: Damian pracuje przy monitorze, a Ola pokazuje mu element interfejsu.',
  },
  {
    id: 'webinar-24-html',
    title: 'Semantyczny HTML, nie taki straszny',
    body: 'Właściwe elementy HTML jako fundament dostępności.',
    details: ['24 września 2026 · godz. 17:00', 'Prowadzi: Damian Żłobicki'],
    scene: 'Damian omawia strukturę HTML na tle interfejsów i fragmentów kodu.',
    characters: ['AF-M01'],
    illustration: ref + '/archive-male-full-body.jpeg',
    illustration_alt: 'Ilustracja w stylu komiksowym: Damian stoi na tle kolorowych interfejsów i fragmentów kodu.',
  },
];
const formats = ['square', 'portrait', 'story', 'landscape'];
for (const item of items) {
  for (const format of formats) {
    const brief = {
      id: item.id + '-' + format + '-immersive',
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
    const dir = join(campaign, 'briefs');
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, brief.id + '.json'), JSON.stringify(brief, null, 2) + '\n');
  }
}
await mkdir(campaign, { recursive: true });
await writeFile(join(campaign, 'README.md'), `# Webinary wrzesień 2026 — styl immersive\n\nTo jest drugi wariant makiet, przygotowany na podstawie załączonej referencji: pełnoformatowa scena, duża typografia w bieli i żółci, ciemne gradienty oraz fioletowy pasek CTA.\n\nPakiet zawiera trzy kreacje w czterech formatach: zbiorczą, webinar z 17 września oraz webinar z 24 września.\n\nStatus: makiety do oceny. Ilustracje pochodzą z archiwalnych referencji sceny i służą tu wyłącznie do sprawdzenia kierunku artystycznego. Tekst pozostaje warstwą HTML, a nie elementem obrazu. Przed publikacją należy podmienić sceny na zatwierdzone ilustracje z właściwymi postaciami i wykonać ponowną ocenę wizualną.\n`);
console.log('Utworzono ' + items.length * formats.length + ' briefów stylu immersive.');
