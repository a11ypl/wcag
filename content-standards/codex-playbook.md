# Codex playbook: WCAG prostym językiem

Stałe zasady pracy przy tutorialach w sekcji `WCAG prostym językiem`.

## Zasada podstawowa

- Pracuj krótkimi taskami: jedno kryterium albo jeden checkpoint na raz.
- Przed edycją przeczytaj aktualny tutorial, `wcag-prostym-jezykiem-style-guide.md`, `wcag-prostym-jezykiem-status.md` i `wcag-prostym-jezykiem-source-qa.md`.
- Nie zmieniaj listy kryteriów, routingu, headera, footera, canonicali ani globalnej architektury strony, jeśli zadanie tego nie wymaga.
- Nie zmieniaj publicznych HTML ani CSS poza zakresem taska.
- Jeśli `public/` jest ignorowany przez git, dodawaj zmieniane pliki publiczne jawnie przez `git add -f`.
- Nie commituj `.vercel/`, `Czytniki ekranu/`, `cms/`, `ola.jfif` ani innych plików spoza zakresu.

## Priorytet roadmapy

- Najpierw rozbudowujemy kryteria poziomu `A` i `AA`.
- Kryteria poziomu `AAA` odkładamy na później i wykonujemy tylko po wyraźnej decyzji.
- Jeśli task dotyczy kryterium `AAA`, przed rozpoczęciem upewnij się, że użytkownik świadomie wybrał ten poziom.
- Nie planuj kolejnych tasków `AAA`, dopóki lista istotnych kryteriów `A` i `AA` nie jest gotowa do przeglądu.

## Standard tutoriala

- Każdy rozbudowany tutorial ma być praktycznym, polskim opracowaniem kryterium WCAG.
- Zachowaj granice kryterium. Powiązane kryteria można wskazać, ale nie opisuj ich wymagań jako wymagań aktualnego kryterium.
- Używaj prostego języka, krótkich zdań, konkretnych przykładów i procedury sprawdzania.
- Unikaj żargonu; jeśli termin jest potrzebny, wyjaśnij go.
- Jeśli nie masz pewności, sprawdź źródło albo zapisz krótkie TODO w pliku roboczym zamiast wymyślać treść publiczną.
- Każdy tutorial ma mieć jeden `h1`.
- Sekcje prowadź w kolejności z `tutorial-checklist.md`.
- Linki w treści tutoriala mają zostać fioletowe, pogrubione i podkreślone.
- Metadane hero mają pozostać czytelne.

## Przykłady kodu i demo

- Przykłady kodu umieszczaj w `.wcag-code-example`.
- Każdy blok kodu ma widoczną etykietę języka, np. `Kod — HTML`, `Kod — CSS`, `Kod — JavaScript`.
- Element `code` ma mieć klasę języka, np. `language-html`.
- HTML w przykładach musi być escapowany.
- Demo edukacyjne ma być statyczne, jeśli nie jest pełnym działającym komponentem.
- Statyczne demo formularza nie używa prawdziwych `input`, `select`, `textarea` ani zbędnego ARIA.
- Style demo dodawaj tylko jako scoped CSS dla klasy demo.

## Źródła

- Źródła W3C sprawdzaj przed dopisaniem technik albo failures.
- W tutorialu w sekcji `Źródła` umieszczaj tylko źródła merytoryczne danego kryterium.
- Notatki kontrolne, np. brak osobnej listy failures, zapisuj w `source-qa`, nie w publicznym tutorialu.
- Nie dopisuj technik W3C z pamięci.

## Koniec taska

- Uruchom checklisty jakości i źródeł.
- Zaktualizuj status po wykonaniu kryterium.
- Zaktualizuj source QA, jeśli dodajesz techniki, failures albo status źródeł.
- Przed commitem sprawdź staged files i upewnij się, że obejmują tylko zakres taska.
