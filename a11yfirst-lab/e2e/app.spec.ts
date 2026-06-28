import { expect, test } from '@playwright/test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

test('podstawowy flow klawiaturą i brak naruszeń axe na starcie', async ({ page }) => {
  await page.goto('/');
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });

  const axeResults = await page.evaluate(async () => {
    const axe = (window as unknown as { axe: typeof import('axe-core') }).axe;
    return await axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21aa']
      }
    });
  });
  expect(axeResults.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);

  await page.keyboard.press('Tab');
  await expect(page.getByText('Przejdź do treści głównej')).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');

  await page.getByRole('button', { name: 'Rozpocznij' }).press('Enter');
  await page.getByLabel(/Błąd, bo przycisk nie ma dostępnej nazwy/i).check();
  await page.getByRole('button', { name: 'Sprawdź odpowiedź' }).press('Enter');

  await expect(page.locator('.feedback-panel')).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Dobrze' })).toBeVisible();
  await expect(page.getByText(/Kontrolka interaktywna musi mieć nazwę/i)).toBeVisible();
});

test('modal resetu nie tworzy pułapki klawiaturowej', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Postęp', exact: true }).click();
  await page.getByRole('button', { name: 'Wyczyść postęp' }).click();

  await expect(page.getByRole('heading', { name: 'Usuń postęp' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Anuluj' })).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Usuń postęp' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Anuluj' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: 'Usuń postęp' })).toBeHidden();
});

test('przełącznik wysokiego kontrastu działa Enterem i spacją', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ustawienia', exact: true }).click();
  const toggle = page.getByRole('button', { name: /Tryb wysokiego kontrastu Wyłączone/i });

  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');

  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
});
