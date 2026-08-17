# Dostępne aplikacje mobilne: audyt merytoryczny prezentacji

Data audytu: 2026-08-16  
Materiał źródłowy: prezentacja Canva „Jakie elementy tworzą dostępność cyfrową w aplikacjach mobilnych?”  
Zakres odczytu: pełna warstwa tekstowa 175 slajdów. Canva nie udostępniła przez link metadanych ani miniatur slajdów, dlatego audyt nie obejmuje informacji przekazanych wyłącznie grafiką.

## Cel

Zweryfikowanie treści przed przeredagowaniem ich na tutorial w bazie wiedzy Accessibility First. Audyt rozdziela wymagania WCAG, wskazówki platformowe i wymagania prawne, żeby nie przedstawiać dobrej praktyki jako obowiązku albo odwrotnie.

## Źródła podstawowe

- W3C, WCAG 2.2.
- W3C, WCAG2ICT 2.2, W3C Group Note z 11 grudnia 2025 r.
- W3C, WCAG2Mobile, Group Draft Note z 6 maja 2025 r. Dokument ma charakter informacyjny i nie ustanawia wymagań.
- Apple Developer Documentation i Apple Human Interface Guidelines.
- Android Developers, w tym dokumentacja Jetpack Compose i wytyczne testowania dostępności.
- Flutter API i oficjalna dokumentacja testów dostępności.
- Ustawa z 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych.
- Gov.pl, warunki techniczne deklaracji dostępności w wersji 2.0.
- Ustawa z 26 kwietnia 2024 r. o zapewnianiu spełniania wymagań dostępności niektórych produktów i usług przez podmioty gospodarcze.

## Ustalenia

### Treści poprawne i zachowane

- WAI-ARIA dotyczy treści webowych. Natywne aplikacje używają mechanizmów dostępności platformy, które przekazują podobne informacje: nazwę, rolę, stan, wartość i relacje.
- Standardowe komponenty platformy zapewniają lepszy punkt wyjścia niż komponenty niestandardowe.
- Istotne zmiany dynamiczne trzeba przekazywać technologiom wspomagającym bez nieuzasadnionego przenoszenia fokusu.
- Grafiki informacyjne wymagają tekstowego odpowiednika, a grafiki dekoracyjne powinny być pomijane przez czytnik ekranu.
- Formularze potrzebują widocznych etykiet, instrukcji, tekstowych komunikatów błędów i logicznego zarządzania fokusem.
- Kolejność odczytu, nagłówki, tytuły ekranów, język, kontrast, skalowanie tekstu, gesty, orientacja, czas i multimedia są istotnymi obszarami audytu aplikacji.
- Testy automatyczne nie zastępują testów z VoiceOver, TalkBack, klawiaturą i innymi metodami wejścia na rzeczywistych urządzeniach.

### Treści skorygowane przed publikacją

1. **ARIA w aplikacjach natywnych**  
   Nie należy „robić ARIA na mobile”. Trzeba odwzorować intencję semantyczną przez API danej platformy. ARIA nadal ma zastosowanie w treści webowej i w warstwie WebView.

2. **SwiftUI: przycisk i etykieta**  
   Natywny `Button` ma już rolę przycisku. Dodawanie `.accessibilityAddTraits(.isButton)` jest zbędne. Zastąpienie widocznej etykiety „Dalej” nazwą „Przejdź do następnego ekranu” może naruszyć zasadę etykiety w nazwie. Nazwa dostępna powinna zawierać widoczny tekst.

3. **Android: `contentDescription`**  
   Nie należy dodawać `android:contentDescription="Przycisk Zapisz"` do tekstowego `Button`. Widoczny tekst zapewnia nazwę, a rola pochodzi z komponentu. `contentDescription` jest potrzebne przede wszystkim dla znaczących ikon i grafik bez tekstu. `importantForAccessibility="yes"` także nie jest potrzebne dla standardowego przycisku.

4. **Region live na przycisku**  
   `accessibilityLiveRegion` opisuje zmieniający się komunikat lub obszar, nie kontrolkę uruchamiającą akcję. Atrybut nie powinien być dodawany do przycisku „Zapisz” bez powodu.

5. **Flutter: ogłoszenia**  
   Flutter nie ma w rdzeniu widgetu o nazwie `Announce`. `SemanticsService.announce` jest obecnie przestarzałe. Domyślnie należy aktualizować drzewo semantyki, na przykład przez `Semantics(liveRegion: true)`. `SemanticsService.sendAnnouncement` służy do wyjątków, których system nie ogłasza naturalnie, i nie wszystkie platformy wspierają takie ogłoszenia.

6. **Figma i dostępność**  
   Nazwy warstw, adnotacje i pluginy są dokumentacją dla zespołu. Nie tworzą automatycznie semantyki w aplikacji. Tutorial opisuje je jako element przekazania projektu do wdrożenia, nie jako implementację.

7. **Grafiki**  
   Nie każda grafika ma mieć opis. Grafiki dekoracyjne należy ukryć przed technologiami wspomagającymi. Nazwa grafiki funkcjonalnej ma opisywać akcję, a złożony wykres potrzebuje równoważnej informacji, nie listy wszystkich szczegółów wizualnych.

8. **Landmarki i poziomy nagłówków**  
   Natywne aplikacje nie odtwarzają mechanicznie landmarków HTML `header`, `main` i `footer`. Używają tytułów ekranów, nagłówków, kontenerów, paneli i semantyki nawigacji wspieranej przez platformę. Aktualne SwiftUI obsługuje poziomy nagłówków, więc stwierdzenie, że iOS zawsze ma tylko jeden poziom, jest nieaktualne.

9. **Rozmiar celu**  
   WCAG 2.2, kryterium 2.5.8 na poziomie AA, określa 24 na 24 piksele CSS z wyjątkami. Kryterium 2.5.5 na poziomie AAA określa 44 na 44 piksele CSS. Apple i Android podają własne wskazówki platformowe, zwykle 44 na 44 pt dla przycisków i 48 na 48 dp dla Androida. Wartości te trzeba opisywać jako wytyczne platformowe, a nie jako to samo wymaganie co WCAG.

10. **Klawiatura a czytnik ekranu**  
    VoiceOver i TalkBack nie są testem obsługi klawiaturą. Klawiaturę sprzętową, Full Keyboard Access, Switch Control, Voice Access i czytniki ekranu należy testować jako różne metody obsługi. WCAG2ICT wyjaśnia też, że kryterium 2.1.1 nie oznacza obowiązku bezpośredniej obsługi fizycznej klawiatury w każdej aplikacji, jeśli aplikacja korzysta ze wspieranych usług wejścia platformy.

11. **Parsowanie i poprawność kodu**  
    Kryterium 4.1.1 Parsowanie zostało usunięte z WCAG 2.2. Walidacja kodu nadal jest dobrą praktyką, ale nie należy przedstawiać jej jako osobnego aktualnego kryterium WCAG dla natywnej aplikacji.

12. **Skalowanie tekstu**  
    Androidowe `autoSizeTextType` dopasowuje tekst do dostępnego miejsca i może go zmniejszać. Nie zastępuje obsługi preferencji użytkownika. Podstawą na Androidzie są jednostki `sp`, elastyczny układ i test przy maksymalnej skali, od Androida 14 do 200% z nieliniowym skalowaniem. Flutter dziedziczy skalę przez `MediaQuery` i `TextScaler`; nie należy arbitralnie ograniczać skali. W iOS należy korzystać z Dynamic Type i semantycznych stylów tekstu.

13. **Linki zewnętrzne**  
    Informacja o otwarciu innej aplikacji jest pomocna, gdy zmiana kontekstu może zaskoczyć, ale nie jest bezwzględnym wymaganiem dla każdego linku zewnętrznego. Komunikat powinien odpowiadać rzeczywistemu zachowaniu.

14. **Multimedia**  
    Nie każde medium potrzebuje jednocześnie napisów, transkrypcji i audiodeskrypcji. Alternatywa zależy od rodzaju materiału oraz informacji przekazywanej obrazem i dźwiękiem.

15. **Deklaracja dostępności**  
    Obowiązek deklaracji z ustawy z 4 kwietnia 2019 r. dotyczy aplikacji mobilnych podmiotów publicznych, a nie każdej aplikacji. Deklarację aplikacji publikuje się na stronie podmiotu i w aplikacji, a link także w miejscu pobierania. Identyfikatory `a11y-*` dotyczą wersji HTML deklaracji, nie natywnego interfejsu. Podmioty prywatne objęte Polskim Aktem o Dostępności mają od 28 czerwca 2025 r. odrębne obowiązki dla wskazanych produktów i usług, ale nie należy utożsamiać ich z deklaracją wymaganą od podmiotów publicznych.

16. **WCAG 2.2 a polska podstawa prawna**
    WCAG 2.2 jest aktualną rekomendacją W3C, ale wymagania ustawy z 4 kwietnia 2019 r. dla podmiotów publicznych są obecnie powiązane z punktami 9, 10 i 11 PN-ETSI EN 301 549 V3.2.1:2021, która opiera się głównie na WCAG 2.1 AA. Kryteriów 2.5.8 i 3.3.8 nie należy przedstawiać jako elementów obecnego załącznika do tej ustawy.

17. **Flutter: nagłówki semantyczne**
    W nowych wersjach Fluttera nagłówek na iOS i Androidzie należy deklarować przez `headingLevel` większy od zera. Właściwość `header` pozostaje w API, ale zgodnie z opublikowaną instrukcją migracji ma stać się nieaktywna na tych platformach. Tutorial nie przypisuje tej zmiany do niepotwierdzonego numeru stabilnego wydania.

## Elementy pominięte jako mylące albo niezweryfikowane

- nieistniejący, ogólny widget Flutter `Announce`;
- ogólne odwołanie do pakietu `flutter_accessibility` bez wskazania konkretnego, utrzymywanego rozwiązania;
- `UIAccessibilityTraitStartsMediaSession` jako uniwersalny sposób zapewnienia dostępności multimediów;
- twierdzenie, że TalkBack zawsze ma pierwszeństwo nad dźwiękiem multimediów;
- `AccessibilityDelegate` jako centralny słownik etykiet w Androidzie;
- minimalny czas animacji 500 ms jako wymaganie dostępności;
- wymaganie hierarchii H1-H6 i landmarków HTML w każdej natywnej aplikacji;
- twierdzenie, że każda aplikacja musi mieć deklarację dostępności.

## Ograniczenia

- Audyt nie jest opinią prawną.
- WCAG2Mobile jest dokumentem informacyjnym w wersji roboczej i nie może być przedstawiane jako samodzielny standard zgodności.
- Zachowanie API i technologii wspomagających zależy od wersji systemu. Przykłady trzeba sprawdzić na wspieranych przez produkt wersjach i urządzeniach.
- Warstwa tekstowa Canva nie zawierała części kodu widocznego prawdopodobnie jako grafika. Do tutorialu trafiły nowe, krótkie przykłady oparte na aktualnej dokumentacji platform.
