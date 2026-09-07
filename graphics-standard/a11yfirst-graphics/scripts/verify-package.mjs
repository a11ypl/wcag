import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { packageRoot, sha256 } from './compose.mjs';

let errors = 0;
const manifest = JSON.parse(await readFile(resolve(packageRoot, 'references/source-manifest.json'), 'utf8'));
for (const source of manifest.sources) {
  try {
    const bytes = await readFile(resolve(packageRoot, source.file));
    if (sha256(bytes) !== source.sha256) throw new Error('zmieniona suma SHA-256');
  } catch (error) { console.error(source.file, error.message); errors++; }
}
const registry = JSON.parse(await readFile(resolve(packageRoot, 'references/characters.json'), 'utf8'));
if (registry.pair_reference) {
  try { await access(resolve(packageRoot, registry.pair_reference.file)); }
  catch { console.error('Brak wspólnej referencji wzrostu'); errors++; }
}
for (const character of registry.characters) {
  try {
    await access(resolve(packageRoot, character.identity_source));
    await access(resolve(packageRoot, character.candidate_sheet));
    if (character.status === 'approved') {
      if (!character.approved_at || !character.approval_evidence) throw new Error('brak zapisu zgody');
      if (sha256(await readFile(resolve(packageRoot, character.approved_reference))) !== character.approved_sha256) throw new Error('zmieniony wzorzec');
    }
  } catch (error) { console.error(character.id, error.message); errors++; }
}
for (const name of ['SKILL.md', 'agents/openai.yaml', 'references/standard.md', 'references/workflow.md', 'references/prompts.md', 'references/character-generation.json', 'assets/fonts/LICENSE_LIBERATION']) {
  try { await access(resolve(packageRoot, name)); } catch { console.error('Brak', name); errors++; }
}
console.log(JSON.stringify({ status: errors ? 'fail' : 'pass', sources: manifest.sources.length, characters: registry.characters.map(c => ({ id: c.id, status: c.status })), errors }));
process.exitCode = errors ? 1 : 0;
