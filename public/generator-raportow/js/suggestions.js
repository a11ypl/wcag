// Słownik podpowiedzi „pisz, a dostaniesz propozycje” dla pól generatora.
// Klucz = wartość atrybutu data-suggest w polu. Pierwsze pozycje pochodzą z szablonów i raportów
// Accessibility First (uogólnione, bez danych klientów), dalsze to zestaw podstawowy.

const fold = (value) => String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l");

// Podpowiedź pasuje, gdy zawiera każde wpisane słowo (bez względu na wielkość liter i polskie znaki).
export function matchesQuery(item, query) {
  const words = fold(query).split(/\s+/).filter(Boolean);
  const text = fold(item);
  return words.every((word) => text.includes(word));
}

export const SUGGESTIONS = {
  "manualTools": [
    "Nawigacja klawiaturą",
    "Test kolejności fokusu i widoczności fokusu",
    "Test pułapki na klawiaturę",
    "Test linków pomijania bloków (skip linki)",
    "Sprawdzanie kontrastu tekstu i elementów graficznych",
    "Powiększenie tekstu do 200%",
    "Powiększenie strony do 200% i 400% (reflow)",
    "Zmiana odstępów w tekście (Text Spacing)",
    "Przegląd struktury nagłówków",
    "Przegląd landmarków (punktów orientacyjnych)",
    "Weryfikacja tekstów alternatywnych",
    "Analiza kodu źródłowego i drzewa dostępności",
    "Test formularzy: etykiety, komunikaty błędów, walidacja",
    "Test elementów dynamicznych: modale, menu, karuzele, akordeony",
    "Test treści pojawiających się po najechaniu kursorem lub fokusie",
    "Test orientacji ekranu",
    "Test gestów dotykowych i rozmiaru celów dotykowych",
    "Weryfikacja tytułów stron i celu linków",
    "Test pauzowania ruchomych elementów (banery, karuzele)",
    "Ręczna ocena dokumentów do pobrania (PDF)",
    "Nawigacja wyłącznie klawiaturą (Tab, Shift+Tab, Enter, Spacja, strzałki, Escape)",
    "Sprawdzenie widoczności i kolejności fokusu",
    "Powiększenie strony do 200% i 400% (szerokość 320 px)",
    "Zmiana odstępów w tekście (Text Spacing Bookmarklet)",
    "Pomiar kontrastu kolorów",
    "Analiza struktury nagłówków i punktów orientacyjnych",
    "Weryfikacja tekstów alternatywnych obrazów",
    "Weryfikacja formularzy: etykiety, instrukcje, komunikaty o błędach",
    "Weryfikacja multimediów: napisy, audiodeskrypcja, transkrypcja",
    "Sprawdzenie orientacji ekranu (pion i poziom)",
    "Przegląd kodu źródłowego w narzędziach deweloperskich przeglądarki"
  ],
  "automaticTools": [
    "axe DevTools",
    "WAVE",
    "ANDI",
    "Lighthouse",
    "Colour Contrast Analyser (CCA)",
    "SiteLint",
    "Silktide",
    "Accessibility Insights for Web",
    "ARC Toolkit",
    "IBM Equal Access Accessibility Checker",
    "Nu Html Checker (walidator HTML)",
    "Headings Map",
    "Landmarks (wtyczka do podglądu landmarków)",
    "Web Developer (rozszerzenie)",
    "Text Spacing Bookmarklet",
    "PAC (sprawdzanie dostępności PDF)",
    "Narzędzia deweloperskie przeglądarki (drzewo dostępności)",
    "Walidator W3C (Nu HTML Checker)",
    "PAC (PDF Accessibility Checker)",
    "Silktide Accessibility Checker",
    "PEAT (analiza błysków)"
  ],
  "assistiveTechnologies": [
    "NVDA z Firefox",
    "NVDA z Chrome",
    "JAWS z Chrome",
    "VoiceOver (macOS) z Safari",
    "VoiceOver (iOS) z Safari",
    "TalkBack (Android) z Chrome",
    "Narrator (Windows)",
    "Lupa systemowa",
    "ZoomText",
    "Powiększanie strony i tekstu w przeglądarce",
    "Sterowanie głosowe (Voice Control / Dragon)",
    "Sterowanie przełącznikiem (Switch Control)",
    "Czytnik ekranu w trybie przeglądania listy nagłówków, linków i przycisków",
    "VoiceOver na macOS z przeglądarką Safari",
    "VoiceOver na iOS z przeglądarką Safari",
    "TalkBack na Androidzie z przeglądarką Chrome",
    "Narrator w Windows z przeglądarką Edge",
    "Lupa systemu Windows",
    "Powiększenie ekranu w macOS",
    "Sterowanie głosowe (Voice Control, Dragon)"
  ],
  "userTesting": [
    "Nie przeprowadzono testów z użytkownikami.",
    "Testy z osobą niewidomą korzystającą z czytnika ekranu",
    "Testy z osobą słabowidzącą korzystającą z powiększenia",
    "Testy z osobą z niepełnosprawnością ruchową korzystającą wyłącznie z klawiatury",
    "Testy z osobą korzystającą ze sterowania głosowego",
    "Testy z osobą niesłyszącą lub słabosłyszącą (napisy, język migowy)",
    "Testy z osobą neuroróżnorodną lub z trudnościami poznawczymi",
    "Testy z osobą starszą",
    "Testy z użytkownikami z niepełnosprawnościami wzroku obejmujące kluczowe ścieżki serwisu",
    "Scenariusze zadaniowe wykonywane przez użytkowników z niepełnosprawnościami",
    "Obserwacje z testów z użytkownikami zostały opisane w zawartości dodatkowej raportu.",
    "Test z udziałem osoby niewidomej korzystającej z czytnika ekranu",
    "Test z udziałem osoby słabowidzącej korzystającej z powiększenia",
    "Test z udziałem osoby z niepełnosprawnością ruchową korzystającej z klawiatury",
    "Test z udziałem osoby z niepełnosprawnością intelektualną",
    "Test z udziałem osoby głuchej"
  ],
  "viewNames": [
    "Strona główna",
    "Kontakt",
    "Deklaracja dostępności",
    "Mapa strony",
    "Wyszukiwarka",
    "Wyniki wyszukiwania",
    "Formularz kontaktowy",
    "Lista produktów",
    "Karta produktu",
    "Koszyk",
    "Proces zakupowy – dane",
    "Proces zakupowy – płatność",
    "Logowanie",
    "Rejestracja",
    "Panel użytkownika",
    "Aktualności",
    "Artykuł",
    "Oferta",
    "Strona kategorii",
    "O nas",
    "FAQ / Najczęściej zadawane pytania",
    "Formularz zapisu na newsletter",
    "Dokument do pobrania (PDF)",
    "Strona z multimediami",
    "Wyszukiwarka i wyniki wyszukiwania",
    "Aktualności — lista",
    "Aktualności — artykuł",
    "Formularz zamówienia",
    "Strona produktu",
    "Polityka prywatności",
    "Strona błędu 404",
    "Dokument PDF do pobrania",
    "Nagranie wideo",
    "Menu nawigacyjne",
    "Stopka",
    "Baner zgody na pliki cookie"
  ],
  "methodology": [
    "Audyt został przeprowadzony przez eksperta ds. dostępności cyfrowej z wykorzystaniem testów automatycznych, testów manualnych oraz technologii asystujących.",
    "Badanie przeprowadzono zgodnie z metodyką WCAG-EM na wybranej próbie reprezentatywnych stron i widoków serwisu.",
    "Testy automatyczne posłużyły do wstępnej identyfikacji problemów, a każdy wynik został zweryfikowany ręcznie przez audytora.",
    "Testy manualne obejmowały nawigację klawiaturą, ocenę widoczności fokusu, strukturę nagłówków i landmarków oraz kontrast.",
    "Testy z technologiami asystującymi wykonano z użyciem czytników ekranu oraz powiększania, aby ocenić realne doświadczenie użytkownika.",
    "Każde kryterium sukcesu na poziomie A i AA zostało ocenione jako spełnione, niespełnione albo niedotyczące badanych treści.",
    "Kryteria poziomu AAA nie były objęte audytem i nie są oceniane w raporcie.",
    "Każdy wykryty problem opisano wraz ze wskazaniem kryterium WCAG, wpływu na użytkowników i rekomendacji naprawczej.",
    "Błędy powtarzające się na wielu stronach opisano przy pierwszym wystąpieniu i pominięto w dalszej części raportu.",
    "Badanie wykonano w co najmniej dwóch środowiskach, obejmujących komputer oraz urządzenie mobilne.",
    "Wyniki testów automatycznych nie stanowią samodzielnej oceny zgodności i zostały uzupełnione analizą ekspercką.",
    "Do oceny błędów zastosowano trzystopniową skalę wpływu na użytkowników: marginalny, ważny i priorytetowy.",
    "Badanie ekspertowe zgodności z kryteriami sukcesu wybranego standardu na reprezentatywnej próbie stron.",
    "Testy manualne z użyciem klawiatury, powiększenia i czytników ekranu.",
    "Testy automatyczne jako uzupełnienie badania ręcznego — wyniki narzędzi zweryfikowano ręcznie.",
    "Dobór próby według metodyki WCAG-EM (W3C): strony kluczowe, typowe szablony i procesy.",
    "Ocena każdego kryterium sukcesu: spełnione, niespełnione albo nie dotyczy."
  ],
  "auditScope": [
    "Zakres audytu obejmuje zestaw pięciu reprezentatywnych stron i widoków serwisu.",
    "Zakres audytu obejmuje zestaw dziesięciu reprezentatywnych stron i widoków serwisu.",
    "Zakres audytu obejmuje zestaw dwudziestu reprezentatywnych stron i widoków serwisu.",
    "Audyt obejmuje stronę główną, kluczowe podstrony oraz formularze i ścieżki wykorzystywane przez użytkowników najczęściej.",
    "Audyt obejmuje pełny proces zakupowy: od listy produktów, przez kartę produktu i koszyk, po podanie danych.",
    "Audyt obejmuje wersję desktopową i mobilną serwisu.",
    "Audyt obejmuje wyłącznie wersję desktopową serwisu.",
    "Zakresem badania objęto elementy interaktywne: menu, wyszukiwarkę, formularze, okna modalne oraz komponenty dynamiczne.",
    "Zakresem badania objęto kryteria sukcesu WCAG 2.1 (lub 2.2) na poziomie A i AA.",
    "Dokumenty do pobrania nie były objęte badaniem.",
    "Multimedia (nagrania i transmisje) nie były objęte badaniem, ponieważ nie występują w badanym zestawie stron.",
    "Audyt nie obejmuje treści zewnętrznych serwisów, do których prowadzą linki.",
    "Audyt określa stan dostępności serwisu na dzień wykonania badania.",
    "Badaniem objęto stronę główną oraz reprezentatywną próbę podstron, w tym wszystkie typowe szablony serwisu.",
    "Zakres obejmuje kluczowe procesy użytkownika, np. wyszukiwanie informacji, wypełnienie formularza i kontakt.",
    "Badanie nie obejmuje treści osadzonych z serwisów zewnętrznych, nad którymi podmiot nie ma kontroli.",
    "Dokumenty do pobrania oceniono na podstawie próby plików opublikowanych na badanych stronach."
  ],
  "mainProblems": [
    "Brak tekstów alternatywnych dla obrazów informacyjnych.",
    "Niepoprawna hierarchia nagłówków, co utrudnia nawigację użytkownikom czytników ekranu.",
    "Problemy z formularzami – brak etykiet, opisów błędów i powiązania komunikatów z polami.",
    "Niewidoczny lub niewystarczająco widoczny wskaźnik fokusu klawiatury.",
    "Niewystarczający kontrast tekstu i elementów interfejsu.",
    "Brak mechanizmów pomijania powtarzanych bloków treści (skip linków).",
    "Brak punktów orientacyjnych (landmarków) lub ich niepoprawne zastosowanie.",
    "Niedostępny tekst w postaci grafik na banerach.",
    "Brak możliwości zatrzymania rotujących banerów i karuzeli.",
    "Brak unikatowych tytułów stron.",
    "Niejednoznaczne nazwy dostępne przycisków i linków (np. wielokrotne „Czytaj więcej”).",
    "Elementy interaktywne niedostępne z poziomu klawiatury.",
    "Brak komunikatów o stanie dla technologii asystujących (np. dynamiczne zmiany treści).",
    "Niepoprawna lub brakująca nazwa, rola i wartość komponentów niestandardowych.",
    "Treść wyświetlana po najechaniu kursorem lub fokusie niedostępna dla klawiatury i czytnika ekranu.",
    "Fokus nie jest poprawnie zarządzany w oknach modalnych i wyskakujących.",
    "Brak możliwości powiększenia tekstu lub treść traci funkcjonalność po powiększeniu.",
    "Pola formularzy bez zdefiniowanego przeznaczenia (autouzupełniania).",
    "Elementy interaktywne niedostępne z klawiatury",
    "Brak widocznego fokusu",
    "Obrazy informacyjne bez tekstów alternatywnych",
    "Pola formularzy bez etykiet i bez opisanych komunikatów o błędach",
    "Nieprawidłowa struktura nagłówków",
    "Przyciski i linki bez dostępnych nazw",
    "Treść nie dopasowuje się do ekranu przy powiększeniu",
    "Multimedia bez napisów"
  ],
  "recommendedActions": [
    "Uzupełnienie atrybutów alt dla obrazów i poprawa ich opisów.",
    "Korekta struktury nagłówków (h1–h6).",
    "Dodanie komunikatów błędów w formularzach i poprawa obsługi fokusu.",
    "Opracowanie skip linków dla kluczowych elementów serwisu.",
    "Dodanie etykiet do wszystkich pól formularzy i powiązanie ich z polami.",
    "Powiązanie komunikatów błędów z polami formularza programowo.",
    "Poprawa kontrastu tekstu i elementów interaktywnych do wymaganych wartości.",
    "Przywrócenie i wyraźne wyróżnienie widocznego wskaźnika fokusu.",
    "Dodanie elementu do pauzowania rotujących banerów i karuzel.",
    "Dodanie unikatowych tytułów stron.",
    "Poprawa sposobu dodawania tekstu do banerów (tekst zamiast grafiki).",
    "Nadanie jednoznacznych nazw dostępnych przyciskom i linkom.",
    "Zapewnienie obsługi wszystkich funkcji z poziomu klawiatury.",
    "Zastosowanie landmarków HTML5 i atrybutów ARIA tam, gdzie to konieczne.",
    "Dodanie komunikatów o stanie (aria-live) dla dynamicznych zmian treści.",
    "Poprawa zarządzania fokusem w oknach modalnych.",
    "Przetestowanie poprawek z czytnikiem ekranu po wdrożeniu.",
    "Wykonanie reaudytu po wprowadzeniu poprawek.",
    "Uwzględnienie wymagań dostępności w procesie projektowania i wdrażania nowych treści.",
    "Aktualizacja deklaracji dostępności po usunięciu błędów.",
    "Poprawić wspólne szablony serwisu — jedna zmiana usunie błędy na wielu podstronach.",
    "Zapewnić pełną obsługę klawiaturą i widoczny fokus wszystkich elementów interaktywnych.",
    "Dostosować paletę kolorów do wymagań kontrastu.",
    "Uzupełnić teksty alternatywne i przeszkolić redaktorów w ich pisaniu.",
    "Poprawić formularze: etykiety, instrukcje i komunikaty o błędach.",
    "Wprowadzić testy dostępności do procesu wytwarzania i publikacji treści.",
    "Zaktualizować deklarację dostępności po wprowadzeniu poprawek.",
    "Przeprowadzić audyt ponowny po wdrożeniu poprawek."
  ],
  "finalRecommendation": [
    "Konieczne poprawki przed uzyskaniem certyfikacji.",
    "Zalecamy usunięcie błędów priorytetowych i ważnych, a następnie wykonanie reaudytu.",
    "Serwis spełnia wymagania WCAG na poziomie AA. Zalecamy bieżące monitorowanie dostępności przy publikacji nowych treści.",
    "Serwis jest częściowo zgodny z WCAG. Po wdrożeniu poprawek rekomendujemy ponowny audyt w celu potwierdzenia zgodności.",
    "Serwis nie spełnia wymagań WCAG na poziomie AA. Rekomendujemy wdrożenie zmian zgodnie z priorytetami opisanymi w raporcie.",
    "Serwis wymaga poprawek przed uznaniem go za zgodny z wymaganiami. W pierwszej kolejności należy usunąć problemy z priorytetem 1, które blokują lub istotnie utrudniają korzystanie z kluczowych funkcji.",
    "Większość problemów wynika ze wspólnych elementów szablonu, dlatego ich poprawienie przyniesie efekt na całym serwisie przy stosunkowo niewielkim nakładzie pracy.",
    "Po wdrożeniu poprawek rekomendujemy audyt ponowny, aby potwierdzić skuteczność zmian i zaktualizować deklarację dostępności."
  ],
  "disclaimers": [
    "Audyt określa stan dostępności serwisu na dzień wykonania badania. Za błędy powstałe po dacie audytu audytor nie odpowiada.",
    "Raport nie stanowi certyfikacji dostępności ani deklaracji dostępności.",
    "Badanie objęło wybrane strony i widoki, a nie cały serwis.",
    "Wersja mobilna nie była objęta badaniem.",
    "Dokumenty do pobrania i multimedia nie były objęte badaniem.",
    "Kryteria poziomu AAA nie były objęte audytem.",
    "Wyniki testów automatycznych nie zastępują oceny eksperckiej i zostały zweryfikowane ręcznie.",
    "Procent zgodności został obliczony wyłącznie na podstawie przebadanych kryteriów sukcesu.",
    "Nie przeprowadzono testów z użytkownikami z niepełnosprawnościami.",
    "Reaudyt nie został wykonany.",
    "Opisane błędy nie stanowią listy wyczerpującej – po poprawkach należy sprawdzić pozostałe wystąpienia tego samego problemu w serwisie.",
    "Dokument ma charakter roboczy i wymaga zatwierdzenia audytora."
  ]
};

export const ENVIRONMENT_PRESETS = [
  {
    "device": "Laptop",
    "operatingSystem": "macOS",
    "browser": "Chrome",
    "assistiveTechnology": "VoiceOver",
    "viewport": "Pulpit (pełny ekran)"
  },
  {
    "device": "Laptop",
    "operatingSystem": "macOS",
    "browser": "Safari",
    "assistiveTechnology": "VoiceOver",
    "viewport": "Pulpit (pełny ekran)"
  },
  {
    "device": "Laptop",
    "operatingSystem": "Windows",
    "browser": "Firefox",
    "assistiveTechnology": "NVDA",
    "viewport": "Pulpit (pełny ekran)"
  },
  {
    "device": "Laptop",
    "operatingSystem": "Windows",
    "browser": "Chrome",
    "assistiveTechnology": "NVDA",
    "viewport": "Pulpit (pełny ekran)"
  },
  {
    "device": "Laptop",
    "operatingSystem": "Windows",
    "browser": "Edge",
    "assistiveTechnology": "Narrator",
    "viewport": "Pulpit (pełny ekran)"
  },
  {
    "device": "Laptop",
    "operatingSystem": "Windows",
    "browser": "Chrome",
    "assistiveTechnology": "JAWS",
    "viewport": "Pulpit (pełny ekran)"
  },
  {
    "device": "Laptop",
    "operatingSystem": "Windows",
    "browser": "Chrome",
    "assistiveTechnology": "Powiększenie przeglądarki do 200% i 400%",
    "viewport": "1280 px, po powiększeniu odpowiednik 320 px"
  },
  {
    "device": "Smartfon",
    "operatingSystem": "iOS",
    "browser": "Safari",
    "assistiveTechnology": "VoiceOver",
    "viewport": "Widok mobilny (pionowy)"
  },
  {
    "device": "Smartfon",
    "operatingSystem": "Android",
    "browser": "Chrome",
    "assistiveTechnology": "TalkBack",
    "viewport": "Widok mobilny (pionowy)"
  },
  {
    "device": "Smartfon",
    "operatingSystem": "Android",
    "browser": "Chrome",
    "assistiveTechnology": "Brak",
    "viewport": "Widok mobilny (poziomy)"
  },
  {
    "device": "Tablet",
    "operatingSystem": "iPadOS",
    "browser": "Safari",
    "assistiveTechnology": "VoiceOver",
    "viewport": "Widok tabletowy"
  },
  {
    "device": "Komputer stacjonarny",
    "operatingSystem": "Windows",
    "browser": "Chrome",
    "assistiveTechnology": "Brak (klawiatura i mysz)",
    "viewport": "Pulpit (pełny ekran)"
  },
  {
    "device": "Laptop",
    "operatingSystem": "Windows 11",
    "browser": "Firefox",
    "assistiveTechnology": "NVDA",
    "viewport": "1920 × 1080"
  },
  {
    "device": "Laptop",
    "operatingSystem": "Windows 11",
    "browser": "Chrome",
    "assistiveTechnology": "JAWS",
    "viewport": "1920 × 1080"
  },
  {
    "device": "MacBook",
    "operatingSystem": "macOS",
    "browser": "Safari",
    "assistiveTechnology": "VoiceOver",
    "viewport": "1440 × 900"
  },
  {
    "device": "iPhone",
    "operatingSystem": "iOS",
    "browser": "Safari",
    "assistiveTechnology": "VoiceOver",
    "viewport": "390 × 844"
  },
  {
    "device": "Smartfon z Androidem",
    "operatingSystem": "Android",
    "browser": "Chrome",
    "assistiveTechnology": "TalkBack",
    "viewport": "412 × 915"
  },
  {
    "device": "Laptop",
    "operatingSystem": "Windows 11",
    "browser": "Chrome",
    "assistiveTechnology": "Nie dotyczy (klawiatura, powiększenie 400%)",
    "viewport": "1280 × 1024, powiększenie 400%"
  }
];

Object.assign(SUGGESTIONS, {
  envDevice: ["Komputer stacjonarny", "Laptop", "MacBook", "Tablet", "iPad", "iPhone", "Smartfon z Androidem"],
  envOS: ["Windows 11", "Windows 10", "macOS", "iOS", "iPadOS", "Android", "Linux"],
  envBrowser: ["Google Chrome", "Mozilla Firefox", "Microsoft Edge", "Safari", "Opera", "Samsung Internet"],
  envAT: ["NVDA", "JAWS", "VoiceOver", "TalkBack", "Narrator", "Lupa systemowa", "ZoomText", "Sterowanie głosowe", "Nie dotyczy"],
  envViewport: ["1920 × 1080", "1366 × 768", "1280 × 1024, powiększenie 400% (320 px)", "390 × 844 (pionowo)", "844 × 390 (poziomo)", "768 × 1024"],
  excludedElements: [
    "Treści osadzone z serwisów zewnętrznych (np. mapy, filmy z platform wideo, media społecznościowe), nad którymi podmiot nie ma kontroli.",
    "Archiwalne treści opublikowane przed wejściem w życie obowiązku dostępności.",
    "Część serwisu dostępna po zalogowaniu.",
    "Dokumenty do pobrania spoza wybranej próby.",
    "Aplikacje mobilne podmiotu.",
  ],
  limitations: [
    "Badanie przeprowadzono na wersji produkcyjnej serwisu; treści mogły się zmieniać w trakcie badania.",
    "Nie było dostępu do konta testowego, dlatego nie zbadano procesów po zalogowaniu.",
    "Ocena dotyczy wybranej próby stron — wyniki mogą nie obejmować wszystkich problemów serwisu.",
    "Nie przeprowadzono testów z udziałem użytkowników z niepełnosprawnościami.",
    "Testy automatyczne wykrywają tylko część problemów; ich wyniki zweryfikowano ręcznie.",
  ],
});

SUGGESTIONS.executiveSummary = [
  "Serwis wymaga poprawek, zanim będzie można uznać go za dostępny dla wszystkich użytkowników.",
  "Większość problemów wynika ze wspólnych elementów szablonu — ich poprawienie usunie błędy na wielu podstronach jednocześnie.",
  "Problemy z priorytetem 1 utrudniają lub uniemożliwiają osobom z niepełnosprawnościami korzystanie z kluczowych funkcji serwisu, dlatego rekomendujemy ich usunięcie w pierwszej kolejności.",
  "Po wdrożeniu poprawek rekomendujemy audyt ponowny oraz aktualizację deklaracji dostępności.",
  "Serwis spełnia większość wymagań; wskazane problemy mają charakter punktowy i można je usunąć w krótkim czasie.",
];
