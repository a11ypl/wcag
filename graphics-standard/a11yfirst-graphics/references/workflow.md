# Procedura produkcji

## Krótki brief

Użytkownik może napisać: „Przygotuj grafikę o sprawdzaniu formularzy, pionową, z dwiema postaciami”. Agent dobiera makietę i zapisuje dane. Nie wymaga od użytkownika wypełniania technicznego formularza.

Pola briefu dla składu: `id`, `template` (`training`, `webinar`, `tip`, `carousel`, `overview`), `format` (`square`, `portrait`, `story`, `landscape`), `status` (`mockup` lub `production`), `eyebrow`, `title`, `body`, `details` (do trzech krótkich pozycji), `cta`, `url`, `scene`, `characters`, `illustration` (lokalna ścieżka względem pliku briefu), `illustration_alt`. Dla produkcji dodatkowo `visual_review` z pozytywną oceną i SHA-256 ilustracji. Puste dane można pominąć; program nie dopisuje dat ani obietnic.

Wywołanie:

```sh
node /ścieżka/do/a11yfirst-graphics/scripts/compose.mjs --brief /workspace/brief.json --out /workspace/wynik
node /ścieżka/do/a11yfirst-graphics/scripts/render.mjs /workspace/wynik
```

Wynik: `graphic.html` z osadzonym fontem i logo, `brief.json`, `illustration-prompt.txt`, `publication.txt`, `alt.txt`, `manifest.json`; po renderze także `graphic.png` i `layout-qa.json`. HTML zachowuje tekst edytowalny. PNG jest eksportem tego składu, nie źródłem do kolejnych zmian.

## Generowanie ilustracji

Odczytaj wzorce i zobacz obrazy przed wywołaniem generatora. Dołącz tylko właściwe karty postaci i ewentualną referencję stylu. Nie dołączaj całego archiwum: miesza twarze i stare treści. Pole `scene` opisuje działanie, cel i potrzebne rekwizyty; przykład: „Dwie osoby wspólnie sprawdzają formularz na laptopie; jedna wskazuje pole, druga obsługuje klawiaturę”.

Generator wbudowany tworzy ilustrację bez tekstu i logo. Zapisz dokładny prompt, nazwy i SHA-256 referencji, rzeczywisty tryb narzędzia i plik wyniku. Jeżeli narzędzie nie ujawnia modelu, wpisz `not-disclosed`. Nie twierdź, że sam prompt lub seed gwarantuje tożsamość.

Do nowej sceny używaj kart zatwierdzonych. Nie twórz łańcucha referencji „ostatnia wygenerowana scena jest nową twarzą”. Zatwierdzona karta pozostaje źródłem tożsamości. Powtarzalne pozy przechowuj jako oddzielne, sprawdzone zasoby z prawdziwą przezroczystością, jeśli została wygenerowana; tło w szachownicę nie oznacza kanału alfa.

## Kontrola jakości

Sprawdzenia techniczne: liczba słów, kompletność danych produkcyjnych, oryginalne logo, dostępność plików, status postaci, sumy referencji, wymiary eksportu, ładowanie fontów i obrazów, przepełnienie kontenerów. Każdy błąd zatrzymuje dany eksport. Nie oznaczaj kompletnego zadania jako gotowego tylko dlatego, że powstał PNG.

Ocena wizualna agenta, osobno od skryptu:

| Obszar | Warunek akceptacji |
| --- | --- |
| Tożsamość | Wszystkie cechy stałe odpowiadają karcie; brak zmiany koloru oczu, nosa, wieku lub zarostu |
| Sylwetka i anatomia | Prawidłowe kończyny, dłonie i chwyt; brak połączenia rekwizytu z ciałem |
| Ubiór Damiana / AF-M01 | Oba rękawy opuszczone do nadgarstków, całe przedramiona zakryte, dłonie widoczne; brak odtworzonych lub wymyślonych tatuaży |
| Sylwetka Damiana / AF-M01 | Szerokie barki i umięśniona góra tułowia zwężająca się ku talii, proporcje pływaka, bez zmiany twarzy i wysokości postaci |
| Wzrost Oli względem Damiana | Ola / AF-F01 jest około pół głowy Damiana niższa; skala oparta na wspólnej planszy. Przy porównaniu oboje stoją na wspólnym podłożu, w tej samej odległości od obserwatora. Poza i perspektywa nie mogą zastępować właściwej różnicy wzrostu |
| Scena | Zrozumiała czynność, poprawna perspektywa, sensowny sprzęt; brak niezamierzonych stereotypów |
| Styl | Spójny kontur, cieniowanie, poziom realizmu i skala oczu |
| Tekst | Brzmienie zgodne z briefem, polskie znaki, aktualne dane; bez zmyślonych faktów |
| Skład | Brak zasłaniania twarzy i danych; celowe kadry i wystarczające marginesy |
| Czytelność | Oględziny 100% oraz przy szerokości 360 px; pomiar kontrastu na renderze |
| Odpowiednik | Alt i pełna treść publikacji; link klikalny w docelowym opisie |

Skrypt nie sprawdza semantycznie anatomii, tożsamości ani prawdziwości wydarzenia. Nie zastępuj tych ocen fikcyjnym wynikiem „AI score 100%”. Agent zapisuje `visual_review` dopiero po obejrzeniu dokładnie tego pliku. SHA-256 wiąże ocenę z wersją ilustracji, ale nie dowodzi poprawności oceny.

Przykład zapisu po rzeczywistych oględzinach: `{"status":"pass","illustration_sha256":"rzeczywisty_hash","reviewer":"Codex","notes":"Porównano nos, oczy, włosy i zarost ze wzorcem; sprawdzono dłonie i chwyt."}`. Skopiowanie przykładu nie jest kontrolą.

## Poprawki i zatrzymanie

Pierwsza poprawka celuje w wykrytą usterkę. Druga może uprościć kadr lub użyć gotowej pozy. Jeżeli nadal zmienia się tożsamość lub scena jest błędna, oznacz `needs-review` i przedstaw konkretny problem. Nie oddawaj niepewnej grafiki jako gotowej do publikacji.

Karty `candidate` wymagają akceptacji wyglądu zgodnie z planem Damiana. Po akceptacji zapisz `status: approved`, ścieżkę `approved_reference`, jej SHA-256, datę oraz krótki cytat lub opis zgody w `approval_evidence`. Nie wyprowadzaj zgody na konkretną twarz z samego zatwierdzenia planu. Dla kolejnych zwykłych scen używaj zaakceptowanego wzorca bez ponownego pytania.

## Pilotaż po akceptacji kart

1. Wspólne sprawdzanie formularza: AF-M01 i AF-F01, odmienne pozy, format 4:5 i 16:9.
2. Praca z dokumentem: AF-F01 w zmienionym ubraniu, format 1:1 i 9:16.
3. Wyjaśnianie zastosowania AI: AF-M01 w innym otoczeniu, format 4:5 i 16:9.

Porównaj twarze obok wzorców. Zmiana ubrania i otoczenia nie może zmieniać osoby. Zapisz wyniki osobno dla każdej sceny i formatu. Po pozytywnym pilotażu uzupełnij bibliotekę sprawdzonych póz oraz oznacz standard 1.0. Nie zmieniaj rejestru zatwierdzonych cech, żeby dopasować go do gorszego wyniku.
