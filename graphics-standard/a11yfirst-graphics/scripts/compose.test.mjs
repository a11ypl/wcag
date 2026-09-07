import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { validateBrief, compose, packageRoot, sha256 } from './compose.mjs';

const basic = { id: 'test', template: 'training', format: 'portrait', status: 'mockup', title: 'Sprawdzaj formularze', scene: 'Praca z formularzem', characters: [] };
const registry = JSON.parse(await readFile(resolve(packageRoot, 'references/characters.json'), 'utf8'));

test('Niezaakceptowana postać zatrzymuje produkcję', async () => {
  const brief = { ...basic, status: 'production', characters: ['AF-M01'], illustration: 'assets/sources/male-portrait.png', illustration_alt: 'Postać przy pracy.' };
  await assert.rejects(validateBrief(brief, packageRoot, registry), /nie została zaakceptowana/);
});
test('Ocena innego pliku nie przepuszcza ilustracji do produkcji', async () => {
  const brief = { ...basic, status: 'production', illustration: 'assets/sources/male-portrait.png', illustration_alt: 'Postać.', visual_review: { status: 'pass', illustration_sha256: 'stary-hash', reviewer: 'tester', notes: 'Sprawdzono.' } };
  await assert.rejects(validateBrief(brief, packageRoot, registry), /Brak aktualnej oceny/);
});
test('Zmiana zatwierdzonej referencji zatrzymuje produkcję', async () => {
  const changed = structuredClone(registry);
  Object.assign(changed.characters[0], { status: 'approved', approved_at: 'test-only', approval_evidence: 'test fixture, not real approval', approved_reference: 'assets/sources/male-portrait.png', approved_sha256: 'stary-hash' });
  await assert.rejects(validateBrief({ ...basic, status: 'production', characters: ['AF-M01'], illustration: 'assets/sources/male-portrait.png', illustration_alt: 'Postać.' }, packageRoot, changed), /Zmieniono zatwierdzoną referencję/);
});
test('Brakujące dane, zbyt długi nagłówek i niewłaściwy URL są odrzucane', async () => {
  for (const patch of [{ status: 'production', title: '[do uzupełnienia]' }, { title: 'jeden dwa trzy cztery pięć sześć siedem osiem dziewięć' }, { url: 'javascript:alert(1)' }, { format: 'unknown' }, { characters: ['AF-M99'] }]) {
    await assert.rejects(validateBrief({ ...basic, ...patch }, packageRoot, registry));
  }
});
test('Tekst użytkownika pozostaje tekstem HTML, a istniejący wynik nie jest nadpisywany', async () => {
  const dir = await mkdtemp(resolve(tmpdir(), 'af-graphics-test-'));
  const input = resolve(dir, 'brief.json');
  await writeFile(input, JSON.stringify({ ...basic, title: '<script>alert(1)</script>' }));
  const out = resolve(dir, 'out');
  await compose(input, out);
  const html = await readFile(resolve(out, 'graphic.html'), 'utf8');
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(!html.includes('<script>'));
  await assert.rejects(compose(input, out), /już istnieje/);
});
test('Aktualna ocena pliku jest akceptowana, brak kontroli nie jest dopisywany', async () => {
  const bytes = await readFile(resolve(packageRoot, 'assets/sources/male-portrait.png'));
  const result = await validateBrief({ ...basic, status: 'production', illustration: 'assets/sources/male-portrait.png', illustration_alt: 'Portret.', visual_review: { status: 'pass', illustration_sha256: sha256(bytes), reviewer: 'test fixture', notes: 'Synthetic validation test, not a real image approval.' } }, packageRoot, registry);
  assert.equal(result.selected.length, 0);
  assert.equal(result.illustrationBytes.length, bytes.length);
});
