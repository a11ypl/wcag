# Tutorial checklist

Checklista jakości pojedynczego tutoriala `WCAG prostym językiem`.

## Struktura

- [ ] Strona ma jeden `h1` z numerem i tytułem kryterium.
- [ ] Jest sekcja `Krótko`.
- [ ] Jest sekcja `Problem w praktyce`.
- [ ] Jest sekcja `Kogo to dotyczy`.
- [ ] Jest sekcja `Dobry przykład`.
- [ ] Jest sekcja `Zły przykład`.
- [ ] Jest sekcja `Przykłady kodu`, jeśli kryterium dotyczy HTML, CSS, ARIA albo JavaScript.
- [ ] Jest sekcja `Przykład graficzny` albo demo edukacyjne, jeśli pomaga zrozumieć kryterium.
- [ ] Jest sekcja `Jak sprawdzić`.
- [ ] Jest sekcja `Co sprawdzi automat, a czego nie`.
- [ ] Jest sekcja `Typowe błędy`.
- [ ] Jest sekcja `Powiązane kryteria`.
- [ ] Jest sekcja `Źródła`.

## Treść

- [ ] Treść nie rozszerza kryterium o wymagania z innych kryteriów.
- [ ] Granice kryterium są opisane, jeśli łatwo je pomylić z innymi.
- [ ] Przykłady są konkretne i zrozumiałe.
- [ ] Zły przykład nie jest przedstawiony jako działający niedostępny komponent.
- [ ] Powiązane kryteria są linkami do istniejących podstron.
- [ ] Sekcja `Źródła` zawiera tylko źródła merytoryczne.
- [ ] Brak roboczych notatek, komentarzy licencyjnych i informacji organizacyjnych w publicznym tutorialu.

## Kod i demo

- [ ] Każdy blok kodu jest w `pre` / `code`.
- [ ] Każdy blok kodu ma etykietę języka, np. `Kod — HTML`.
- [ ] Każdy `code` ma właściwą klasę, np. `language-html`.
- [ ] HTML w przykładach jest escapowany.
- [ ] Demo statyczne nie ma JavaScriptu, `tabindex`, `role` ani ARIA bez potrzeby.
- [ ] Demo statyczne formularza nie używa prawdziwych pól formularza.
- [ ] Style demo są scoped do klasy demo.

## Kontrola końcowa

- [ ] Nie ma martwych linków lokalnych.
- [ ] Linki w treści są fioletowe, pogrubione i podkreślone.
- [ ] Metadane hero są czytelne.
- [ ] `git diff --check` przechodzi.
- [ ] Status został zaktualizowany.
- [ ] Source QA został zaktualizowany, jeśli dodano źródła, techniki albo failures.
