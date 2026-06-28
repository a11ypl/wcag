import { describe, expect, it, beforeEach } from 'vitest';
import { axe } from 'jest-axe';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../app/App';
import { PROGRESS_KEY } from '../progress/progressStore';

describe('A11yFirst Lab', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renderuje ekran startowy bez krytycznych naruszeń axe', async () => {
    const { container } = render(<App />);

    expect(screen.getByRole('heading', { name: 'A11yFirst Lab' })).toBeInTheDocument();
    await expect(axe(container)).resolves.toHaveNoViolations();
  });

  it('pozwala wybrać odpowiedź i pokazuje indywidualny feedback', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Rozpocznij' }));
    await user.click(screen.getByLabelText(/Błąd, bo przycisk nie ma dostępnej nazwy/i));
    await user.click(screen.getByRole('button', { name: 'Sprawdź odpowiedź' }));

    expect(await screen.findByRole('heading', { name: 'Dobrze' })).toBeInTheDocument();
    expect(screen.getByText(/Kontrolka interaktywna musi mieć nazwę/i)).toBeInTheDocument();
    expect(window.localStorage.getItem(PROGRESS_KEY)).toContain('wcag-name-role-001');
  });

  it('umożliwia kontynuowanie od ostatniego miejsca po odświeżeniu stanu', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole('button', { name: 'Rozpocznij' }));
    await user.click(screen.getByLabelText(/Błąd, bo przycisk nie ma dostępnej nazwy/i));
    await user.click(screen.getByRole('button', { name: 'Sprawdź odpowiedź' }));
    unmount();

    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Kontynuuj od ostatniego miejsca' }));
    expect(screen.getByRole('heading', { name: 'Detektyw WCAG' })).toBeInTheDocument();
    expect(screen.getByText(/przycisk graficzny z ikoną lupy/i)).toBeInTheDocument();
  });

  it('obsługuje powtórkę błędnych odpowiedzi', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Rozpocznij' }));
    await user.click(screen.getByLabelText(/Poprawne, bo obraz dekoracyjny ma pusty alt/i));
    await user.click(screen.getByRole('button', { name: 'Sprawdź odpowiedź' }));
    await user.click(screen.getByRole('button', { name: 'Zakończ sesję' }));
    await user.click(screen.getByRole('button', { name: 'Powtórz błędne odpowiedzi' }));

    expect(screen.getByText('Powtórka błędnych odpowiedzi')).toBeInTheDocument();
  });

  it('otwiera modal resetu i oddaje fokus po anulowaniu', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Postęp' }));
    const resetButton = screen.getByRole('button', { name: 'Wyczyść postęp' });
    await user.click(resetButton);

    expect(screen.getByRole('heading', { name: 'Usuń postęp' })).toBeInTheDocument();
    await user.keyboard('{Escape}');

    await waitFor(() => expect(resetButton).toHaveFocus());
  });

  it('ustawienia dostępności są przyciskami obsługiwanymi Enterem i spacją', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Ustawienia' }));
    const contrastToggle = screen.getByRole('button', { name: /Tryb wysokiego kontrastu Wyłączone/i });

    contrastToggle.focus();
    await user.keyboard('{Enter}');
    expect(contrastToggle).toHaveAttribute('aria-pressed', 'true');

    await user.keyboard(' ');
    expect(contrastToggle).toHaveAttribute('aria-pressed', 'false');
  });
});
