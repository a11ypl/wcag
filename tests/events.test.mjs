import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { loadEvents, zonedDate, validateEvent } from '../cms/lib/events.mjs';
import { loadJobs, scheduleState, utm, validateJob, redact, productionBlocks } from '../scripts/publisher/core.mjs';
import { Ledger } from '../scripts/publisher/ledger.mjs';
import { createMimeMessage } from '../scripts/newsletter/provider.mjs';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

const root = resolve(import.meta.dirname, '..');
test('loads the two webinar records with Warsaw timezone', () => {
  const events = loadEvents(root);
  assert.equal(events.length, 2);
  assert.ok(events.every(event => event.timezone === 'Europe/Warsaw'));
});
test('rejects incomplete event records', () => assert.ok(validateEvent({ status: 'draft' }).length > 0));
test('serializes a valid Warsaw wall time and rejects invalid calendar values', () => {
  assert.match(zonedDate('2026-09-17', '17:00', 'Europe/Warsaw').iso, /^2026-09-17T17:00:00[+-]02:00$/);
  assert.throws(() => zonedDate('2026-02-30', '17:00', 'Europe/Warsaw'));
});
test('generates channel-specific UTM and never turns an empty link into a URL', () => {
  assert.equal(utm(null, 'linkedin', 'webinary_wrzesien_2026'), null);
  assert.match(utm('https://example.com/register', 'linkedin', 'webinary_wrzesien_2026'), /utm_source=linkedin/);
});
test('detects invalid schedule and missed publication window', () => {
  assert.equal(scheduleState('nope', Date.now()), 'invalid');
  assert.equal(scheduleState('2020-09-17T17:00:00+02:00', Date.now(), 90), 'missed');
});
test('registration links and approved artwork are ready while unscheduled jobs remain blocked', () => {
  const jobs = loadJobs(root, 'social');
  const result = validateJob(jobs[0], { recipientCount: null, recipientLimit: null });
  assert.ok(!result.errors.includes('status.not-approved'));
  assert.ok(!result.errors.includes('registrationUrl.required'));
  assert.ok(loadEvents(root).every(event => event.registrationStatus === 'open'));
  assert.equal(loadEvents(root).find(event => event.slug === 'semantyczny-html-nie-taki-straszny').registrationUrl, 'https://forms.gle/rjvFigaSQvUqb4Uy9');
  assert.equal(loadEvents(root).find(event => event.slug === 'nieoczywiste-wtyczki-do-badania-dostepnosci-cyfrowej').registrationUrl, 'https://forms.gle/BeNkgVS6WWdYA3iK7');
});
test('Instagram has a public image while production stays fail-closed', () => {
  const job = loadJobs(root, 'social').find(item => item.channel === 'instagram');
  const result = validateJob(job, { recipientCount: null, recipientLimit: null });
  assert.ok(!result.errors.includes('instagram.image.required'));
  assert.match(job.image.url, /^https:\/\/www\.a11yfirst\.pl\/assets\/webinary\//);
  assert.ok(productionBlocks('newsletter').includes('phase1.live-transport-disabled'));
});
test('newsletter MIME uses Bcc and the Gmail API safe recipient limit', () => {
  const raw = createMimeMessage({ from: 'sender@example.com', recipients: ['one@example.com'], subject: 'Temat', body: 'Treść' });
  assert.match(Buffer.from(raw, 'base64url').toString(), /Bcc: one@example.com/);
  assert.throws(() => createMimeMessage({ from: 'sender@example.com\r\nBcc: leak@example.com', recipients: ['one@example.com'], subject: 'Temat', body: 'Treść' }));
});
test('ledger is idempotent and redacts email addresses', () => {
  const directory = mkdtempSync(`${tmpdir()}/a11yfirst-ledger-`);
  try {
    const ledger = new Ledger(directory);
    assert.equal(ledger.claim('example-post'), true);
    assert.equal(ledger.claim('example-post'), false);
    ledger.finish('example-post', 'published', 'urn:example:1');
    assert.equal(ledger.get('example-post').status, 'published');
    assert.match(redact('To: person@example.com Bearer secret'), /redacted/);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
