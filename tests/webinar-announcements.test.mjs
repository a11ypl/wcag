import test from 'node:test';
import assert from 'node:assert/strict';
import { renderHomeWebinars, renderEventCards } from '../cms/lib/render-event.mjs';
import { interpolate } from '../scripts/publisher/core.mjs';
const event = { slug:'example', title:'Webinar testowy', date:'2026-09-17', startTime:'17:00', timezone:'Europe/Warsaw', status:'approved', registrationStatus:'open', registrationUrl:'https://example.com/register', speaker:'Osoba <testowa>', shortDescription:'Opis', image:{url:'https://example.com/image.png',alt:'Opis grafiki'} };
const now=Date.parse('2026-09-07T10:00:00+02:00');
test('home waits for approved artwork, speaker and an upcoming open event', () => {
  for(const update of [{status:'draft'},{speaker:null},{image:{url:null,alt:null}},{image:{url:event.image.url,alt:null}},{registrationStatus:'closed'},{date:'2026-09-01'}]) assert.equal(renderHomeWebinars([{...event,...update}],now),'');
  assert.match(renderHomeWebinars([event],now),/Najbliższe webinary/);
});
test('cards expose emphasized date, escaped speaker, described image and direct registration link', () => {
  const html=renderEventCards([event],now);
  assert.match(html,/<strong><time datetime="2026-09-17T17:00:00\+02:00">/);
  assert.match(html,/<strong>Prowadzenie: Osoba &lt;testowa&gt;<\/strong>/);
  assert.match(html,/datetime="2026-09-17T17:00:00\+02:00"/);
  assert.match(html,/alt="Opis grafiki"/);
  assert.match(html,/href="https:\/\/example.com\/register">Zapisz się na webinar/);
});
test('social templates support confirmed speakers and retain missing placeholders', () => {
  assert.equal(interpolate('Prowadzi: {{speaker}}',[event],'facebook','test'),'Prowadzi: Osoba <testowa>');
  assert.equal(interpolate('{{speaker}}',[{...event,speaker:null}],'facebook','test'),'{{speaker}}');
});
