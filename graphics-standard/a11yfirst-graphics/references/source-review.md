# Przegląd materiałów źródłowych

Zakres: 11 grafik z folderu GFX i 8 plików logo. Trzy załączone zrzuty przedstawiają najnowszą serię ofertową. Pełny rejestr nazw, wymiarów i sum plików znajduje się w `source-manifest.json`. Oględziny pozwalają ocenić wygląd, ale nie ustalić, który model wygenerował dany plik.

| Źródło w paczce | Obserwacja | Decyzja robocza |
| --- | --- | --- |
| `male-portrait.png` | Mniejsze oczy, specyficzny kształt nosa, miedziany zarost, charakterystyczny detal ucha; inna twarz niż w biurze | Główna referencja kandydata AF-M01; detale ucha do akceptacji |
| `recent-offer-landscape.png` | Dojrzalsze postacie, ciemna kompozycja, czytelny kontrast głównych nagłówków; wiele bloków informacji | Referencja kobiety i kierunku ilustracji. Redukcja tekstu |
| `recent-schedule-landscape.png` | Trzy karty szkoleniowe i kilka poziomów komunikatu; nazwy i dane drobniejsze od CTA | Rodzina oferty zbiorczej, maks. trzy krótkie pozycje |
| `recent-schedule-portrait.png` | Te same motywy w pionie; gęsty program, różna hierarchia danych | Osobny układ pionowy, bez skalowania całego poziomego plakatu |
| `archive-office-pair.jpeg` | Większe oczy i bardziej kreskówkowe twarze; podobne ubrania nie zapewniają tej samej tożsamości | Pomocnicza referencja sceny, nie twarzy AF-M01 |
| `archive-male-full-body.jpeg` | Pełne ciało, czapka, duże oczy, holograficzne tło | Referencja dawnego stylu. Nie przenosić twarzy do nowego wzorca ani znaku obcej marki na czapce |
| `archive-ai-overlap.png` | Postać zakrywa podpis prowadzącego; kadr ucina postać, ciężkie cienie tekstu | Przykład kontrolny błędu składu; wycofać ten układ |
| `archive-ai-dense.png` | Bardzo długi tytuł, liczne wersaliki, wzorzyste tło pod literami | Zachować temat, przenieść rozwinięcie do opisu |
| `archive-ai-webinar.png` | Krótszy komunikat, ale nadal duże cienie, liczne barwy i tło konkurujące z tekstem | Uprościć powierzchnię tekstową i kolorystykę |
| `archive-law-webinar.png` | Czytelne pola terminu, ilustracja kobiety o innej stylizacji, fotograficzny rekwizyt przy komiksie | Zachować rolę terminu; ujednolicić rendering postaci i rekwizytów |
| `archive-technology.png` | Neonowy schemat z nieopisanymi ikonami i powtórzonym motywem mózgu | Materiał archiwalny; przy edukacji opracować jednoznaczny schemat i opis tekstowy |

## Logo

Zachowano wszystkie osiem oryginałów. Do makiet wybrano biało-żółty napis z przezroczystością. Dominujący żółty nieprzezroczystych pikseli wynosi `#FACC15`. Nie zastępuj go przybliżeniem „żółty z poprzedniego promptu”. Pliki SVG zawierające element `image` odnotowano w manifeście; nie należy zakładać, że są niezależnymi od rozdzielczości wektorami.

## Potwierdzone problemy dostępności

Zakryty podpis w `archive-ai-overlap.png` jest utratą informacji wizualnej. Długie bloki wersalików oraz tekst nad wzorzystym tłem utrudniają czytanie. Najnowsze plakaty wymagają sprawdzenia przy rzeczywistym rozmiarze na telefonie, zwłaszcza podpisy prowadzących i terminy. To oględziny materiałów, nie pełny audyt zgodności publikacji z WCAG.

Nie przenosimy automatycznie starych terminów, nazwisk, sformułowania „bezpłatnie” ani informacji o certyfikatach. Każda z tych danych wymaga aktualnego źródła w nowym zleceniu.
