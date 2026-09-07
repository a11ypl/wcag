# Standard grafik Accessibility First

Wersja robocza 0.1, 6 września 2026. Plan zatwierdzony przez Damiana. **Wygląd kart postaci wymaga osobnej akceptacji.**

## Cel i zakres

Powtarzalne grafiki z rozpoznawalnymi postaciami, krótką treścią i kontrolowanym składem. Paczka obejmuje oryginalne referencje, standard wizualny, rejestr postaci, prompty, pięć rodzin makiet w czterech formatach oraz narzędzie składu i kontroli. Nie zmienia strony produkcyjnej ani starych grafik.

- [Podgląd wizualny](review/index.html): karty postaci, paleta, makiety i decyzje.
- [Standard i decyzje](a11yfirst-graphics/references/standard.md).
- [Przegląd materiałów](a11yfirst-graphics/references/source-review.md).
- [Procedura tworzenia i kontroli](a11yfirst-graphics/references/workflow.md).
- [Umiejętność do kolejnych zleceń](a11yfirst-graphics/SKILL.md).
- [Rejestr postaci](a11yfirst-graphics/references/characters.json).

## Struktura

`a11yfirst-graphics/` to samodzielna paczka umiejętności. `assets/sources/` i `assets/brand/` zawierają niezmienione kopie plików źródłowych; ich pochodzenie i sumy SHA-256 zapisano w `references/source-manifest.json`. `assets/characters/` przechowuje kandydatów na wzorce. `examples/` zawiera edytowalne briefy makiet. `review/` zawiera podglądy i wyniki sprawdzeń.

## Użycie przy kolejnych grafikach

Umiejętność została zapisana także w `/Users/bergi/.codex/skills/a11yfirst-graphics`. Można wskazać `$a11yfirst-graphics` i opisać temat. Zgodność instalowanej kopii z paczką projektu sprawdzono po zapisie. Obie karty nadal mają status `candidate`. Aktualna karta Damiana to v03: umięśniona sylwetka pływaka, szerokie barki i zwężenie do talii oraz pełne rękawy do nadgarstków zakrywające tatuaże. Wspólna plansza AF-PAIR01 v02 pokazuje także Olę niższą o około pół głowy.

Wersjonowane źródło jest w tym repozytorium. Po akceptacji kart lub zmianie standardu należy zaktualizować rejestr tutaj i zsynchronizować instalowaną kopię, zachowując wszystkie nowe zasoby. Nie wolno pozostawić dwóch różnych zatwierdzonych wzorców pod tym samym identyfikatorem.

## Uruchomienie

Skład nie wywołuje płatnego API i nie publikuje materiałów. Uruchom z katalogu repozytorium:

```sh
node graphics-standard/a11yfirst-graphics/scripts/compose.mjs --brief graphics-standard/examples/training.json --out /tmp/a11yfirst-preview
```

Polecenie zapisuje edytowalny HTML, tekst alternatywny, tekst do publikacji i prompt ilustracji. Dopóki wzorce nie są zaakceptowane, wyniki mają status makiety. Generator ilustracji jest wywoływany przez agenta zgodnie z `SKILL.md`, osobno od deterministycznego składu.

Eksport PNG i pomiary układu wymagają Playwright oraz Chromium. Można użyć zależności dostarczanych przez środowisko, bez dodawania pakietów do projektu:

```sh
NODE_PATH=/Users/bergi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node graphics-standard/a11yfirst-graphics/scripts/render.mjs /tmp/a11yfirst-preview
```

Skrypt próbuje załadować Playwright ze standardowego środowiska Node lub z `NODE_PATH`. Brak biblioteki lub przeglądarki zgłasza jawnie. Nie instaluje niczego automatycznie.

## Sprawdzenie

```sh
node --test graphics-standard/a11yfirst-graphics/scripts/compose.test.mjs
node graphics-standard/a11yfirst-graphics/scripts/verify-package.mjs
npm test
```

Do każdej grafiki należą osobno: wynik kontroli technicznej oraz ocena wizualna. Poprawne wymiary i brak przepełnienia nie dowodzą zgodności twarzy ze wzorcem.

Wyniki wykonanych sprawdzeń opisano w [raporcie QA](review/QA.md).

## Decyzje i ograniczenia

- Źródło mężczyzny: portret „damianek graficzny.png”; źródło kobiety: najnowsza scena przy komputerze. To kandydaci, nie zatwierdzony kanon.
- Nie ma potwierdzonego pełnego brandbooka Accessibility First. Żółty pochodzi z logo, fiolet z istniejącego CSS; pozostałe decyzje oznaczono jako propozycje standardu.
- Makiety celowo pokazują miejsce na ilustrację. Gotowe sceny, biblioteka póz i test trzech scen powstaną po akceptacji postaci.
- Nowy generator może zmieniać tożsamość, nawet z referencją. Ocenę wykonuje agent; automatyczny skład nie rozpoznaje twarzy.
- Procedura działa przy użyciu tej umiejętności. Nie przechwytuje zleceń wykonywanych w innych generatorach ani innych rozmowach bez dostępu do paczki.

## Kolejny krok

Aktualnie do wglądu jest wspólna plansza: Ola (AF-F01) około pół głowy niższa od Damiana (AF-M01). Różnicę oceniamy na wspólnym podłożu, nie przez porównywanie osobnych arkuszy. Damian potwierdza tę planszę lub wskazuje korektę. Agent zapisuje akceptację w rejestrze wraz z datą i SHA-256 plików, tworzy trzy sceny próbne oraz sprawdza je w kilku formatach. Dopiero wtedy oznacza wersję 1.0 jako gotową do produkcji.
