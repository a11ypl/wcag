# Specyfikacja UX i dostępności - A11yFirst Lab

## 1. Standard własny produktu

Aplikacja ma spełniać **WCAG 2.2 AA** jako standard projektowy. W kontekście polskich wymagań prawnych należy zachować co najmniej zgodność z **WCAG 2.1 AA** dla funkcji objętych ustawą o dostępności cyfrowej.

## 2. Zasada główna

Nie wolno budować gry o dostępności, która sama jest niedostępna. Każda funkcja w MVP musi być możliwa do użycia:

- bez myszy,
- z czytnikiem ekranu,
- przy powiększeniu,
- przy wysokim kontraście / forced colors,
- przy ograniczeniu animacji,
- na urządzeniu mobilnym.

## 3. Struktura strony

Każdy widok powinien mieć:

```html
<header>
  <a href="#main" class="skip-link">Przejdź do treści głównej</a>
  <nav aria-label="Główna nawigacja">
    ...
  </nav>
</header>

<main id="main">
  <h1>A11yFirst Lab</h1>
  ...
</main>

<footer>
  ...
</footer>
```

Wymagania:

- jeden widoczny `h1` na widok,
- logiczna hierarchia nagłówków,
- brak przeskoków używanych wyłącznie dla wyglądu,
- listy jako `ul`/`ol`, nie jako ciągi `div`,
- kontrolki jako natywne `button`, `input`, `fieldset`, `legend`.

## 4. Ekran pytania

Pytanie ABCD powinno być formularzem radiowym:

```html
<form aria-describedby="question-help">
  <fieldset>
    <legend>Na stronie znajduje się przycisk graficzny...</legend>

    <p id="question-help">Wybierz jedną odpowiedź.</p>

    <div>
      <input type="radio" id="q1-a" name="q1" value="a">
      <label for="q1-a">Poprawne, bo obraz dekoracyjny ma pusty alt</label>
    </div>

    ...
  </fieldset>

  <button type="submit">Sprawdź odpowiedź</button>
</form>
```

Dlaczego tak:

- czytnik ekranu rozumie grupę odpowiedzi,
- użytkownik wie, że wybiera jedną odpowiedź,
- klawiatura działa natywnie,
- nie trzeba udawać radiobuttonów ARIA.

## 5. Feedback po odpowiedzi

Panel feedbacku powinien mieć nagłówek i region dostępny dla technologii wspomagających.

Rekomendowany wariant:

```html
<section id="feedback" tabindex="-1" aria-labelledby="feedback-heading">
  <h2 id="feedback-heading">Odpowiedź niepoprawna</h2>
  <p>Wybrana odpowiedź: A...</p>
  <p>Dlaczego to nie jest poprawne...</p>
</section>
```

Po zatwierdzeniu odpowiedzi:

- pokaż panel feedbacku,
- przenieś fokus na nagłówek albo kontener feedbacku z `tabindex="-1"`,
- nie rób automatycznego przejścia do następnego pytania,
- daj wyraźny przycisk „Następne pytanie”.

Alternatywa: `aria-live="polite"`, ale przy długim feedbacku lepsze jest przeniesienie fokusu do panelu, bo użytkownik ma kontrolę nad czytaniem treści.

## 6. Kolor i status

Nie używaj samego koloru do komunikowania wyniku.

Dobre:

- „Dobrze” + tekst + ikona z tekstem alternatywnym ukrytym wizualnie,
- „Niepoprawnie” + tekst,
- ramka i kolor jako wsparcie, nie jedyny nośnik.

Złe:

- zielony = dobrze, czerwony = źle, bez tekstu.

## 7. Fokus

Wymagania:

- fokus zawsze widoczny,
- kontrast wskaźnika fokusu minimum 3:1 względem tła i komponentu,
- fokus nie może być zasłonięty przez sticky header albo panel,
- kolejność fokusu ma odpowiadać kolejności zadania,
- po zakończeniu odpowiedzi fokus trafia do feedbacku,
- przy powrocie z feedbacku użytkownik trafia logicznie do przycisku „Następne pytanie” albo listy odpowiedzi.

Przykład CSS:

```css
:focus-visible {
  outline: 3px solid currentColor;
  outline-offset: 3px;
}
```

W trybie wysokiego kontrastu nie opieraj fokusu wyłącznie na `box-shadow`.

## 8. Klawiatura

Minimalny scenariusz klawiatury:

1. Tab do skiplinka.
2. Enter - przejście do treści głównej.
3. Tab do wyboru trybu gry.
4. Enter - uruchomienie trybu.
5. Tab do grupy odpowiedzi.
6. Strzałki / Tab - wybór odpowiedzi radiowej.
7. Tab do przycisku „Sprawdź odpowiedź”.
8. Enter - sprawdzenie.
9. Fokus trafia do feedbacku.
10. Tab do „Następne pytanie”.

Nie implementuj niestandardowych skrótów klawiaturowych w MVP.

## 9. Modal potwierdzenia resetu

Jeżeli używasz modala:

- preferuj natywny `<dialog>` z obsługą fallbacków albo dobrze przetestowany własny komponent,
- po otwarciu fokus trafia do nagłówka albo pierwszego sensownego przycisku,
- Tab i Shift+Tab nie wychodzą poza modal,
- Escape zamyka modal,
- po zamknięciu fokus wraca do przycisku, który otworzył modal,
- treść pod modalem jest niedostępna dla interakcji.

## 10. Animacje

Animacje nie są konieczne w MVP. Jeżeli zostaną dodane:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 11. Powiększenie i reflow

Aplikacja musi działać przy:

- zoom 200%,
- zoom 400%,
- szerokość 320 CSS px,
- orientacja pionowa i pozioma.

Zakazane:

- poziome przewijanie całej strony przy 320 CSS px,
- przyciski uciekające poza widok,
- treść schowana pod sticky nagłówkiem,
- fixed-height karty z uciętym tekstem.

## 12. Formularze i ustawienia

Każde pole musi mieć widoczną etykietę. Placeholder nie jest etykietą.

Przykład:

```html
<label for="import-progress">Importuj plik postępu</label>
<input id="import-progress" type="file" accept="application/json">
```

## 13. Błędy importu postępu

Komunikaty błędów muszą być konkretne:

- „Nie udało się wczytać pliku. Plik nie jest poprawnym JSON.”
- „Nie udało się wczytać postępu. Brakuje pola userProgressVersion.”
- „Ten plik pochodzi z nowszej wersji aplikacji.”

Nie używaj ogólnego „Błąd”.

## 14. Kryteria WCAG szczególnie istotne dla aplikacji

- 1.3.1 Informacje i relacje,
- 1.4.1 Użycie koloru,
- 1.4.3 Kontrast minimum,
- 1.4.4 Zmiana rozmiaru tekstu,
- 1.4.10 Dopasowanie do ekranu,
- 1.4.11 Kontrast elementów nietekstowych,
- 2.1.1 Klawiatura,
- 2.1.2 Brak pułapki na klawiaturę,
- 2.4.1 Możliwość pominięcia bloków,
- 2.4.3 Kolejność fokusu,
- 2.4.6 Nagłówki i etykiety,
- 2.4.7 Widoczny fokus,
- 2.4.11 Fokus niezasłonięty minimum,
- 2.5.3 Etykieta w nazwie,
- 2.5.8 Rozmiar celu minimum,
- 3.2.1 Po otrzymaniu fokusu,
- 3.2.2 Podczas wprowadzania danych,
- 3.3.1 Identyfikacja błędu,
- 3.3.2 Etykiety lub instrukcje,
- 4.1.2 Nazwa, rola, wartość,
- 4.1.3 Komunikaty o stanie.
