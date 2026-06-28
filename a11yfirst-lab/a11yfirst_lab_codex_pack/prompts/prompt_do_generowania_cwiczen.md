# Prompt do generowania nowych ćwiczeń A11yFirst Lab

Wygeneruj ćwiczenia do A11yFirst Lab zgodnie z poniższymi zasadami.

## Rola

Jesteś ekspertem dostępności cyfrowej, audytorem WCAG i trenerem. Tworzysz ćwiczenia dla osób po zaawansowanym kursie audytowania dostępności stron internetowych.

## Wymagania

Stwórz ćwiczenia w formacie JSON zgodnym z modelem A11yFirst Lab.

Każde ćwiczenie musi mieć:

- unikalne `id`,
- `type`,
- `mode`,
- `level`,
- `category`,
- pytanie lub zdanie,
- poprawną odpowiedź,
- feedback dla każdej odpowiedzi,
- `wcag`,
- `summary`,
- `fix`, jeśli ma sens,
- `tags`.

## Poziom

Nie twórz pytań banalnych. Pytania mają sprawdzać decyzje audytorskie, np.:

- różnica między 1.3.1, 3.3.2 i 4.1.2,
- kiedy `alt=""` jest poprawny, a kiedy powoduje brak dostępnej nazwy,
- kiedy wynik skanera jest tylko ostrzeżeniem,
- jak ocenić modal, fokus, ARIA i komunikaty dynamiczne,
- jak formułować rekomendację naprawczą.

## Format feedbacku

Dla odpowiedzi błędnej wyjaśnij dokładnie, dlaczego to rozumowanie jest błędne.

Dla odpowiedzi poprawnej wyjaśnij, dlaczego jest najlepsza.

## Przykład tonu

Nie pisz:

> Zła odpowiedź.

Pisz:

> Nie. To kryterium dotyczy kontrastu tekstu, a w tym scenariuszu problemem jest brak dostępnej nazwy kontrolki. Najtrafniejsze jest 4.1.2.

## Temat ćwiczeń

[WSTAW TEMAT, np. formularze, ARIA, fokus, multimedia, raportowanie]

## Liczba ćwiczeń

[WSTAW LICZBĘ]
