# Grafiki webinarów Accessibility First — wrzesień 2026

Pakiet zawiera trzy kreacje w czterech formatach:

- \`webinary-zbiorczo\` — wspólna zapowiedź obu webinarów, Damian i Ola;
- \`webinar-17-wtyczki\` — „Narzędzia do badania dostępności”, 17 września 2026, Damian Żłobicki i Ola Migus;
- \`webinar-24-html\` — „Semantyczny HTML, nie taki straszny”, 24 września 2026, Damian Żłobicki.

Formaty:

- \`square\` — 1080 × 1080;
- \`portrait\` — 1080 × 1350;
- \`story\` — 1080 × 1920;
- \`landscape\` — 1920 × 1080.

Każdy katalog \`outputs/*\` zawiera edytowalny \`graphic.html\`, eksport \`graphic.png\`, brief, tekst publikacji, alt, prompt ilustracji, manifest i raport układu.

## Status

To są makiety do oceny, nie materiały produkcyjne. Nowe ilustracje nie mogły zostać wygenerowane, ponieważ limit generatora obrazów został osiągnięty. Wykorzystano istniejące karty referencyjne postaci i planszę skali. Po przywróceniu limitu można podmienić pliki ilustracji w briefach i ponownie uruchomić skład oraz render.

Karty postaci mają obecnie status \`candidate\`, dlatego pakiet nie jest oznaczony jako produkcyjny i nie został opublikowany. Tekst, daty, prowadzący, alt oraz układ są gotowe do przeglądu.

## Ponowne złożenie

\`\`\`sh
node graphics-standard/a11yfirst-graphics/scripts/compose.mjs \
  --brief graphics-standard/campaigns/webinary-wrzesien-2026/briefs/webinar-17-wtyczki-portrait.json \
  --out /tmp/a11yfirst-webinar-preview

NODE_PATH=/Users/bergi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
  node graphics-standard/a11yfirst-graphics/scripts/render.mjs /tmp/a11yfirst-webinar-preview
\`\`\`
