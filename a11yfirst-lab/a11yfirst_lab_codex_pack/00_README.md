# A11yFirst Lab - pakiet dokumentów dla Codex

Wersja: 0.1  
Data: 2026-06-27  
Cel: przygotowanie dostępnej, interaktywnej gry edukacyjnej na a11yfirst.pl dla uczestników szkoleń z audytowania dostępności cyfrowej.

## Co jest w pakiecie

1. `01_MASTER_PROMPT_DLA_CODEX.md` - prompt startowy do wklejenia w Codex.
2. `02_PRD_A11YFIRST_LAB.md` - opis produktu, grup użytkowników, funkcji i MVP.
3. `03_UX_I_DOSTEPNOSC_SPEC.md` - wymagania UX i dostępności dla samej gry.
4. `04_ARCHITEKTURA_TECHNICZNA.md` - zalecany stack, struktura projektu i deploy.
5. `05_MODEL_DANYCH_I_SCHEMA.md` - model danych ćwiczeń, wyników i feedbacku.
6. `06_ZAPIS_POSTEPU.md` - zapisywanie postępu lokalnie i wariant docelowy z API.
7. `07_SILNIK_GIER_I_FEEDBACK.md` - logika gier, feedback dla odpowiedzi i tryby ćwiczeń.
8. `08_PLAN_TESTOW_A11Y_QA.md` - plan testów dostępności, funkcjonalnych i regresji.
9. `09_BACKLOG_I_ROADMAP.md` - backlog, roadmapa i kolejność prac.
10. `12_ACCEPTANCE_CRITERIA.md` - kryteria akceptacji MVP.
11. `data/a11yfirst_lab_seed_exercises.json` - przykładowe ćwiczenia z feedbackiem dla każdej odpowiedzi.
12. `templates/exercise_template.json` - szablon dodawania nowych ćwiczeń.
13. `templates/progress_template.json` - szablon danych postępu.
14. `templates/typescript_interfaces.ts` - interfejsy danych.
15. `prompts/prompt_do_generowania_cwiczen.md` - prompt do tworzenia nowych ćwiczeń.
16. `checklists/checklista_przed_wdrozeniem.md` - szybka lista kontrolna przed publikacją.
17. `SOURCES.md` - oficjalne źródła i standardy.

## Założenie MVP

MVP ma być statyczną aplikacją webową uruchamianą na podstronie `a11yfirst.pl/lab`, zabezpieczoną hasłem po stronie WordPressa albo serwera. Postęp w MVP jest zapisywany w `localStorage`, z opcją eksportu/importu JSON. Wersja docelowa może mieć konta użytkowników i zapis po stronie serwera.

## Najważniejsza zasada

Ta gra ma być wzorcowo dostępna. Jeżeli jakaś funkcja nie jest możliwa do pełnej obsługi klawiaturą, czytnikiem ekranu i przy powiększeniu, nie wchodzi do MVP.
