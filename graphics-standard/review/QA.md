# Weryfikacja wersji roboczej 0.1

Praca rozpoczęta 6 września 2026, sprawdzenia zakończone 7 września 2026. Zakres to standard i makiety przed akceptacją postaci, nie gotowa biblioteka kampanii.

## Wyniki

- 19 kopii oryginalnych materiałów: zgodne sumy SHA-256 z manifestem.
- Dwie karty kandydatów: zapisane w paczce. Mężczyzna przeszedł dodatkową korektę oczu. Żadna karta nie ma statusu `approved`.
- Sześć testów nowego narzędzia składu: PASS, w tym odrzucenie niezaakceptowanych postaci, zmienionych wzorców, starej oceny ilustracji, niekompletnych danych i niebezpiecznego URL; zachowanie tekstu jako tekstu oraz brak nadpisania wyniku.
- 40 testów istniejącego projektu: PASS. Pierwsze uruchomienie miało dwa błędy `listen EPERM` wynikające z piaskownicy; uruchomienie z dostępem do lokalnego portu przeszło w całości.
- 20 makiet: PASS kontroli wymiarów, fontów, obrazów, przepełnień i nachodzenia głównych obszarów. Początkowy line-height 1.04 powodował wyjście części glifów poza pole nagłówka o 3–4 px. Zmieniono go na 1.14 i ponownie wyrenderowano wszystkie układy.
- Podgląd HTML: PASS przy 1440 i 360 px, po zwiększeniu odstępów tekstu, z klawiatury (skip link i sekcje rozwijane), bez poziomego przewijania i brakujących obrazów. Szczegóły w `review-qa.json`.
- Pomiary próbek rzeczywiście wyrenderowanych powierzchni: biały/tło 18,96:1; pomocniczy/tło 13,28:1; biały/fiolet 8,57:1; żółty/tło 12,38:1; pomocniczy/powierzchnia 11,80:1. Metoda i próbki w `contrast-qa.json`.
- YAML umiejętności i metadanych: odczytany poprawnie przez Ruby Psych. Dostarczony `quick_validate.py` nie uruchomił się z powodu brakującego PyYAML; nie instalowano zależności do repo. Dodatkowo własny `verify-package.mjs` sprawdził zasoby, rejestr i sumy źródeł.

## Oględziny

Obejrzano obie wygenerowane karty, źródłowe referencje, podgląd desktop/mobile oraz osiem reprezentatywnych makiet obejmujących wszystkie rodziny i wszystkie proporcje: training w czterech formatach, tip-square, webinar-portrait, carousel-portrait, overview-landscape. Pozostałe warianty przeszły kontrolę układu w przeglądarce.

Czytelność ma być sprawdzana w rzeczywistym miejscu publikacji. Makiety 16:9 przeznaczone do szerokiego wyświetlania mają informacje pomocnicze zbyt małe po zmniejszeniu całego obrazu do 360 px. Na telefon wybieraj pionową wersję i umieszczaj pełne dane także w tekście publikacji. Nie ma deklaracji, że sama grafika PNG zapewnia zgodność WCAG.

## Wymaga dalszej pracy

Akceptacja wyglądu obu postaci, trzy sceny próbne, sprawdzenie zachowania tożsamości po zmianie ubrań i otoczenia, gotowe pozy oraz ocena finalnych ilustracji w makietach. Placeholdery scen służą wyłącznie ocenie układu. Wynik techniczny `pass` nie jest oceną tożsamości ani anatomii.

Zmiany tego zadania znajdują się wyłącznie w `graphics-standard/` i instalowanej kopii umiejętności. W repo były wcześniej inne zmiany; nie przypisujemy ich do tego zadania i nie wykonano commitu.

## Korekta ubioru Damiana, 7 września 2026

Nowa karta AF-M01 v02 ma rękawy opuszczone do nadgarstków. Obejrzano wszystkie trzy pełne ujęcia: przedramiona zakryte, dłonie widoczne, bez odtwarzania tatuaży. Wersję v01 zachowano jako historię; aktualne odwołania wskazują v02. Zasadę zapisano w rejestrze, standardzie, instrukcji umiejętności, promptach i kontroli jakości. Uzupełniono 16 istniejących promptów planistycznych z AF-M01. Ponownie przeszło 6 testów narzędzia składu. Korekta ubioru nie stanowi akceptacji całej tożsamości postaci.

## Relacja wzrostu Oli i Damiana, 7 września 2026

Dodano wspólną planszę AF-PAIR01 w tej samej skali i na wspólnym podłożu. Pierwszy wynik miał zbyt dużą różnicę; po korekcie czubki głów dzieli około 112 px przy głowie Damiana około 208 px, czyli około pół głowy (orientacyjne oględziny obrazu 1024×1536). Zachowane pełne rękawy Damiana. Użytkownik określił AF-F01 jako Olę; usunięto nieaktualne pytanie o jej imię. Osobne karty służą cechom twarzy, wspólna plansza relacji wzrostu. Reguła jest zapisana w standardzie, rejestrze, promptach i kontroli, a wspólna plansza jest dołączana w manifeście zleceń z obojgiem. Status planszy pozostaje candidate do oceny użytkownika.

## Umięśniona sylwetka Damiana, 7 września 2026

Po dodatkowym doprecyzowaniu użytkownika powstały AF-M01 v03 oraz AF-PAIR01 v02. Obejrzano trzy pełne ujęcia i wspólną planszę: szerokie barki, rozbudowana klatka i ramiona, zwężenie tułowia do talii. Pełne rękawy zachowane. Wspólny widok zachowuje Olę około pół głowy niższą i wspólne podłoże. Nie ma podstaw do traktowania dawnego opisu „przeciętna budowa” jako aktualnej reguły; usunięto go z rejestru. Dokładne historyczne prompty pozostają w rejestrze generacji jako historia. Aktualny wygląd i wspólna plansza nadal czekają na ocenę użytkownika.
