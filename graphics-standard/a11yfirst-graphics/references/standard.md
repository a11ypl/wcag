# Standard wizualny 0.1

Status: propozycja wdrożenia na podstawie materiałów dostarczonych 6 września 2026. Plan jest zatwierdzony; karty postaci oczekują na wybór Damiana. To standard produkcji ilustracji i grafik, nie przebudowa identyfikacji całej strony.

## Źródła i hierarchia

Pierwszeństwo mają aktualne polecenie Damiana, zatwierdzony rejestr postaci, oryginalne logo, niniejszy standard i wskazane referencje stylu. Archiwalne plakaty są przykładami, nie normą. Nie łącz kilku odmiennych twarzy w „średnią” osobę.

Potwierdzone z pliku: napis ACCESSIBILITY FIRST, proporcje oryginalnego logo, biel i żółty `#FACC15` (RGB 250, 204, 21). Potwierdzone w istniejącym `public/assets/styles.css`: fiolet `#5F28B4`. Użycie fioletu jako koloru wspierającego w grafikach jest decyzją tej propozycji. W repo występuje też pomarańcz `#FA9632`; nie wprowadzamy go jako drugiego koloru CTA w tej serii.

## Paleta

| Rola | Wartość | Zastosowanie / źródło |
| --- | --- | --- |
| Tło główne | `#101016` | Proponowana neutralna czerń, jednolite pole pod tekstem |
| Powierzchnia | `#1C1C28` | Proponowane karty pomocnicze |
| Tekst | `#FFFFFF` | Oryginalne logo; nagłówki i informacje |
| Tekst pomocniczy | `#D7D7E2` | Propozycja; ograniczona rola |
| Akcent | `#FACC15` | Zmierzony dominujący żółty w logo; jedno główne wyróżnienie |
| Fiolet | `#5F28B4` | Istniejący CSS; małe etykiety i powierzchnie z białym tekstem |

Jedna grafika ma jedno główne wyróżnienie żółtym. Fiolet nie konkuruje z nagłówkiem. Kolory skóry, ubrań i sceny mogą być naturalne; ograniczona paleta dotyczy kompozycji i dekoracji, nie przefarbowywania ludzi. Bez losowych neonów, chromowanych ikon i wielobarwnych obwódek.

Tekst umieszczaj na jednolitym tle. Cel dla całego tekstu: kontrast co najmniej 4,5:1, także gdy formalnie duży tekst dopuszcza mniej. Sprawdź render, nie tylko deklarację koloru. Informacji nie koduj wyłącznie kolorem. Biel na żółtym jest niedozwolonym zestawem w tym standardzie; na żółtym użyj `#101016`.

## Logo i typografia

Wstaw oryginalny `assets/brand/accessibility-first-logo-transparent.png` na ciemnym tle. Nie każ generatorowi odtwarzać napisu ani sygnetu. Zachowuj proporcje, bez cienia i zmiany barw. Pole ochronne wokół widocznego znaku: co najmniej połowa wysokości liter. Wbudowane przezroczyste marginesy nie są miarą wielkości liter.

Pliki `ikon*.svg` sprawdź przed użyciem: rozszerzenie SVG nie gwarantuje czystych wektorów. Oryginałów nie usuwaj ani nie przepisuj.

Font roboczy do składu: **Liberation Sans Regular i Bold**, dołączony z licencją. To propozycja techniczna zapewniająca powtarzalność renderu i polskie znaki, nie rozpoznany font historycznych plakatów. Logotyp pozostaje oryginalną grafiką.

Nagłówki zapisuj naturalną wielkością liter. Wersaliki zachowaj w logo i krótkich etykietach. Maksymalnie dwie grubości pisma, bez obrysu, tłustych cieni i rozstrzelenia. Skład nie zmniejsza fontu automatycznie do momentu „aż się zmieści”: przepełnienie oznacza konieczność skrócenia tekstu lub zmiany makiety.

## Postacie i styl ilustracji

Dojrzała ilustracja komiksowa: czysty ciemny kontur, czytelne płaszczyzny cienia, ograniczone refleksy, naturalna gestykulacja. Przyjazny wyraz twarzy bez dziecięcych proporcji i ciągłego szerokiego uśmiechu. Brak losowego przejścia do anime, fotorealizmu lub plastykowego 3D.

Każda osoba ma własny identyfikator, opis cech, plik wzorcowy i status w `characters.json`. Zmienne: ubiór, emocja, poza, kadr i otoczenie. Stałe: konstrukcja twarzy, kolor i kształt oczu, linia i bryła włosów, zarost, odcień skóry, proporcje sylwetki oraz zaakceptowane detale. Ubranie nie jest wystarczającym dowodem tożsamości.

**Sylwetka Damiana / AF-M01:** zgodnie z doprecyzowaniem użytkownika Damian jest wysportowany i umięśniony. Pokazuj szerokie barki, rozbudowaną klatkę piersiową i górę pleców oraz wyraźne zwężenie ku talii, czyli sylwetkę pływaka w kształcie odwróconego trójkąta. Zachowuj naturalne proporcje głowy i szyi, bez przesadnej masy kulturysty. Ta cecha jest stała również pod ubraniem; nie zmieniaj przy tym ustalonego wzrostu.

**Damian / AF-M01: pełne długie rękawy.** Użytkownik potwierdził 7 września 2026, że Damian ma tatuaże typu rękaw na obu rękach. Na kartach i w kolejnych scenach pokazuj go w koszulce z rękawami opuszczonymi do nadgarstków: całe ramiona i przedramiona zakryte, dłonie widoczne. Nie podwijaj ani nie podciągaj rękawów. Nie używaj krótkich ani trzy czwarte. Kolor i fason ubrania mogą się zmieniać w obrębie tej zasady. Nie generuj wzorów tatuaży i nie zastępuj ich odsłoniętą skórą bez tatuaży. Wyjątek wymaga wyraźnego polecenia Damiana. Reguła nie dotyczy automatycznie innych postaci.

Użytkownik wskazał 7 września 2026, że `AF-F01` to Ola, a `AF-M01` to Damian. Nie dopisujemy nazwiska Oli na podstawie archiwalnych podpisów.

**Wzrost:** Ola ma być około pół głowy niższa od Damiana. Jednostką porównania jest połowa wysokości głowy Damiana od czubka do podbródka, przy wyprostowanej postawie, wspólnym podłożu i tej samej odległości od obserwatora. Nie podajemy wzrostu w centymetrach. Do wspólnych scen dołącz planszę porównawczą z `pair_reference` w rejestrze; osobne karty postaci są normalizowane do wielkości arkusza i nie określają ich wzajemnej skali. Nie uzyskuj różnicy przez ugięcie kolan, skrócenie samych nóg ani sztuczną perspektywę. Zachowaj twarze i naturalne proporcje.

Każda karta pokazuje pełne ciało i kilka ujęć. Pełne ciało we wzorcu nie oznacza obowiązku umieszczania pełnej sylwetki na każdym poście. Kadry od pasa i portrety są dozwolone, o ile cięcie jest celowe i nie przechodzi przypadkowo przez dłonie lub stawy. Nie odbijaj gotowej osoby lustrzanie, jeśli zmienia to charakterystyczne asymetrie.

## Prosty język i objętość

Jedna grafika odpowiada na jedną potrzebę odbiorcy. Scena ma wyjaśniać temat: wspólne sprawdzanie formularza, praca z dokumentem, porównanie dwóch rozwiązań. Rekwizyt ma znaczenie, nie tylko wypełnia przestrzeń. Nie pokazuj fikcyjnych interfejsów jako poprawnych technicznych instrukcji ani przypadkowych urządzeń jako technologii asystujących.

Początkowe budżety treści (decyzja projektowa, nie wymóg WCAG):

| Rodzina | Nagłówek | Treść uzupełniająca | Łącznie bez logo |
| --- | --- | --- | --- |
| Szkolenie / webinar | do 8 słów | termin + ewentualnie prowadzący + jedno CTA | do 32 słów |
| Wskazówka | do 8 słów | jedno zdanie do 18 słów | do 30 słów |
| Okładka karuzeli | do 8 słów | zapowiedź do 10 słów | do 24 słów |
| Oferta zbiorcza | do 6 słów | maks. trzy krótkie pozycje + CTA | do 45 słów |

Przekroczenie budżetu wymaga skrótu lub świadomej zmiany makiety, nie ukrycia tekstu. Długi oficjalny tytuł może znaleźć się w opisie publikacji; skrót na grafice musi zachować sens. Nie skracaj danych potrzebnych do podjęcia decyzji. Nie używaj niewyjaśnionego „DC”, przesadnych obietnic ani retorycznego pytania jako nagłówka domyślnego.

## Makiety i formaty

Pięć rodzin: `training`, `webinar`, `tip`, `carousel`, `overview`. Każda ma wersje `square` (1080×1080), `portrait` (1080×1350), `story` (1080×1920) i `landscape` (1920×1080). To formaty robocze, nie gwarancja zgodności z przyszłymi specyfikacjami platform. Wymagania konkretnej publikacji trzeba sprawdzić przy eksporcie.

W poziomie treść i scena są obok siebie; w pionie mają osobne pasy. Margines boczny co najmniej 64 px przy szerokości 1080. Dla `story` rezerwujemy po 220 px u góry i na dole jako konserwatywne pole robocze; rzeczywisty interfejs aplikacji sprawdza się przed publikacją. Tekst i logo nie nachodzą na twarz ani dłonie. Informacyjnego kadru nie przycinaj automatycznie między formatami.

Układy w katalogu `review/` są makietami: obszar ilustracji jawnie wskazuje scenę. Nie są gotowymi reklamami. Sceny i pozy są zależne od akceptacji wzorców.

## Dostępny odpowiednik

Do gotowej grafiki przygotuj alt opisujący jej funkcję oraz pełny tekst do publikacji: nagłówek, termin, warunki, osoby i działający link, jeśli występują. Gdy ta sama informacja jest już obok w HTML, unikaj podwójnego odczytywania; dekoracyjna ilustracja może mieć `alt=""`. Sam PNG, nawet kontrastowy, nie zapewnia dostępności całej publikacji.
