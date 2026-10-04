// Biblioteka klocków: gotowe opisy typowych problemów i rozwiązań, do wstawienia i poprawienia.
// Każdy klocek to punkt wyjścia — audytor dopasowuje go do badanego serwisu.
//
// Struktura klocka problemu:
//   id, criteria[], title, description, userImpact, severity,
//   fixes: [{ label, text, code? }]  — rozwiązania do składania w rekomendację

export const FIELD_HINTS = {
  title: {
    tip: "Nazwij, co jest nie tak i gdzie. Krótko, bez numeru kryterium.",
    example: "Pola formularza kontaktowego nie mają etykiet",
  },
  description: {
    tip: "Opisz, co dokładnie widzisz: który element, w jakim miejscu, w jakim stanie. Pisz o faktach, które da się sprawdzić.",
    example: "W formularzu „Napisz do nas” pola „Imię”, „E-mail” i „Wiadomość” mają tylko tekst zastępczy (placeholder). Po wpisaniu znaku tekst znika i nie ma etykiety powiązanej z polem.",
  },
  stepsToReproduce: {
    tip: "Kroki, po których programista zobaczy ten sam problem. Jeden krok w wierszu.",
    example: "Otwórz stronę Kontakt\nPrzejdź klawiszem Tab do pola „E-mail”\nWłącz czytnik ekranu i posłuchaj, jak ogłasza pole",
  },
  userImpact: {
    tip: "Kto ma problem i co nie może zrobić. Nazwij konkretną grupę użytkowników i skutek.",
    example: "Osoba niewidoma korzystająca z czytnika ekranu słyszy tylko „pole edycji” i nie wie, co wpisać. Osoba z trudnościami z pamięcią po wpisaniu pierwszego znaku traci informację, czego dotyczy pole.",
  },
  recommendation: {
    tip: "Jeden punkt w wierszu — w raporcie powstanie lista kroków. Pisz rzeczowo: „Dodać…”, „Zapewnić…”. Złóż ją z gotowych rozwiązań poniżej i dopasuj.",
    example: "Dodaj do każdego pola widoczną etykietę <label> powiązaną atrybutem for z identyfikatorem pola.",
  },
  evidence: {
    tip: "Dowód, który pozwoli wrócić do problemu: selektor, zmierzona wartość, nazwa narzędzia, zrzut ekranu.",
    example: "form#kontakt input[name=email] — brak elementu label i atrybutów aria-label/aria-labelledby (sprawdzone w DevTools, 01.10.2026).",
  },
};

export const SEVERITY_HINT = "Priorytet 1 — do naprawy w pierwszej kolejności. Priorytet 2 — w drugiej kolejności. Priorytet 3 — na końcu (rekomendacje).";

// Klocki opracowane na podstawie raportów z audytów Accessibility First i kursantów (uogólnione,
// bez danych klientów). alsoConsider — kryteria, które dochodzą zależnie od przypadku.
export const ISSUE_BLOCKS = [
  {
    "id": "img-alt-missing",
    "keywords": [
      "obraz",
      "obrazek",
      "grafika",
      "zdjęcie",
      "alt",
      "brak altu",
      "tekst alternatywny",
      "img",
      "wykres",
      "infografika",
      "mapa",
      "baner",
      "logo",
      "obraz w dokumencie"
    ],
    "criteria": [
      "1.1.1"
    ],
    "severity": "Priorytet 1",
    "title": "Obraz informacyjny bez tekstu alternatywnego",
    "description": "Obraz przekazuje informację, której nie ma w otaczającym tekście (np. zdjęcie, wykres, mapa, baner z informacją), ale nie ma atrybutu alt albo alt jest pusty lub zawiera nazwę pliku. Dotyczy: [wpisz miejsca, np. sekcja Aktualności, galeria, wykresy].",
    "userImpact": "Osoby niewidome i korzystające z czytnika ekranu nie dostają informacji zawartej w obrazie albo słyszą tylko nazwę pliku. Ta sama informacja nie dociera do osób, którym obrazy się nie wczytały.",
    "fixes": [
      {
        "label": "Opisowy alt",
        "text": "Dodaj atrybut alt, który przekazuje tę samą informację co obraz — krótko i w kontekście strony. Jeśli obraz jest linkiem, alt ma opisywać cel linku.",
        "code": {
          "language": "html",
          "code": "<img src=\"wykres.png\" alt=\"Liczba zgłoszeń wzrosła z 120 w styczniu do 340 w czerwcu\">"
        }
      },
      {
        "label": "Wykres i infografika",
        "text": "Dla złożonych grafik dodaj krótki alt (co przedstawia i jakiego typu jest to grafika) oraz pełne dane w treści strony lub w dostępnej tabeli tuż obok."
      },
      {
        "label": "Obrazy w dokumentach",
        "text": "W dokumentach Word i PDF dodaj tekst alternatywny w edytorze (w Wordzie: prawy przycisk na obrazie, Wyświetl tekst alternatywny), zanim wygenerujesz PDF."
      }
    ]
  },
  {
    "id": "img-decorative-alt",
    "keywords": [
      "obraz",
      "dekoracyjny",
      "ozdobnik",
      "alt",
      "pusty alt",
      "ikona",
      "tło",
      "grafika bez etykiety",
      "powtórzony alt",
      "alt ze spacją"
    ],
    "criteria": [
      "1.1.1"
    ],
    "severity": "Priorytet 3",
    "title": "Obraz dekoracyjny jest ogłaszany przez czytnik ekranu",
    "description": "Obraz pełni wyłącznie funkcję ozdobną albo powtarza tekst obok, ale ma niepusty tekst alternatywny (np. powtórzony tytuł artykułu), alt zawierający tylko spację lub nie ma atrybutu alt. Czytnik ogłasza wtedy „grafika” albo „grafika bez etykiety”.",
    "userImpact": "Osoba korzystająca z czytnika ekranu słyszy zbędne lub powtarzające się informacje, które wydłużają i utrudniają przeglądanie strony.",
    "fixes": [
      {
        "label": "Pusty alt",
        "text": "Nadaj obrazowi pusty atrybut alt (bez spacji) i usuń zbędny atrybut title, aby technologie asystujące go pominęły.",
        "code": {
          "language": "html",
          "code": "<img src=\"ozdobnik.svg\" alt=\"\">"
        }
      },
      {
        "label": "Ikona obok opisu",
        "text": "Jeśli ikona stoi obok tekstu, który już opisuje funkcję (np. kafel z nazwą usługi), oznacz ikonę jako dekoracyjną.",
        "code": {
          "language": "html",
          "code": "<img src=\"ikona-telefon.svg\" alt=\"\">\n<span>Zadzwoń do nas</span>"
        }
      },
      {
        "label": "Grafika w CSS",
        "text": "Czysto wizualne elementy przenieś do tła w CSS."
      }
    ]
  },
  {
    "id": "link-image-name",
    "keywords": [
      "link",
      "obraz w linku",
      "logo",
      "ikona",
      "social media",
      "facebook",
      "instagram",
      "bez nazwy",
      "pusty link",
      "ikona czcionkowa",
      "svg"
    ],
    "criteria": [
      "1.1.1",
      "2.4.4",
      "4.1.2"
    ],
    "alsoConsider": [
      "2.5.3"
    ],
    "severity": "Priorytet 1",
    "title": "Link zawierający tylko obraz lub ikonę nie ma nazwy dostępnej",
    "description": "Link zawiera wyłącznie obraz lub ikonę (np. logo, ikony mediów społecznościowych, grafikę z mapą) bez tekstu alternatywnego, nazwy aria-label ani tekstu ukrytego wizualnie, więc link nie ma nazwy dostępnej. Atrybut title nie jest wystarczającym źródłem nazwy.",
    "userImpact": "Osoba korzystająca z czytnika ekranu słyszy tylko „link” albo adres URL i nie wie, dokąd link prowadzi. Osoba sterująca głosem nie może go wywołać nazwą.",
    "fixes": [
      {
        "label": "Alt opisuje cel linku",
        "text": "Nadaj obrazowi w linku alt opisujący cel linku, a nie wygląd obrazu.",
        "code": {
          "language": "html",
          "code": "<a href=\"/\"><img src=\"logo.svg\" alt=\"Urząd Miasta — strona główna\"></a>"
        }
      },
      {
        "label": "Ikona czcionkowa lub SVG",
        "text": "Dla ikony bez obrazu dodaj nazwę dostępną przez aria-label albo tekst ukryty wizualnie, a ikonę ukryj przed czytnikiem.",
        "code": {
          "language": "html",
          "code": "<a href=\"https://www.facebook.com/przyklad\" aria-label=\"Facebook (otwiera się w nowej karcie)\" target=\"_blank\" rel=\"noopener\">\n  <i class=\"fab fa-facebook-f\" aria-hidden=\"true\"></i>\n</a>"
        }
      }
    ]
  },
  {
    "id": "headings-structure",
    "keywords": [
      "nagłówki",
      "h1",
      "h2",
      "h3",
      "hierarchia",
      "struktura",
      "przeskok poziomów",
      "kolejność nagłówków",
      "role heading",
      "dwa h2",
      "brak h1"
    ],
    "criteria": [
      "1.3.1",
      "2.4.6"
    ],
    "severity": "Priorytet 2",
    "title": "Hierarchia nagłówków nie odpowiada strukturze treści",
    "description": "Poziomy nagłówków nie odzwierciedlają struktury treści: pominięto poziomy (np. po h1 od razu h5), nagłówek niższego poziomu występuje przed wyższym, tytuły elementów podrzędnych (np. artykułów) mają ten sam poziom co nagłówek sekcji, brakuje nagłówka h1 albo tekst wyglądający jak nagłówek nie jest oznaczony jako nagłówek. Opisz konkretnie: [wpisz, które nagłówki i na jakich stronach].",
    "userImpact": "Osoba korzystająca z czytnika ekranu, która przegląda stronę po nagłówkach, dostaje fałszywy obraz hierarchii (np. sekcja wygląda na pustą, a pozycje na równorzędne z jej tytułem) i trudniej znajduje potrzebną treść.",
    "fixes": [
      {
        "label": "Poziomy bez przeskoków",
        "text": "Ustaw poziomy nagłówków zgodnie ze strukturą treści: jeden h1, pod nim h2, pod nimi h3. Wygląd nadaj w CSS, niezależnie od poziomu.",
        "code": {
          "language": "html",
          "code": "<h2>Aktualności</h2>\n<h3>Początek roku szkolnego</h3>\n<h3>Zebranie rodziców</h3>"
        }
      },
      {
        "label": "Oznaczyć nagłówki",
        "text": "Teksty pełniące funkcję nagłówków oznacz elementami h1–h6 zamiast pogrubionych akapitów lub div z klasą.",
        "code": {
          "language": "html",
          "code": "<h2>Nasze usługi</h2>"
        }
      },
      {
        "label": "Bez nakładania ARIA na nagłówki",
        "text": "Nie dodawaj role=\"heading\" i aria-level do elementów, które już są nagłówkami — powoduje to powielenie nagłówka. Zastąp kontenery div semantycznymi h1–h6."
      }
    ]
  },
  {
    "id": "form-labels",
    "keywords": [
      "formularz",
      "pole",
      "etykieta",
      "label",
      "placeholder",
      "input",
      "brak etykiety",
      "wyszukiwarka",
      "kod rabatowy",
      "pole tekstowe",
      "for",
      "id"
    ],
    "criteria": [
      "1.3.1",
      "3.3.2",
      "4.1.2"
    ],
    "alsoConsider": [
      "2.4.6",
      "2.5.3"
    ],
    "severity": "Priorytet 1",
    "title": "Pole formularza nie ma etykiety",
    "description": "Pole formularza nie ma widocznej etykiety powiązanej programowo z polem. Rolę etykiety pełni tylko tekst zastępczy (placeholder), tekst obok pola bez powiązania (label bez for), albo pole nie ma żadnej nazwy (np. wyszukiwarka, kod rabatowy). Dotyczy: [wpisz pola i widoki].",
    "userImpact": "Osoba niewidoma słyszy samo „pole edycji” i nie wie, co wpisać. Tekst zastępczy znika po wpisaniu znaku, co utrudnia wypełnianie osobom z trudnościami z pamięcią i koncentracją, a osoba sterująca głosem nie może pola wywołać nazwą.",
    "fixes": [
      {
        "label": "Etykieta label",
        "text": "Dodaj do każdego pola widoczną etykietę label powiązaną z polem atrybutem for (wartość for = id pola). Etykieta ma stać poza obszarem pola.",
        "code": {
          "language": "html",
          "code": "<label for=\"email\">Adres e-mail</label>\n<input id=\"email\" type=\"email\" autocomplete=\"email\">"
        }
      },
      {
        "label": "Pole bez widocznej etykiety",
        "text": "Gdy projekt nie przewiduje widocznego tekstu (np. wyszukiwarka z ikoną lupy), nadaj polu nazwę przez aria-label lub label ukryty wizualnie, a przy przycisku dodaj tekst „Szukaj”.",
        "code": {
          "language": "html",
          "code": "<label for=\"q\" class=\"visually-hidden\">Szukaj w serwisie</label>\n<input id=\"q\" type=\"search\">"
        }
      },
      {
        "label": "Grupa pól",
        "text": "Grupy powiązanych pól (np. przyciski opcji) otocz elementem fieldset z legend."
      }
    ]
  },
  {
    "id": "table-headers",
    "keywords": [
      "tabela",
      "nagłówki tabeli",
      "th",
      "scope",
      "caption",
      "komórki",
      "thead",
      "tabela układowa",
      "kursy walut"
    ],
    "criteria": [
      "1.3.1"
    ],
    "alsoConsider": [
      "1.3.2"
    ],
    "severity": "Priorytet 2",
    "title": "Tabela z danymi nie ma oznaczonych nagłówków",
    "description": "Tabela prezentuje dane, ale komórki nagłówkowe są zwykłymi komórkami td, brakuje wiersza nagłówków (thead) oraz podpisu tabeli (caption). Tabela bywa też użyta tylko do ułożenia treści.",
    "userImpact": "Osoba korzystająca z czytnika ekranu przy przechodzeniu między komórkami nie słyszy, której kolumny i którego wiersza dotyczy wartość, ani czego dotyczy cała tabela.",
    "fixes": [
      {
        "label": "th, scope i caption",
        "text": "Oznacz komórki nagłówkowe elementem th z atrybutem scope, a tabeli nadaj podpis caption.",
        "code": {
          "language": "html",
          "code": "<table>\n  <caption>Godziny otwarcia</caption>\n  <thead><tr><th scope=\"col\">Dzień</th><th scope=\"col\">Godziny</th></tr></thead>\n  <tbody><tr><td>Poniedziałek</td><td>8:00–16:00</td></tr></tbody>\n</table>"
        }
      },
      {
        "label": "Zrezygnować z tabeli",
        "text": "Jeśli dane nie są prawdziwą tabelą (np. krótka lista), zastąp ją listą lub zwykłym tekstem."
      }
    ]
  },
  {
    "id": "contrast-text",
    "keywords": [
      "kontrast",
      "tekst",
      "kolor",
      "czytelność",
      "szary",
      "jasny",
      "4,5:1",
      "link w stopce",
      "newsletter"
    ],
    "criteria": [
      "1.4.3"
    ],
    "severity": "Priorytet 1",
    "title": "Za niski kontrast tekstu",
    "description": "Kontrast koloru tekstu względem tła jest niższy niż 4,5:1 dla tekstu zwykłego (3:1 dla tekstu dużego). Zmierzona wartość: [wpisz, np. 2,9:1]. Dotyczy: [wpisz elementy, np. linki w stopce, teksty w formularzu].",
    "userImpact": "Osoby słabowidzące, starsze i korzystające z ekranu w silnym świetle mają trudność z odczytaniem tekstu albo nie odczytują go wcale.",
    "fixes": [
      {
        "label": "Ciemniejszy kolor tekstu",
        "text": "Zmień kolor tekstu lub tła tak, aby kontrast wynosił co najmniej 4,5:1 (3:1 dla tekstu od 24 px lub 18,66 px pogrubionego).",
        "code": {
          "language": "css",
          "code": ".lead { color: #595959; } /* 7:1 na białym tle */"
        }
      },
      {
        "label": "Sprawdzać już w projekcie",
        "text": "Zweryfikuj pary kolorów w palecie projektu narzędziem do pomiaru kontrastu (np. Colour Contrast Analyser), zanim trafią do komponentów."
      }
    ]
  },
  {
    "id": "contrast-ui",
    "keywords": [
      "kontrast",
      "obramowanie",
      "ikona",
      "pole",
      "przycisk",
      "element interfejsu",
      "3:1",
      "strzałki",
      "kontrolki slidera"
    ],
    "criteria": [
      "1.4.11"
    ],
    "severity": "Priorytet 2",
    "title": "Za niski kontrast elementów interfejsu",
    "description": "Obramowanie pól formularza, ikony, strzałki karuzeli lub wskaźnik stanu mają kontrast niższy niż 3:1 względem sąsiadujących kolorów. Zmierzona wartość: [wpisz, np. 1,36:1].",
    "userImpact": "Osoby słabowidzące nie widzą, gdzie jest pole formularza, przycisk, element sterujący albo zaznaczona opcja.",
    "fixes": [
      {
        "label": "Kontrast 3:1",
        "text": "Zwiększ kontrast obramowań, ikon i wskaźników stanu do co najmniej 3:1 względem przylegającego tła.",
        "code": {
          "language": "css",
          "code": "input { border: 2px solid #767676; }"
        }
      },
      {
        "label": "Kontrolki na obrazie",
        "text": "Dla elementów sterujących nałożonych na zmieniające się zdjęcia dodaj jednolite, kontrastowe tło lub obwiednię."
      }
    ]
  },
  {
    "id": "link-color-only",
    "keywords": [
      "link",
      "kolor",
      "podkreślenie",
      "wyróżnienie",
      "odnośnik",
      "czerwony link",
      "nierozróżnianie barw"
    ],
    "criteria": [
      "1.4.1"
    ],
    "alsoConsider": [
      "3.2.4"
    ],
    "severity": "Priorytet 2",
    "title": "Linki w tekście wyróżnione tylko kolorem",
    "description": "Linki w akapitach różnią się od otaczającego tekstu wyłącznie kolorem, bez podkreślenia, a kontrast między kolorem linku i tekstu jest niższy niż 3:1.",
    "userImpact": "Osoby nierozróżniające kolorów i słabowidzące nie wiedzą, które słowa są linkami.",
    "fixes": [
      {
        "label": "Podkreślenie",
        "text": "Podkreśl linki w treści albo dodaj inny wyróżnik niezależny od koloru.",
        "code": {
          "language": "css",
          "code": "main p a { text-decoration: underline; }"
        }
      }
    ]
  },
  {
    "id": "reflow",
    "keywords": [
      "powiększenie",
      "zoom",
      "400%",
      "320",
      "przewijanie poziome",
      "responsywność",
      "mobilny",
      "reflow",
      "tabela",
      "menu wychodzi poza ekran"
    ],
    "criteria": [
      "1.4.10"
    ],
    "severity": "Priorytet 1",
    "title": "Treść wymaga przewijania w poziomie przy szerokości 320 px",
    "description": "Przy szerokości okna 320 px (odpowiada powiększeniu 400%) część treści (np. menu, tabele) wychodzi poza ekran i trzeba przewijać stronę w poziomie. Dotyczy: [wpisz elementy].",
    "userImpact": "Osoby słabowidzące, które powiększają stronę, muszą przewijać każdy wiersz tekstu w dwóch kierunkach, co bardzo spowalnia czytanie i grozi pominięciem treści.",
    "fixes": [
      {
        "label": "Elastyczny układ",
        "text": "Zastąp stałe szerokości elastycznym układem (procenty, max-width, flex-wrap, grid z minmax) i sprawdź stronę przy 320 px. Menu zwiń do przycisku (hamburger) dostępnego z klawiatury."
      },
      {
        "label": "Szerokie tabele",
        "text": "Szerokie tabele umieść w kontenerze z przewijaniem tylko tej tabeli, dostępnym z klawiatury, albo zamień na listę.",
        "code": {
          "language": "html",
          "code": "<div class=\"tabela-przewijana\" tabindex=\"0\" role=\"region\" aria-label=\"Harmonogram wywozu odpadów\">\n  <table>…</table>\n</div>"
        }
      }
    ]
  },
  {
    "id": "keyboard-not-operable",
    "keywords": [
      "klawiatura",
      "tab",
      "div",
      "onclick",
      "niedostępny z klawiatury",
      "przycisk",
      "span",
      "tabindex -1",
      "menu",
      "odtwarzacz",
      "wyślij"
    ],
    "criteria": [
      "2.1.1",
      "4.1.2"
    ],
    "severity": "Priorytet 1",
    "title": "Element interaktywny nie działa z klawiatury",
    "description": "Element pełniący funkcję przycisku, linku lub kontrolki (np. rozwijane menu, przycisk „Szukaj”/„Zamknij”, odtwarzacz wideo) jest zbudowany z div lub span z obsługą kliknięcia myszą albo ma tabindex=\"-1\"; nie da się do niego przejść klawiszem Tab ani go uruchomić. Dotyczy: [wpisz elementy].",
    "userImpact": "Osoby korzystające wyłącznie z klawiatury, czytnika ekranu lub urządzeń sterujących nie mogą skorzystać z funkcji.",
    "fixes": [
      {
        "label": "Natywny przycisk",
        "text": "Zastąp element natywnym przyciskiem button lub linkiem a z atrybutem href — obsługa klawiatury i rola są wtedy wbudowane.",
        "code": {
          "language": "html",
          "code": "<button type=\"button\" aria-expanded=\"false\" aria-controls=\"menu\">Menu</button>"
        }
      },
      {
        "label": "Usunąć tabindex=-1",
        "text": "Nie usuwaj z kolejności tabulacji elementów, które są widoczne i aktywne. Odtwarzacz i kontrolki muszą być obsługiwalne klawiaturą."
      }
    ]
  },
  {
    "id": "keyboard-trap",
    "keywords": [
      "pułapka",
      "klawiatura",
      "modal",
      "okno",
      "odtwarzacz",
      "iframe",
      "utknął",
      "brak przycisku zamknij",
      "escape"
    ],
    "criteria": [
      "2.1.2"
    ],
    "alsoConsider": [
      "2.4.3"
    ],
    "severity": "Priorytet 1",
    "title": "Pułapka na klawiaturę",
    "description": "Po przejściu klawiaturą do komponentu (np. okna modalnego, osadzonego odtwarzacza) nie da się go opuścić klawiszem Tab ani Escape; okno nie ma przycisku zamknięcia dostępnego z klawiatury. Dotyczy: [wpisz komponent i stronę].",
    "userImpact": "Osoba korzystająca z klawiatury utyka w komponencie i nie może korzystać z reszty strony bez przeładowania.",
    "fixes": [
      {
        "label": "Wyjście klawiaturą",
        "text": "Zapewnij wyjście z komponentu klawiszem Tab lub Escape; dodaj widoczny przycisk zamknięcia dostępny z klawiatury. W oknach modalnych po zamknięciu przywróć fokus na element, który je otworzył."
      }
    ]
  },
  {
    "id": "skip-link",
    "keywords": [
      "pomiń",
      "przejdź do treści",
      "skip",
      "skip link",
      "nawigacja",
      "menu",
      "landmarki",
      "karuzele produktowe"
    ],
    "criteria": [
      "2.4.1"
    ],
    "severity": "Priorytet 2",
    "title": "Brak możliwości pominięcia powtarzających się bloków",
    "description": "Strona nie ma linku „Przejdź do treści” ani punktów orientacyjnych pozwalających pominąć nagłówek, menu, wyszukiwarkę i powtarzające się sekcje (np. karuzele produktowe).",
    "userImpact": "Osoba korzystająca z klawiatury musi na każdej podstronie przejść przez wszystkie linki menu, zanim dotrze do treści.",
    "fixes": [
      {
        "label": "Link do treści",
        "text": "Dodaj jako pierwszy element strony link prowadzący do głównej treści, widoczny po otrzymaniu fokusu.",
        "code": {
          "language": "html",
          "code": "<a class=\"skip-link\" href=\"#main\">Przejdź do treści</a>\n<main id=\"main\" tabindex=\"-1\">…</main>"
        }
      },
      {
        "label": "Punkty orientacyjne",
        "text": "Oznacz obszary strony elementami header, nav, main i footer."
      }
    ]
  },
  {
    "id": "page-title",
    "keywords": [
      "tytuł strony",
      "title",
      "karta",
      "ten sam tytuł",
      "tytuł formularza"
    ],
    "criteria": [
      "2.4.2"
    ],
    "severity": "Priorytet 2",
    "title": "Tytuły stron nie opisują ich treści",
    "description": "Wszystkie podstrony mają ten sam tytuł (element title), tytuł nie mówi, czego dotyczy strona, albo kolejne kroki formularza mają ten sam tytuł. Jeśli tytuły są unikalne i opisowe, kryterium jest spełnione — wzorzec „Temat — Serwis” jest wtedy tylko rekomendacją.",
    "userImpact": "Osoby korzystające z czytnika ekranu i osoby z wieloma otwartymi kartami nie wiedzą, na której stronie są.",
    "fixes": [
      {
        "label": "Unikalny tytuł",
        "text": "Nadaj każdej stronie unikalny tytuł: najpierw nazwa strony, potem nazwa serwisu.",
        "code": {
          "language": "html",
          "code": "<title>Kontakt — Urząd Miasta Przykładowo</title>"
        }
      }
    ]
  },
  {
    "id": "focus-order",
    "keywords": [
      "kolejność fokusu",
      "tab",
      "modal",
      "okno",
      "dialog",
      "tabindex",
      "podmenu",
      "stopka"
    ],
    "criteria": [
      "2.4.3"
    ],
    "alsoConsider": [
      "1.3.2",
      "3.2.3"
    ],
    "severity": "Priorytet 1",
    "title": "Kolejność fokusu nie odpowiada układowi strony",
    "description": "Fokus przeskakuje między obszarami strony w nielogicznej kolejności (np. podmenu pojawia się w środku menu głównego), po otwarciu okna modalnego zostaje w tle albo nie trafia do okna. Dotyczy: [wpisz miejsca].",
    "userImpact": "Osoba korzystająca z klawiatury traci orientację i może nie trafić do treści albo działać „na ślepo” pod zasłoniętym oknem.",
    "fixes": [
      {
        "label": "Kolejność w kodzie",
        "text": "Ułóż elementy w kodzie w kolejności czytania i usuń dodatnie wartości tabindex."
      },
      {
        "label": "Fokus w oknie",
        "text": "Po otwarciu okna modalnego przenieś fokus do okna (najlepiej natywny element dialog z showModal()), a po zamknięciu przywróć go na przycisk otwierający.",
        "code": {
          "language": "html",
          "code": "<dialog id=\"okno\" aria-labelledby=\"okno-tytul\">\n  <h2 id=\"okno-tytul\">Udostępnij</h2>\n  <button type=\"button\">Zamknij</button>\n</dialog>"
        }
      }
    ]
  },
  {
    "id": "link-purpose",
    "keywords": [
      "link",
      "czytaj więcej",
      "kliknij",
      "tutaj",
      "więcej",
      "niejasny",
      "odnośnik",
      "adres url jako etykieta",
      "www",
      "kontekst linku"
    ],
    "criteria": [
      "2.4.4"
    ],
    "severity": "Priorytet 2",
    "title": "Linki o niejasnym celu",
    "description": "Na stronie są linki „Czytaj więcej”, „Kliknij tutaj”, „tutaj”, „www” lub pełny adres URL jako etykieta, bez kontekstu pozwalającego ustalić, dokąd prowadzą.",
    "userImpact": "Osoba korzystająca z czytnika ekranu, która przegląda listę linków, słyszy kilka identycznych „Czytaj więcej” albo długi adres i nie wie, który wybrać.",
    "fixes": [
      {
        "label": "Opisowy tekst",
        "text": "Zmień tekst linku tak, aby mówił, dokąd prowadzi. Zamiast „tutaj” zrób linkiem całe zdanie lub frazę, np. „Regulamin konkursu (PDF, 108 kB)”.",
        "code": {
          "language": "html",
          "code": "<a href=\"/aktualnosci/remont\">Remont ul. Polnej — szczegóły</a>"
        }
      },
      {
        "label": "Ukryte uzupełnienie",
        "text": "Jeśli wygląd musi zostać, dodaj tekst uzupełniający ukryty wizualnie wewnątrz linku.",
        "code": {
          "language": "html",
          "code": "<a href=\"/aktualnosci/remont\">Czytaj więcej<span class=\"visually-hidden\"> o remoncie ul. Polnej</span></a>"
        }
      }
    ]
  },
  {
    "id": "focus-visible",
    "keywords": [
      "fokus",
      "obrys",
      "outline",
      "widoczny fokus",
      "wskaźnik",
      "klawiatura",
      "niewidoczny fokus"
    ],
    "criteria": [
      "2.4.7"
    ],
    "alsoConsider": [
      "1.4.11"
    ],
    "severity": "Priorytet 1",
    "title": "Brak widocznego fokusu",
    "description": "Styl strony usuwa obrys fokusu (outline: none) i nie zastępuje go innym wskaźnikiem albo wskaźnik jest ukryty pod innym elementem; nie widać, który element jest aktywny. Dotyczy: [wpisz elementy, np. menu, baner, formularz zamówienia].",
    "userImpact": "Osoba korzystająca z klawiatury nie wie, gdzie jest, i nie może bezpiecznie uruchomić żadnego elementu.",
    "fixes": [
      {
        "label": "Wyraźny obrys",
        "text": "Przywróć widoczny wskaźnik fokusu o grubości co najmniej 2 px i kontraście co najmniej 3:1.",
        "code": {
          "language": "css",
          "code": ":focus-visible { outline: 3px solid #1a1a1a; outline-offset: 2px; }"
        }
      }
    ]
  },
  {
    "id": "focus-obscured",
    "keywords": [
      "fokus",
      "zasłonięty",
      "sticky",
      "przyklejony",
      "nagłówek",
      "baner",
      "cookies",
      "czat",
      "stopka"
    ],
    "criteria": [
      "2.4.11"
    ],
    "severity": "Priorytet 1",
    "title": "Element z fokusem jest zasłonięty przez przyklejony nagłówek lub baner",
    "description": "Przyklejony nagłówek, niezamknięty baner zgody na pliki cookie, zadokowana stopka lub czat zasłania w całości element, który otrzymał fokus.",
    "userImpact": "Osoba korzystająca z klawiatury nie widzi, gdzie jest fokus, i nie wie, co uruchomi.",
    "fixes": [
      {
        "label": "scroll-padding",
        "text": "Dodaj odstęp przewijania równy wysokości przyklejonych elementów.",
        "code": {
          "language": "css",
          "code": "html { scroll-padding-top: 6rem; scroll-padding-bottom: 5rem; }"
        }
      },
      {
        "label": "Baner cookies",
        "text": "Wymuś decyzję w sprawie plików cookies przed interakcją ze stroną albo zapewnij, aby element z fokusem był widoczny niezależnie od elementów zadokowanych."
      }
    ]
  },
  {
    "id": "target-size",
    "keywords": [
      "rozmiar celu",
      "kliknięcie",
      "mały",
      "dotyk",
      "ikona",
      "odstęp",
      "48dp",
      "44pt",
      "aplikacja mobilna"
    ],
    "criteria": [
      "2.5.8"
    ],
    "severity": "Priorytet 2",
    "title": "Za małe elementy do kliknięcia lub dotknięcia",
    "description": "Ikony i linki mają obszar aktywny mniejszy niż 24 × 24 px i są położone zbyt blisko siebie. W aplikacji mobilnej obszar dotykowy jest mniejszy niż zalecane 48 dp (Android) lub 44 pt (iOS). Dotyczy: [wpisz ekran/element].",
    "userImpact": "Osoby z drżeniem rąk, ograniczoną sprawnością manualną i korzystające z ekranu dotykowego trafiają w niewłaściwy element.",
    "fixes": [
      {
        "label": "Większy obszar",
        "text": "Zwiększ obszar aktywny do co najmniej 24 × 24 px (zalecane 44 × 44 px) albo zapewnij odpowiedni odstęp.",
        "code": {
          "language": "css",
          "code": ".icon-link { min-width: 44px; min-height: 44px; display: inline-grid; place-items: center; }"
        }
      },
      {
        "label": "Aplikacja mobilna",
        "text": "Nadaj elementom minimalny rozmiar 48 dp (Android) lub 44 pt (iOS); małą ikonę powiększ niewidocznym obszarem dotykowym (android:minWidth/minHeight, padding)."
      }
    ]
  },
  {
    "id": "lang-missing",
    "keywords": [
      "język",
      "lang",
      "html",
      "wymowa",
      "czytnik",
      "pl-PL"
    ],
    "criteria": [
      "3.1.1"
    ],
    "severity": "Priorytet 2",
    "title": "Brak określenia języka strony",
    "description": "Element html nie ma atrybutu lang albo ma niewłaściwą wartość.",
    "userImpact": "Czytnik ekranu czyta polski tekst z wymową innego języka, przez co treść staje się niezrozumiała.",
    "fixes": [
      {
        "label": "Atrybut lang",
        "text": "Dodaj atrybut lang z kodem języka treści.",
        "code": {
          "language": "html",
          "code": "<html lang=\"pl\">"
        }
      }
    ]
  },
  {
    "id": "error-identification",
    "keywords": [
      "błąd",
      "formularz",
      "walidacja",
      "komunikat",
      "czerwone",
      "pole",
      "sugestia poprawy",
      "format e-mail",
      "logowanie"
    ],
    "criteria": [
      "3.3.1",
      "3.3.3"
    ],
    "alsoConsider": [
      "1.4.1",
      "1.3.1",
      "4.1.3"
    ],
    "severity": "Priorytet 1",
    "title": "Błędy formularza nie są opisane tekstem",
    "description": "Po wysłaniu formularza z błędem pole zmienia tylko kolor obramowania; nie pojawia się komunikat, co jest nie tak i jak to poprawić (np. jaki format adresu e-mail jest wymagany). Fokus nie przechodzi do pierwszego błędnego pola ani do podsumowania błędów.",
    "userImpact": "Osoby niewidome, nierozróżniające kolorów i z niepełnosprawnością intelektualną nie wiedzą, które pole jest błędne ani jak je poprawić.",
    "fixes": [
      {
        "label": "Komunikat przy polu",
        "text": "Wyświetl przy polu komunikat tekstowy z opisem błędu i podpowiedzią, powiąż go z polem przez aria-describedby i oznacz pole aria-invalid.",
        "code": {
          "language": "html",
          "code": "<input id=\"email\" aria-invalid=\"true\" aria-describedby=\"email-error\">\n<p id=\"email-error\">Błąd: wpisz adres w formacie nazwa@domena.pl</p>"
        }
      },
      {
        "label": "Podsumowanie błędów",
        "text": "Przy wielu błędach pokaż na górze formularza listę błędów z linkami do pól i przenieś do niej fokus."
      }
    ]
  },
  {
    "id": "button-name",
    "keywords": [
      "przycisk",
      "ikona",
      "button",
      "nazwa",
      "aria-label",
      "pusty przycisk",
      "hamburger",
      "lupa",
      "zamknij",
      "przełącznik",
      "switch",
      "checkbox"
    ],
    "criteria": [
      "1.1.1",
      "4.1.2"
    ],
    "alsoConsider": [
      "2.4.4",
      "2.5.3"
    ],
    "severity": "Priorytet 1",
    "title": "Przycisk bez dostępnej nazwy",
    "description": "Przyciski i kontrolki zawierające tylko ikonę (np. wyszukiwanie, zamknięcie, menu, dodanie do obserwowanych) lub niestandardowy przełącznik (role=\"checkbox\" na div) nie mają tekstu ani atrybutu aria-label; czytnik ogłasza samą rolę.",
    "userImpact": "Osoba korzystająca z czytnika ekranu słyszy samo „przycisk” albo „pole wyboru, niezaznaczone” i nie wie, co zrobi. Osoba sterująca głosem nie może go wywołać.",
    "fixes": [
      {
        "label": "aria-label",
        "text": "Nadaj przyciskowi nazwę dostępną opisującą akcję.",
        "code": {
          "language": "html",
          "code": "<button type=\"button\" aria-label=\"Zamknij okno\"><svg aria-hidden=\"true\" focusable=\"false\">…</svg></button>"
        }
      },
      {
        "label": "Przełącznik z etykietą obok",
        "text": "Dla niestandardowej kontrolki powiąż widoczny tekst obok z kontrolką przez aria-labelledby.",
        "code": {
          "language": "html",
          "code": "<span id=\"zgoda-etykieta\">Chcę otrzymywać newsletter</span>\n<div role=\"switch\" tabindex=\"0\" aria-checked=\"false\" aria-labelledby=\"zgoda-etykieta\"></div>"
        }
      }
    ]
  },
  {
    "id": "custom-widget-state",
    "keywords": [
      "menu",
      "rozwijane",
      "akordeon",
      "zakładki",
      "stan",
      "aria-expanded",
      "dropdown",
      "slider",
      "kropki karuzeli",
      "element rozwijany"
    ],
    "criteria": [
      "4.1.2"
    ],
    "alsoConsider": [
      "1.3.1"
    ],
    "severity": "Priorytet 1",
    "title": "Komponent nie przekazuje stanu",
    "description": "Rozwijane menu, akordeon, zakładki lub kontrolki karuzeli (np. kropki) zmieniają stan wizualnie, ale stan (rozwinięty, zaznaczony, wybrany) i cel kontrolki nie są przekazywane technologiom asystującym.",
    "userImpact": "Osoba korzystająca z czytnika ekranu nie wie, czy menu jest otwarte, ani która zakładka jest wybrana, ani do którego slajdu prowadzi dana kropka.",
    "fixes": [
      {
        "label": "aria-expanded",
        "text": "Dla przycisków rozwijających ustawiaj aria-expanded na true/false przy każdej zmianie stanu.",
        "code": {
          "language": "html",
          "code": "<button aria-expanded=\"true\" aria-controls=\"faq-1\">Jak się zapisać?</button>"
        }
      },
      {
        "label": "Wzorzec APG",
        "text": "Zbuduj komponent według wzorca WAI-ARIA Authoring Practices (role, stany i obsługa klawiatury)."
      }
    ]
  },
  {
    "id": "status-messages",
    "keywords": [
      "komunikat",
      "koszyk",
      "powiadomienie",
      "live region",
      "status",
      "alert",
      "lista życzeń",
      "dodano do koszyka"
    ],
    "criteria": [
      "4.1.3"
    ],
    "alsoConsider": [
      "1.3.1"
    ],
    "severity": "Priorytet 2",
    "title": "Komunikaty o stanie nie są ogłaszane",
    "description": "Komunikaty pojawiające się bez przeładowania strony (np. „Dodano do listy życzeń”, liczba wyników wyszukiwania) nie są ogłaszane przez czytnik ekranu.",
    "userImpact": "Osoba korzystająca z czytnika ekranu nie wie, czy akcja się powiodła.",
    "fixes": [
      {
        "label": "role=status",
        "text": "Umieść komunikat w obszarze z role=\"status\" (lub role=\"alert\" dla błędów), który istnieje w kodzie przed pojawieniem się komunikatu.",
        "code": {
          "language": "html",
          "code": "<div role=\"status\">Dodano produkt do koszyka.</div>"
        }
      }
    ]
  },
  {
    "id": "video-captions",
    "keywords": [
      "wideo",
      "film",
      "napisy",
      "youtube",
      "nagranie",
      "napisy rozszerzone",
      "transkrypcja",
      "aplikacja"
    ],
    "criteria": [
      "1.2.2"
    ],
    "severity": "Priorytet 1",
    "title": "Nagranie wideo nie ma napisów",
    "description": "Nagranie z treścią mówioną nie ma napisów rozszerzonych albo ma tylko automatycznie wygenerowane napisy z błędami. Dotyczy: [wpisz filmy/ekrany].",
    "userImpact": "Osoby głuche i słabosłyszące nie mają dostępu do treści nagrania.",
    "fixes": [
      {
        "label": "Napisy rozszerzone",
        "text": "Dodaj zsynchronizowane napisy rozszerzone obejmujące dialogi, osoby mówiące i istotne dźwięki; napisy automatyczne poddaj korekcie.",
        "code": {
          "language": "html",
          "code": "<video controls>\n  <source src=\"film.mp4\" type=\"video/mp4\">\n  <track kind=\"captions\" src=\"film.pl.vtt\" srclang=\"pl\" label=\"Polski\" default>\n</video>"
        }
      },
      {
        "label": "Aplikacja mobilna",
        "text": "Zapewnij napisy w odtwarzaczu (pliki .vtt/.srt) oraz przycisk ich włączenia w interfejsie, a dla treści audio — transkrypcję."
      }
    ]
  },
  {
    "id": "auto-carousel",
    "keywords": [
      "karuzela",
      "slider",
      "pauza",
      "animacja",
      "ruch",
      "automatyczny",
      "baner rotujący",
      "migotanie"
    ],
    "criteria": [
      "2.2.2"
    ],
    "severity": "Priorytet 1",
    "title": "Karuzela lub ruchomy element nie ma możliwości zatrzymania",
    "description": "Karuzela, rotujący baner lub inny ruchomy element zmienia się automatycznie dłużej niż 5 sekund i nie ma przycisku pauzy, zatrzymania lub ukrycia. W aplikacji mobilnej dotyczy to ruchomych elementów, których nie da się wyłączyć.",
    "userImpact": "Osoby z ADHD i trudnościami z koncentracją są rozpraszane, a osoby czytające wolniej i korzystające z powiększenia nie zdążą przeczytać treści.",
    "fixes": [
      {
        "label": "Przycisk pauzy",
        "text": "Dodaj widoczny przycisk wstrzymujący przewijanie, dostępny z klawiatury, jako pierwszy element karuzeli; kontrolki mają być widoczne także po fokusie."
      },
      {
        "label": "Bez autoodtwarzania",
        "text": "Rozważ wyłączenie automatycznego przewijania — slajdy zmienia wtedy użytkownik."
      }
    ]
  },
  {
    "id": "autocomplete",
    "keywords": [
      "autouzupełnianie",
      "dane osobowe",
      "imię",
      "email",
      "telefon",
      "adres",
      "autocomplete off"
    ],
    "criteria": [
      "1.3.5"
    ],
    "severity": "Priorytet 3",
    "title": "Pola danych osobowych nie mają atrybutu autocomplete",
    "description": "Pola na imię, nazwisko, e-mail, telefon i adres nie mają atrybutu autocomplete z właściwą wartością albo mają wartość „off”.",
    "userImpact": "Osoby z niepełnosprawnością ruchową i poznawczą muszą wpisywać dane ręcznie, zamiast skorzystać z autouzupełniania przeglądarki.",
    "fixes": [
      {
        "label": "autocomplete",
        "text": "Dodaj atrybut autocomplete z wartością odpowiadającą przeznaczeniu pola i usuń autocomplete=\"off\" z pól na dane użytkownika.",
        "code": {
          "language": "html",
          "code": "<input id=\"tel\" type=\"tel\" autocomplete=\"tel\">"
        }
      }
    ]
  },
  {
    "id": "img-alt-inadequate",
    "keywords": [
      "alt",
      "nieadekwatny alt",
      "błędny opis",
      "tekst alternatywny",
      "nazwa pliku",
      "powtórzony tytuł",
      "baner",
      "zdjęcie",
      "obraz"
    ],
    "criteria": [
      "1.1.1"
    ],
    "alsoConsider": [
      "2.4.4"
    ],
    "severity": "Priorytet 2",
    "title": "Obraz z nieadekwatnym tekstem alternatywnym",
    "description": "Obraz ma atrybut alt, ale jego treść nie opisuje obrazu ani jego funkcji: powtarza tytuł artykułu, zawiera hasło z systemu (np. „Mozaika 3”), nazwę pliku albo mówi coś innego niż widać (np. na banerze jest napis „Autoryzowany serwis”, a alt brzmi „Serwis 3”). Przykład: [wpisz, co jest na obrazie, a co mówi alt].",
    "userImpact": "Osoba korzystająca z czytnika ekranu dostaje nieprawdziwą lub zbędną informację i może pominąć ważną treść, np. tekst z banera. Powtarzający się alt dodatkowo wydłuża czytanie strony.",
    "fixes": [
      {
        "label": "Opisać funkcję i treść",
        "text": "Zapisz w alt to, co obraz przekazuje. Jeśli na obrazie jest tekst, alt ma zawierać ten tekst; jeśli obraz jest linkiem — cel linku.",
        "code": {
          "language": "html",
          "code": "<img src=\"baner.webp\" alt=\"Autoryzowany serwis Apple — sprawdź ofertę\">"
        }
      },
      {
        "label": "Nie powtarzać sąsiedniego tekstu",
        "text": "Gdy obok jest tytuł z tą samą informacją, oznacz obraz jako dekoracyjny (alt=\"\") albo dodaj faktyczny opis zdjęcia zamiast tytułu."
      }
    ]
  },
  {
    "id": "captcha-no-alternative",
    "keywords": [
      "captcha",
      "kod z obrazka",
      "przepisz kod",
      "weryfikacja",
      "formularz kontaktowy",
      "robot"
    ],
    "criteria": [
      "1.1.1"
    ],
    "alsoConsider": [
      "3.3.8"
    ],
    "severity": "Priorytet 1",
    "title": "Kod z obrazka (CAPTCHA) bez dostępnej alternatywy",
    "description": "Formularz wymaga przepisania kodu z obrazka (CAPTCHA) i nie oferuje alternatywy, np. wersji dźwiękowej ani innej metody weryfikacji. Dotyczy: [wpisz formularz].",
    "userImpact": "Osoba niewidoma nie jest w stanie przepisać kodu i nie wyśle formularza kontaktowego ani nie założy konta. Problem dotyczy też osób z dysleksją i słabowidzących.",
    "fixes": [
      {
        "label": "Zrezygnować z rozpoznawania obrazków",
        "text": "Zastąp zagadkę wzrokową rozwiązaniem niewymagającym rozwiązania zadania przez użytkownika (np. pole pułapka dla botów, ocena ryzyka po stronie serwera)."
      },
      {
        "label": "Zapewnić alternatywy",
        "text": "Jeśli CAPTCHA musi zostać, zapewnij co najmniej dwa rodzaje weryfikacji (np. obraz i dźwięk) oraz tekstowy opis celu elementu."
      }
    ]
  },
  {
    "id": "image-of-text",
    "keywords": [
      "tekst w grafice",
      "obraz tekstu",
      "baner z tekstem",
      "przycisk jako obraz",
      "skan",
      "grafika z napisem"
    ],
    "criteria": [
      "1.4.5"
    ],
    "alsoConsider": [
      "1.1.1",
      "1.4.3",
      "1.4.4",
      "1.4.12"
    ],
    "severity": "Priorytet 2",
    "title": "Tekst przedstawiony jako grafika",
    "description": "Informacja tekstowa (baner, przycisk, hasło reklamowe, dokument) jest przedstawiona jako obraz zamiast jako tekst w HTML. Nie da się go powiększyć bez utraty jakości ani dostosować kolorów i odstępów. Dotyczy: [wpisz elementy].",
    "userImpact": "Osoby słabowidzące nie mogą powiększyć ani dostosować tekstu, a osoby niewidome nie mają do niego dostępu, jeśli brakuje alternatywy. Tekst z obrazów często ma też za niski kontrast.",
    "fixes": [
      {
        "label": "Tekst w HTML i CSS",
        "text": "Wyświetl tekst jako tekst i ostyluj go w CSS; w obrazie zostaw tylko tło.",
        "code": {
          "language": "html",
          "code": "<div class=\"baner\">\n  <h2>Współpraca z Najwyższą Izbą Kontroli</h2>\n</div>"
        }
      },
      {
        "label": "Gdy obraz jest konieczny",
        "text": "Jeśli obraz tekstu musi zostać (np. logotyp), zapisz w alt pełną treść obrazu."
      }
    ]
  },
  {
    "id": "heading-misused",
    "keywords": [
      "nagłówek pusty",
      "pusty h2",
      "h3 do formatowania",
      "nagłówek jako pogrubienie",
      "pogrubiony tekst"
    ],
    "criteria": [
      "1.3.1",
      "2.4.6"
    ],
    "severity": "Priorytet 2",
    "title": "Nagłówek pusty lub użyty tylko do formatowania tekstu",
    "description": "Element nagłówka (h1–h6) nie zawiera tekstu albo został użyty tylko po to, by sformatować tekst niebędący tytułem sekcji (np. data wydarzenia w h3). Dotyczy: [wpisz fragment kodu i stronę].",
    "userImpact": "Osoba korzystająca z czytnika ekranu dostaje błędną informację o strukturze strony, trafia na „puste” punkty w nawigacji po nagłówkach i może się zdezorientować.",
    "fixes": [
      {
        "label": "Usunąć pusty nagłówek",
        "text": "Jeśli nagłówek nie jest potrzebny do zrozumienia struktury, usuń go z kodu."
      },
      {
        "label": "Formatowanie w CSS",
        "text": "Do wyglądu tekstu użyj CSS, a nagłówków używaj tylko do tytułów sekcji.",
        "code": {
          "language": "html",
          "code": "<p class=\"data-wydarzenia\">16–21 lipca 2025 r.</p>"
        }
      }
    ]
  },
  {
    "id": "list-not-marked-up",
    "keywords": [
      "lista",
      "pseudolista",
      "numeracja",
      "punktory",
      "ul",
      "ol",
      "li",
      "akapity zamiast listy",
      "wyliczenie"
    ],
    "criteria": [
      "1.3.1"
    ],
    "severity": "Priorytet 2",
    "title": "Lista zapisana jako zwykłe akapity lub ręczna numeracja",
    "description": "Elementy, które wizualnie tworzą listę (punktory, numeracja „1)”, „2)”, nazwiska, klasy, dokumenty do przedłożenia), są zapisane jako osobne akapity lub linie tekstu zamiast listy. Czasem między pozycjami wstawiono tekst niebędący jej częścią (np. „oraz”). Dotyczy: [wpisz stronę].",
    "userImpact": "Osoba korzystająca z czytnika ekranu nie dostaje informacji o początku i końcu listy ani o liczbie pozycji, a wtrącony tekst zaburza sposób czytania.",
    "fixes": [
      {
        "label": "Prawdziwa lista",
        "text": "Zapisz pozycje jako ul lub ol z elementami li, a wygląd ustaw w CSS.",
        "code": {
          "language": "html",
          "code": "<ol>\n  <li>oryginał świadectwa ukończenia szkoły podstawowej</li>\n  <li>oryginał wyników egzaminu ósmoklasisty</li>\n  <li>karta zdrowia</li>\n</ol>"
        }
      },
      {
        "label": "Tekst spoza listy",
        "text": "Tekst niebędący pozycją listy przenieś poza listę lub zakończ listę wcześniej."
      }
    ]
  },
  {
    "id": "landmarks-missing",
    "keywords": [
      "landmarki",
      "punkty orientacyjne",
      "nav",
      "main",
      "header",
      "footer",
      "aside",
      "etykieta nawigacji",
      "aria-label",
      "aria-labelledby"
    ],
    "criteria": [
      "1.3.1",
      "2.4.1"
    ],
    "severity": "Priorytet 2",
    "title": "Brak lub niejednoznaczne punkty orientacyjne (landmarki)",
    "description": "Strona nie ma podziału na obszary (header, nav, main, footer), cała treść znajduje się w jednym obszarze main albo na stronie jest kilka elementów nav lub aside bez unikalnych etykiet, więc nie da się ich odróżnić.",
    "userImpact": "Osoba korzystająca z czytnika ekranu nie może szybko przeskakiwać między obszarami strony i słyszy tylko „nawigacja” bez informacji, które to menu (główne, stopka, boczne).",
    "fixes": [
      {
        "label": "Landmarki HTML",
        "text": "Oznacz kluczowe obszary elementami header, nav, main i footer.",
        "code": {
          "language": "html",
          "code": "<header>…</header>\n<nav aria-label=\"Menu główne\">…</nav>\n<main id=\"main\">…</main>\n<footer>…</footer>"
        }
      },
      {
        "label": "Unikalne etykiety",
        "text": "Jeśli jest kilka nav lub aside, nadaj każdemu unikalną nazwę: aria-labelledby (gdy jest widoczny nagłówek) lub aria-label.",
        "code": {
          "language": "html",
          "code": "<h2 id=\"polecamy\">Polecamy</h2>\n<nav aria-labelledby=\"polecamy\">…</nav>\n<nav aria-label=\"Nawigacja w stopce\">…</nav>"
        }
      }
    ]
  },
  {
    "id": "duplicate-ids",
    "keywords": [
      "id",
      "duplikat id",
      "parsowanie",
      "walidacja html",
      "błędy w kodzie",
      "nu html checker",
      "niedomknięte znaczniki"
    ],
    "criteria": [
      "1.3.1",
      "4.1.2"
    ],
    "alsoConsider": [
      "4.1.1 (WCAG 2.1; w 2.2 usunięte)"
    ],
    "severity": "Priorytet 2",
    "title": "Zduplikowane identyfikatory (id) i błędy w kodzie HTML",
    "description": "W kodzie strony występuje wiele błędów, w tym powtórzone wartości id. Przez powtórzone id etykiety i opisy łączą się z niewłaściwymi polami lub w ogóle nie działają. Liczba błędów w walidatorze: [wpisz]. W WCAG 2.2 kryterium 4.1.1 Parsowanie zostało usunięte, więc naruszenie opisz przez kryteria, na które realnie wpływa.",
    "userImpact": "Technologie asystujące mogą źle interpretować stronę: etykieta zostaje przypisana do innego pola, a komponenty działają niezgodnie z oczekiwaniem osoby korzystającej z czytnika ekranu.",
    "fixes": [
      {
        "label": "Unikalne id",
        "text": "Zdiagnozuj błędy walidatorem (np. Nu Html Checker W3C) i popraw je: każde id ma być unikalne, a powiązania for, aria-labelledby i aria-describedby muszą wskazywać właściwe elementy."
      },
      {
        "label": "Komponenty generowane",
        "text": "W komponentach powielanych na stronie generuj id z unikalnym sufiksem."
      }
    ]
  },
  {
    "id": "link-vs-button",
    "keywords": [
      "link zamiast przycisku",
      "przycisk jako link",
      "rola",
      "semantyka",
      "a href",
      "button",
      "zamknij okno"
    ],
    "criteria": [
      "4.1.2"
    ],
    "alsoConsider": [
      "1.3.1",
      "2.1.1"
    ],
    "severity": "Priorytet 2",
    "title": "Link użyty jako przycisk lub przycisk użyty jako link",
    "description": "Element, który wykonuje akcję na stronie (zamknięcie okna, rozwinięcie), jest zbudowany jako link bez właściwego celu, albo element prowadzący na inną stronę jest przyciskiem. Czytnik ogłasza złą rolę.",
    "userImpact": "Osoba korzystająca z czytnika ekranu oczekuje przejścia na inną stronę, a następuje zmiana na tej samej (albo odwrotnie), co wprowadza w błąd.",
    "fixes": [
      {
        "label": "Właściwy element",
        "text": "Dla akcji użyj button, dla nawigacji — a z atrybutem href.",
        "code": {
          "language": "html",
          "code": "<button type=\"button\" class=\"zamknij\">Zamknij</button>\n<a href=\"/kontakt\">Kontakt</a>"
        }
      },
      {
        "label": "Własna kontrolka",
        "text": "Jeśli musisz użyć innego elementu, nadaj role=\"button\", tabindex=\"0\" i obsłuż klawisze Enter oraz Spacja."
      }
    ]
  },
  {
    "id": "label-in-name",
    "keywords": [
      "etykieta w nazwie",
      "aria-label",
      "nazwa dostępna",
      "sterowanie głosem",
      "widoczny tekst",
      "na temat"
    ],
    "criteria": [
      "2.5.3"
    ],
    "alsoConsider": [
      "4.1.2"
    ],
    "severity": "Priorytet 2",
    "title": "Dostępna nazwa nie zawiera widocznej etykiety",
    "description": "Widoczny tekst elementu (np. „Aktualności”) różni się od jego nazwy dostępnej (np. aria-label „na temat Aktualności”), więc nazwa nie zaczyna się od widocznej etykiety. Dotyczy: [wpisz elementy].",
    "userImpact": "Osoba sterująca komputerem głosem wypowiada widoczny tekst, ale element nie reaguje. Osoba korzystająca z czytnika ekranu słyszy inną nazwę niż widzi osoba widząca.",
    "fixes": [
      {
        "label": "Widoczny tekst w nazwie",
        "text": "Dopasuj nazwę dostępną do etykiety widocznej; może ją rozszerzać, najlepiej zaczynając od widocznego tekstu.",
        "code": {
          "language": "html",
          "code": "<a href=\"/aktualnosci\">Aktualności<span class=\"visually-hidden\"> — wszystkie wiadomości</span></a>"
        }
      }
    ]
  },
  {
    "id": "buttons-repeated",
    "keywords": [
      "powtarzalne przyciski",
      "kopiuj",
      "dodaj do zamówienia",
      "dodaj do koszyka",
      "czytaj więcej",
      "lista przycisków",
      "ta sama nazwa"
    ],
    "criteria": [
      "2.4.6",
      "1.3.1"
    ],
    "alsoConsider": [
      "2.4.4",
      "4.1.2"
    ],
    "severity": "Priorytet 1",
    "title": "Wiele przycisków lub linków o identycznej nazwie bez kontekstu",
    "description": "Kilka przycisków lub linków ma tę samą nazwę dostępną (np. „Dodaj do zamówienia”, „Kopiuj”), a powiązanie z konkretnym produktem lub wartością jest widoczne tylko dzięki układowi karty. Dotyczy: [wpisz komponent].",
    "userImpact": "Użytkownik czytnika ekranu przeglądający listę przycisków nie wie, który produkt dodaje lub którą wartość kopiuje, więc może wybrać niewłaściwy produkt albo przerwać proces.",
    "fixes": [
      {
        "label": "Nazwa z akcją i obiektem",
        "text": "Nadaj każdemu przyciskowi nazwę zawierającą akcję i obiekt. Można zachować krótki tekst widoczny, a pełny kontekst dodać przez aria-labelledby.",
        "code": {
          "language": "html",
          "code": "<h3 id=\"p1\">Webinar: Dostępność w praktyce</h3>\n<button id=\"b1\" aria-labelledby=\"b1 p1\">Dodaj do zamówienia</button>"
        }
      },
      {
        "label": "Test po poprawce",
        "text": "Sprawdź listę przycisków w czytniku ekranu: każdy przycisk powinien być zrozumiały poza kontekstem wizualnym."
      }
    ]
  },
  {
    "id": "link-duplicate",
    "keywords": [
      "podwójne linki",
      "duplikat linku",
      "efekt jąkania",
      "alt i title",
      "ten sam link",
      "obraz i tytuł jako osobne linki"
    ],
    "criteria": [
      "1.3.1",
      "2.4.4"
    ],
    "severity": "Priorytet 3",
    "title": "Podwójne lub zdublowane linki do tego samego celu",
    "description": "Na jednym elemencie (np. wiadomości, kafelku) zdjęcie i tytuł są osobnymi linkami do tego samego adresu albo alt i title zawierają ten sam tekst. Czytnik odczytuje te same informacje dwa razy („efekt jąkania”).",
    "userImpact": "Użytkownik czytnika ekranu otrzymuje niepotrzebne powtórzenia, co wydłuża czytanie i utrudnia zapoznanie się z zawartością strony. Dodatkowe puste linki zwiększają liczbę elementów w tabulacji.",
    "fixes": [
      {
        "label": "Jeden link",
        "text": "Połącz całą kartę w jeden link z jedną nazwą albo usuń zbędny drugi link; zdjęcie w drugim linku oznacz jako dekoracyjne.",
        "code": {
          "language": "html",
          "code": "<a href=\"/aktualnosci/remont\">\n  <img src=\"remont.jpg\" alt=\"\">\n  Remont ulicy Polnej\n</a>"
        }
      },
      {
        "label": "Bez powielania w title",
        "text": "Jeśli link ma etykietę, nie dodawaj atrybutu title z tym samym tekstem."
      }
    ]
  },
  {
    "id": "link-new-window",
    "keywords": [
      "nowe okno",
      "nowa karta",
      "target blank",
      "link zewnętrzny",
      "pobieranie",
      "title linku",
      "otwiera się"
    ],
    "criteria": [
      "2.4.4"
    ],
    "alsoConsider": [
      "3.2.5 (AAA)"
    ],
    "severity": "Priorytet 3",
    "title": "Link otwiera nowe okno lub pobiera plik bez uprzedzenia",
    "description": "Link otwiera się w nowej karcie lub rozpoczyna pobieranie pliku, a nic o tym nie informuje; w jednym przypadku podpowiedź (title) sugeruje otwarcie strony, a rozpoczyna się pobieranie. Dotyczy: [wpisz linki].",
    "userImpact": "Użytkownik czytnika ekranu i osoby z trudnościami poznawczymi są zaskakiwane nieoczekiwanym działaniem, tracą orientację i mogą nie wiedzieć, jak wrócić do poprzedniej strony.",
    "fixes": [
      {
        "label": "Informacja w etykiecie",
        "text": "Dodaj do nazwy linku informację o sposobie otwarcia i typie celu — najlepiej tekstem widocznym lub ukrytym wizualnie, nie tylko w title.",
        "code": {
          "language": "html",
          "code": "<a href=\"https://przyklad.pl\" target=\"_blank\" rel=\"noopener\">Regulamin<span class=\"visually-hidden\"> (otwiera się w nowej karcie)</span></a>"
        }
      },
      {
        "label": "Zgodność informacji",
        "text": "Upewnij się, że komunikat zgadza się z rzeczywistym działaniem: otwarcie strony, pobranie pliku (z typem i rozmiarem) lub okno wyskakujące."
      }
    ]
  },
  {
    "id": "link-file-info",
    "keywords": [
      "załącznik",
      "plik do pobrania",
      "pdf",
      "docx",
      "rozmiar pliku",
      "format pliku",
      "pobierz"
    ],
    "criteria": [
      "2.4.4"
    ],
    "severity": "Priorytet 3",
    "title": "Link do pliku bez informacji o formacie i rozmiarze",
    "description": "Linki do załączników (PDF, DOC, XLS) nie informują o formacie i rozmiarze pliku. To rekomendacja jakościowa; w zależności od ustaleń audytu może być ujęta w kryterium 2.4.4 jako brak pełnego celu linku. Dotyczy: [wpisz strony].",
    "userImpact": "Użytkownik nie wie, co zostanie pobrane i jak duży jest plik, co jest szczególnie istotne dla osób z wolnym łączem i korzystających z czytnika ekranu.",
    "fixes": [
      {
        "label": "Format i rozmiar w etykiecie",
        "text": "Dopisz rodzaj i rozmiar pliku do nazwy linku.",
        "code": {
          "language": "html",
          "code": "<a href=\"regulamin.pdf\">Regulamin konkursu (PDF, 108 kB)</a>"
        }
      }
    ]
  },
  {
    "id": "link-inconsistent-id",
    "keywords": [
      "spójna identyfikacja",
      "niespójne linki",
      "podkreślenie",
      "linki bez podkreślenia",
      "ten sam przycisk",
      "różne etykiety"
    ],
    "criteria": [
      "3.2.4"
    ],
    "alsoConsider": [
      "1.4.1"
    ],
    "severity": "Priorytet 2",
    "title": "Linki i powtarzalne elementy są oznaczone niespójnie",
    "description": "Elementy pełniące tę samą funkcję są oznaczone w różny sposób: linki raz mają podkreślenie, raz pojawia się ono dopiero po najechaniu, raz brak go zupełnie; fokus lub nazwa tego samego komponentu różnią się w różnych częściach serwisu. Dotyczy: [wpisz elementy].",
    "userImpact": "Użytkownicy nie wiedzą, gdzie są linki, a różna forma oznaczenia dezorientuje; utrudnia to korzystanie ze strony, zwłaszcza osobom z trudnościami poznawczymi i słabowidzącym.",
    "fixes": [
      {
        "label": "Jedna konwencja",
        "text": "Ujednolić oznaczenie linków (np. podkreślenie we wszystkich linkach w treści), styl fokusu oraz nazwy elementów o tej samej funkcji w całym serwisie.",
        "code": {
          "language": "css",
          "code": "main a { text-decoration: underline; }"
        }
      }
    ]
  },
  {
    "id": "lang-part-missing",
    "keywords": [
      "język części",
      "lang",
      "tekst obcojęzyczny",
      "english version",
      "angielski",
      "ukraiński"
    ],
    "criteria": [
      "3.1.2"
    ],
    "severity": "Priorytet 3",
    "title": "Fragment w innym języku bez atrybutu lang",
    "description": "Fragment tekstu lub link w innym języku niż język strony (np. „English version”) nie ma atrybutu lang, więc czytnik czyta go z polską wymową. Dotyczy: [wpisz fragmenty].",
    "userImpact": "Osoba korzystająca z czytnika ekranu słyszy niezrozumiale wypowiadane słowa obcojęzyczne.",
    "fixes": [
      {
        "label": "lang na fragmencie",
        "text": "Dodaj atrybut lang do elementów z treścią w innym języku.",
        "code": {
          "language": "html",
          "code": "<a href=\"/en/\"><span lang=\"en\">English version</span></a>"
        }
      }
    ]
  },
  {
    "id": "lang-labels-wrong",
    "keywords": [
      "aria-label po angielsku",
      "etykiety po angielsku",
      "back to top",
      "język etykiet",
      "kontrolki dostępności"
    ],
    "criteria": [
      "3.1.2"
    ],
    "alsoConsider": [
      "2.4.6"
    ],
    "severity": "Priorytet 2",
    "title": "Etykiety kontrolek (aria-label, tekst ukryty) w niewłaściwym języku",
    "description": "W polskim serwisie nazwy dostępne części kontrolek (np. „Back to top”, przyciski zmiany kontrastu i rozmiaru tekstu, nawigacja karuzeli, kalendarz, okruszki) są po angielsku, a czytnik ekranu ustawiony na polski czyta je z błędną wymową.",
    "userImpact": "Osoby korzystające z czytnika ekranu i niemówiące po angielsku nie rozumieją przeznaczenia kontrolek, a fonetyczny odczyt jest niezrozumiały.",
    "fixes": [
      {
        "label": "Etykiety po polsku",
        "text": "Przetłumacz nazwy dostępne zgodnie z językiem strony; w wersjach językowych dopasuj etykiety do wybranego języka.",
        "code": {
          "language": "html",
          "code": "<button id=\"backtotop\" aria-label=\"Wróć do góry\">Do góry</button>"
        }
      }
    ]
  },
  {
    "id": "abbreviation-reading",
    "keywords": [
      "skrót",
      "liczba rzymska",
      "XXXIII",
      "p.",
      "czytnik czyta literami",
      "wymowa",
      "nazwa szkoły"
    ],
    "criteria": [
      "1.3.1"
    ],
    "alsoConsider": [
      "2.4.2",
      "4.1.2",
      "3.1.4 (AAA)"
    ],
    "severity": "Priorytet 2",
    "title": "Skróty i liczby rzymskie błędnie odczytywane przez czytnik ekranu",
    "description": "Czytnik ekranu błędnie odczytuje zapis: liczbę rzymską w nazwie podmiotu (jeden czytnik czyta ją jako liczebnik, inny literuje) lub skrót, np. „p.” przed nazwiskiem jest czytane jako litera „p”. Problem występuje także w tytule strony. Opisz: [wpisz zapis i czytniki, na których sprawdzono].",
    "userImpact": "Osoba korzystająca z czytnika ekranu dostaje błędną informację o nazwie podmiotu lub niezrozumiały tekst, np. przed nazwiskiem.",
    "fixes": [
      {
        "label": "Zapis dla czytnika",
        "text": "Zamień zapis na formę czytelną, a wersję wizualną zachowaj tylko tam, gdzie to konieczne. W tytule strony użyj zapisu arabskiego („33.”).",
        "code": {
          "language": "html",
          "code": "<span aria-hidden=\"true\">XXXIII LO</span>\n<span class=\"visually-hidden\">33. Liceum Ogólnokształcące</span>"
        }
      },
      {
        "label": "Rozwinięcie skrótu",
        "text": "Zamiast skrótów używaj pełnych słów („pani”, „pan”) albo rozwiń je w elemencie abbr."
      }
    ]
  },
  {
    "id": "focus-contrast",
    "keywords": [
      "fokus",
      "kontrast fokusu",
      "ramka fokusu",
      "obrys",
      "niska widoczność",
      "3:1"
    ],
    "criteria": [
      "2.4.7",
      "1.4.11"
    ],
    "severity": "Priorytet 1",
    "title": "Za niski kontrast wskaźnika fokusu",
    "description": "Wskaźnik fokusu istnieje, ale ma kontrast poniżej 3:1 względem tła (zmierzona wartość: [wpisz, np. 2,2:1]) albo jest zasłonięty przez element (np. półprzezroczysta kurtyna). W wersji kontrastowej strony kolor ramki bywa taki sam jak tło.",
    "userImpact": "Osoby słabowidzące korzystające z klawiatury mają utrudnione znalezienie aktywnego elementu.",
    "fixes": [
      {
        "label": "Wskaźnik 3:1",
        "text": "Zwiększ kontrast ramki fokusu do co najmniej 3:1 względem sąsiadujących kolorów i zapewnij, aby ramka nie była przycinana.",
        "code": {
          "language": "css",
          "code": ":focus-visible { outline: 3px solid #005fcc; outline-offset: 2px; }\n.ciemne-tlo :focus-visible { outline-color: #ffffff; }"
        }
      }
    ]
  },
  {
    "id": "focus-hidden",
    "keywords": [
      "fokus na niewidocznym",
      "ukryte elementy",
      "tło pod modalem",
      "zwinięte menu",
      "tabulacja po ukrytych",
      "inert"
    ],
    "criteria": [
      "2.4.3",
      "2.4.7"
    ],
    "alsoConsider": [
      "2.1.1",
      "4.1.2"
    ],
    "severity": "Priorytet 1",
    "title": "Fokus przechodzi na elementy niewidoczne lub nieaktywne",
    "description": "Klawisz Tab przenosi fokus na elementy, których nie widać: zwinięte menu lub podmenu, elementy pod otwartym oknem modalnym, ukryty wizualnie link. Dotyczy: [wpisz komponenty].",
    "userImpact": "Osoba korzystająca z klawiatury nie widzi, gdzie jest fokus; może uruchomić niewidoczny element lub „utknąć” w ukrytej treści.",
    "fixes": [
      {
        "label": "Ukryć naprawdę",
        "text": "Elementy niewidoczne wyłącz z tabulacji (display: none, atrybut hidden lub inert); tło pod oknem modalnym oznacz jako inert.",
        "code": {
          "language": "html",
          "code": "<main inert>…</main>\n<dialog open>…</dialog>"
        }
      },
      {
        "label": "Widoczny po fokusie",
        "text": "Jeśli element ma być dostępny dla klawiatury, pokaż go po otrzymaniu fokusu."
      }
    ]
  },
  {
    "id": "skip-link-broken",
    "keywords": [
      "skip link",
      "przejdź do treści",
      "niewidoczny link",
      "link pomijania",
      "złe miejsce"
    ],
    "criteria": [
      "2.4.1",
      "2.4.7"
    ],
    "severity": "Priorytet 2",
    "title": "Link „Przejdź do treści” jest niewidoczny po fokusie lub prowadzi w złe miejsce",
    "description": "Link pomijający powtarzalne bloki istnieje, ale po otrzymaniu fokusu nie jest widoczny albo przenosi do menu bocznego zamiast do głównej treści strony.",
    "userImpact": "Osoby korzystające z klawiatury nie widzą linku (więc go nie używają) albo po jego użyciu i tak muszą przejść przez menu.",
    "fixes": [
      {
        "label": "Widoczny po fokusie",
        "text": "Pokaż link, gdy otrzyma fokus.",
        "code": {
          "language": "css",
          "code": ".skip-link { position: absolute; left: -9999px; }\n.skip-link:focus { left: 1rem; top: 1rem; background: #fff; padding: .5rem 1rem; z-index: 1000; }"
        }
      },
      {
        "label": "Właściwy cel",
        "text": "Ustaw cel linku na nagłówek główny treści lub element main z id i tabindex=\"-1\"."
      }
    ]
  },
  {
    "id": "keyboard-skipped-items",
    "keywords": [
      "pomijane elementy",
      "slider",
      "miniatury",
      "partnerzy",
      "menu rozwijane po najechaniu",
      "tabindex",
      "fokus tylko pierwszy"
    ],
    "criteria": [
      "2.1.1"
    ],
    "alsoConsider": [
      "2.4.3"
    ],
    "severity": "Priorytet 1",
    "title": "Elementy klikalne pomijane w kolejności tabulacji (slider, miniatury, menu)",
    "description": "W komponencie (slider partnerów, miniatury zdjęć produktu, menu rozwijane po najechaniu) fokus otrzymuje tylko pierwszy element albo żaden; pozostałe elementy są klikalne tylko myszą. Dotyczy: [wpisz komponent].",
    "userImpact": "Osoba korzystająca wyłącznie z klawiatury nie ma dostępu do treści i funkcji ukrytych w komponencie.",
    "fixes": [
      {
        "label": "Natywne elementy",
        "text": "Zbuduj elementy jako a lub button, aby automatycznie były w kolejności tabulacji.",
        "code": {
          "language": "html",
          "code": "<ul class=\"partnerzy\">\n  <li><a href=\"/partner-a\"><img src=\"a.svg\" alt=\"Partner A\"></a></li>\n  <li><a href=\"/partner-b\"><img src=\"b.svg\" alt=\"Partner B\"></a></li>\n</ul>"
        }
      },
      {
        "label": "Sterowanie strzałkami",
        "text": "W złożonych komponentach zapewnij też sterowanie strzałkami według wzorca APG, nie tworząc pułapki klawiatury."
      }
    ]
  },
  {
    "id": "lightbox-focus",
    "keywords": [
      "galeria",
      "lightbox",
      "powiększenie zdjęcia",
      "okno podglądu",
      "karuzela zdjęć",
      "aria-hidden na przyciskach"
    ],
    "criteria": [
      "2.4.3",
      "2.4.7",
      "4.1.2"
    ],
    "alsoConsider": [
      "2.1.1"
    ],
    "severity": "Priorytet 1",
    "title": "Okno podglądu zdjęcia (galeria, lightbox): fokus zostaje w tle lub sterowanie jest niedostępne",
    "description": "Po otwarciu zdjęcia w galerii fokus nie przenosi się do okna podglądu, tylko pozostaje na stronie pod spodem (użytkownik nawigując nieświadomie może zmienić stronę); elementy sterujące galerią mają aria-hidden lub niezrozumiałe etykiety, a półprzezroczyste tło obniża kontrast wskaźnika fokusu.",
    "userImpact": "Osoby korzystające z klawiatury nie widzą aktywnego elementu, a użytkownicy czytnika ekranu słyszą teksty z ukrytej strony lub nie mogą sterować galerią.",
    "fixes": [
      {
        "label": "Fokus do okna",
        "text": "Po otwarciu podglądu przenieś fokus na przycisk zamknięcia lub tytuł okna, zablokuj tło (inert) i przywróć fokus po zamknięciu.",
        "code": {
          "language": "html",
          "code": "<dialog aria-label=\"Podgląd zdjęcia\">\n  <button type=\"button\" autofocus>Zamknij podgląd</button>\n  <img src=\"zdjecie.jpg\" alt=\"Uczniowie na apelu rozpoczynającym rok szkolny\">\n</dialog>"
        }
      },
      {
        "label": "Sterowanie galerią",
        "text": "Nie używaj aria-hidden na aktywnych kontrolkach; nadaj im polskie nazwy („Poprzednie zdjęcie”, „Następne zdjęcie”). Jeśli galeria dubluje treść strony, rozważ jej ukrycie przed technologiami asystującymi w całości."
      }
    ]
  },
  {
    "id": "error-not-associated",
    "keywords": [
      "komunikat błędu",
      "aria-describedby",
      "role alert",
      "aria-live",
      "walidacja pola",
      "błąd tylko kolorem"
    ],
    "criteria": [
      "1.3.1",
      "3.3.1",
      "4.1.3"
    ],
    "alsoConsider": [
      "1.4.1",
      "3.3.3"
    ],
    "severity": "Priorytet 1",
    "title": "Komunikat błędu nie jest powiązany z polem ani ogłaszany czytnikowi",
    "description": "Komunikat błędu pojawia się pod polem, ale nie jest programowo powiązany z polem (brak aria-describedby), nie jest ogłaszany automatycznie (brak role=\"alert\" lub aria-live), a błąd jest oznaczony wyłącznie kolorem obramowania i tekstu.",
    "userImpact": "Czytnik ekranu nie wiąże błędu z polem, więc użytkownik nie wie, że wystąpił błąd ani gdzie. Osoby nierozróżniające kolorów mogą nie zauważyć komunikatu.",
    "fixes": [
      {
        "label": "Powiązanie i ogłoszenie",
        "text": "Połącz komunikat z polem przez aria-describedby i ogłaszaj go przez role=\"alert\" lub aria-live; dodaj niekolorystyczny sygnał („Błąd:”, ikona).",
        "code": {
          "language": "html",
          "code": "<label for=\"email\">E-mail</label>\n<input id=\"email\" type=\"email\" aria-invalid=\"true\" aria-describedby=\"email-blad\">\n<p id=\"email-blad\" role=\"alert\">Błąd: wpisz adres w formacie nazwa@domena.pl</p>"
        }
      }
    ]
  },
  {
    "id": "required-not-marked",
    "keywords": [
      "pola wymagane",
      "gwiazdka",
      "required",
      "obowiązkowe pola",
      "instrukcja formularza"
    ],
    "criteria": [
      "3.3.2",
      "1.3.1"
    ],
    "alsoConsider": [
      "3.3.1",
      "4.1.2"
    ],
    "severity": "Priorytet 2",
    "title": "Pola wymagane nieoznaczone lub gwiazdka bez wyjaśnienia",
    "description": "Pola formularza są oznaczone symbolem (np. *), ale nigdzie nie wyjaśniono, co on oznacza, albo pól wymaganych w ogóle nie oznaczono i nie wskazano ich programowo.",
    "userImpact": "Osoby korzystające z czytnika ekranu i z zaburzeniami poznawczymi nie wiedzą, które pola trzeba wypełnić, i popełniają błędy przy wysyłaniu formularza.",
    "fixes": [
      {
        "label": "Instrukcja i atrybut",
        "text": "Dodaj przed formularzem objaśnienie „* — pole wymagane” oraz oznacz pola atrybutem required lub aria-required.",
        "code": {
          "language": "html",
          "code": "<p>Pola oznaczone * są wymagane.</p>\n<label for=\"imie\">Imię *</label>\n<input id=\"imie\" required autocomplete=\"given-name\">"
        }
      }
    ]
  },
  {
    "id": "fieldset-legend-missing",
    "keywords": [
      "fieldset",
      "legend",
      "grupa pól",
      "radio",
      "przyciski opcji",
      "checkbox",
      "płeć"
    ],
    "criteria": [
      "1.3.1",
      "3.3.2"
    ],
    "severity": "Priorytet 2",
    "title": "Grupy pól (przyciski opcji, pola wyboru) bez fieldset i legend",
    "description": "Powiązane pola (np. przyciski opcji do wyboru jednej z odpowiedzi, grupa pól wyboru) nie są zgrupowane elementem fieldset i nie mają opisu legend.",
    "userImpact": "Osoba korzystająca z czytnika ekranu słyszy same odpowiedzi bez pytania, więc nie wie, czego dotyczy wybór.",
    "fixes": [
      {
        "label": "fieldset z legend",
        "text": "Otocz grupę pól elementem fieldset i opisz ją legend.",
        "code": {
          "language": "html",
          "code": "<fieldset>\n  <legend>Płeć</legend>\n  <label><input type=\"radio\" name=\"plec\" value=\"k\"> Kobieta</label>\n  <label><input type=\"radio\" name=\"plec\" value=\"m\"> Mężczyzna</label>\n</fieldset>"
        }
      }
    ]
  },
  {
    "id": "auto-context-change",
    "keywords": [
      "wyszukiwarka bez przycisku",
      "automatyczna zmiana",
      "zmiana kontekstu",
      "wyniki po wpisaniu",
      "brak przycisku szukaj"
    ],
    "criteria": [
      "3.2.2"
    ],
    "alsoConsider": [
      "4.1.3"
    ],
    "severity": "Priorytet 2",
    "title": "Wyniki lub treść zmieniają się po wpisaniu danych, bez przycisku",
    "description": "Pole wyszukiwania lub filtr nie ma przycisku zatwierdzenia; wyniki lub treść strony zmieniają się automatycznie po wpisaniu danych, bez uprzedzenia. Przed zapisaniem naruszenia oceń, czy zmiana jest zmianą kontekstu (3.2.2), czy tylko aktualizacją treści (wtedy 4.1.3).",
    "userImpact": "Osoby korzystające z czytnika ekranu i lupy mogą nie zauważyć aktualizacji treści, a zmiany w trakcie pisania dezorientują.",
    "fixes": [
      {
        "label": "Przycisk zatwierdzenia",
        "text": "Dodaj widoczny, podpisany przycisk „Szukaj” obok pola i uruchamiaj wyszukiwanie po jego użyciu.",
        "code": {
          "language": "html",
          "code": "<form role=\"search\">\n  <label for=\"q\">Szukaj</label>\n  <input id=\"q\" type=\"search\">\n  <button type=\"submit\">Szukaj</button>\n</form>"
        }
      },
      {
        "label": "Komunikat o wynikach",
        "text": "Jeśli wyniki aktualizują się na bieżąco, ogłoś liczbę wyników w obszarze role=\"status\"."
      }
    ]
  },
  {
    "id": "contrast-over-media",
    "keywords": [
      "kontrast na zdjęciu",
      "tekst na wideo",
      "slider",
      "nazwa na tle zdjęcia",
      "baner",
      "maska"
    ],
    "criteria": [
      "1.4.3"
    ],
    "alsoConsider": [
      "1.4.11"
    ],
    "severity": "Priorytet 1",
    "title": "Tekst lub kontrolki na zmieniającym się tle (slider, wideo, zdjęcie)",
    "description": "Tekst (np. napis w sliderze, nazwa podmiotu) jest umieszczony na zmieniającym się zdjęciu lub wideo; na części klatek kontrast spada poniżej wymaganego. Zmierzona wartość: [wpisz, np. 1,3:1].",
    "userImpact": "Osoby słabowidzące i korzystające z ekranu w słońcu nie mogą odczytać części informacji w określonych momentach pokazu.",
    "fixes": [
      {
        "label": "Maska pod tekstem",
        "text": "Dodaj ciemną maskę lub jednolite tło pod tekstem, aby kontrast był zachowany w każdej klatce.",
        "code": {
          "language": "css",
          "code": ".slajd__tekst { background: rgba(0, 0, 0, .7); color: #fff; padding: .5rem 1rem; }"
        }
      },
      {
        "label": "Zmiana układu",
        "text": "Przesuń tekst poza obszar zmieniających się zdjęć (np. pod baner)."
      }
    ]
  },
  {
    "id": "contrast-high-mode",
    "keywords": [
      "wysoki kontrast",
      "tryb kontrastowy",
      "wersja kontrastowa",
      "przycisk w górę niewidoczny",
      "forced colors"
    ],
    "criteria": [
      "1.4.3",
      "1.4.11"
    ],
    "severity": "Priorytet 1",
    "title": "Elementy niewidoczne lub o niskim kontraście w trybie wysokiego kontrastu",
    "description": "W wersji strony o podwyższonym kontraście (lub w trybie wysokiego kontrastu systemu) część elementów (np. przycisk „do góry”, strzałki karuzeli, grafiki) nie zmienia kolorów i jest niewidoczna lub ma kontrast poniżej 3:1 (np. 2,37:1).",
    "userImpact": "Osoby słabowidzące, które polegają na trybie wysokiego kontrastu, nie widzą części elementów i nie mogą z nich korzystać.",
    "fixes": [
      {
        "label": "Style dla trybu kontrastowego",
        "text": "Dopasuj kolory elementów do trybu wysokiego kontrastu i sprawdź je po jego włączeniu.",
        "code": {
          "language": "css",
          "code": "@media (forced-colors: active) {\n  .do-gory { border: 2px solid ButtonText; color: ButtonText; background: ButtonFace; }\n}"
        }
      }
    ]
  },
  {
    "id": "text-resize",
    "keywords": [
      "powiększenie tekstu",
      "200%",
      "rozmiar czcionki",
      "ucięty tekst",
      "skalowanie tekstu",
      "stopka zasłonięta",
      "przycięty tekst"
    ],
    "criteria": [
      "1.4.4"
    ],
    "alsoConsider": [
      "1.4.10",
      "1.4.12"
    ],
    "severity": "Priorytet 1",
    "title": "Tekst ucięty, zasłonięty lub poza ekranem po powiększeniu do 200%",
    "description": "Po powiększeniu tekstu do 200% (lub zwiększeniu rozmiaru czcionki w systemie) część elementów wychodzi poza ekran, wymaga przewijania w poziomie, jest przycięta lub zasłonięta (np. menu, stopka, kafelki z nazwami). Dotyczy: [wpisz elementy].",
    "userImpact": "Osoby słabowidzące, które powiększają tekst, tracą część treści i funkcji albo muszą przewijać w dwóch kierunkach.",
    "fixes": [
      {
        "label": "Elastyczne jednostki",
        "text": "Używaj jednostek względnych (rem, em; w aplikacjach: sp na Androidzie i Dynamic Type na iOS) i nie ustawiaj stałej wysokości kontenerów z tekstem.",
        "code": {
          "language": "css",
          "code": ".kafel { min-height: 4rem; padding: .75rem 1rem; }\n.kafel__nazwa { font-size: 1rem; overflow-wrap: anywhere; }"
        }
      },
      {
        "label": "Test po poprawce",
        "text": "Sprawdź stronę po powiększeniu do 200% (i ustawienia czcionki w systemie): nic nie jest ucięte ani zasłonięte, nie ma przewijania poziomego."
      }
    ]
  },
  {
    "id": "text-spacing",
    "keywords": [
      "odstępy w tekście",
      "interlinia",
      "text spacing",
      "nachodzący tekst",
      "1,5",
      "0,12"
    ],
    "criteria": [
      "1.4.12"
    ],
    "severity": "Priorytet 2",
    "title": "Tekst nachodzi na siebie po zwiększeniu odstępów",
    "description": "Po ustawieniu odstępów zgodnie z kryterium (wysokość wiersza 1,5, akapity 2×, litery 0,12×, wyrazy 0,16× rozmiaru czcionki) fragmenty tekstu nachodzą na siebie, są obcinane lub wychodzą poza obszar (np. link „Wszystkie aktualności” nachodzi na treść). Dotyczy: [wpisz elementy].",
    "userImpact": "Osoby z dysleksją i słabowidzące, które zwiększają odstępy, nie mogą odczytać nałożonych fragmentów.",
    "fixes": [
      {
        "label": "Układ odporny na odstępy",
        "text": "Usuń stałe wysokości i przycinanie, pozwól kontenerom rosnąć razem z tekstem (min-height zamiast height, overflow: visible).",
        "code": {
          "language": "css",
          "code": ".kafel { height: auto; min-height: 5rem; overflow: visible; }"
        }
      },
      {
        "label": "Test",
        "text": "Przetestuj stronę skryptozakładką Text Spacing lub narzędziem ARC Toolkit."
      }
    ]
  },
  {
    "id": "orientation-locked",
    "keywords": [
      "orientacja",
      "obrót ekranu",
      "poziomo",
      "pionowo",
      "blokada orientacji",
      "aplikacja mobilna",
      "menu ucięte"
    ],
    "criteria": [
      "1.3.4"
    ],
    "severity": "Priorytet 1",
    "title": "Treść ograniczona do jednej orientacji ekranu",
    "description": "Treść lub funkcje (np. ekran logowania, menu) są dostępne tylko w jednej orientacji ekranu albo po zmianie orientacji część treści jest ucięta. Dotyczy: [wpisz ekran/widok].",
    "userImpact": "Osoby, których urządzenie jest zamocowane w stałej orientacji (np. na wózku), oraz osoby, które muszą obrócić ekran dla większego tekstu, nie mogą korzystać z funkcji.",
    "fixes": [
      {
        "label": "Zdjąć blokadę",
        "text": "Usuń ograniczenie orientacji (na iOS dopuść wszystkie wartości UISupportedInterfaceOrientations w Info.plist; na Androidzie nie ustawiaj android:screenOrientation) i sprawdź układ w obu orientacjach."
      },
      {
        "label": "Strony www",
        "text": "Nie ograniczaj układu transformacjami CSS i zapewnij, aby menu nie było przycinane po obrocie."
      }
    ]
  },
  {
    "id": "mobile-menu-broken",
    "keywords": [
      "hamburger",
      "menu mobilne",
      "menu responsywne",
      "zwijane menu",
      "podmenu",
      "przycisk menu"
    ],
    "criteria": [
      "2.1.1",
      "4.1.2",
      "1.4.10"
    ],
    "alsoConsider": [
      "1.3.1"
    ],
    "severity": "Priorytet 1",
    "title": "Menu mobilne (hamburger) nie działa lub nie jest dostępne",
    "description": "Przycisk menu hamburgerowego jest elementem div lub nie ma nazwy i stanu; nie łapie fokusu, po kliknięciu nie ładuje treści (strona się tylko wyszarza) albo duplikuje menu główne. Przy powiększeniu 200% menu nie zwija się do przycisku. Dotyczy: [wpisz widoki].",
    "userImpact": "Osoby korzystające z klawiatury i czytnika ekranu nie mogą otworzyć menu, a użytkownicy telefonów i powiększenia tracą dostęp do nawigacji.",
    "fixes": [
      {
        "label": "Przycisk menu",
        "text": "Zbuduj hamburger jako button z nazwą i stanem; ukrytego menu nie pozostawiaj w kolejności tabulacji.",
        "code": {
          "language": "html",
          "code": "<button type=\"button\" aria-expanded=\"false\" aria-controls=\"menu-glowne\">Menu</button>\n<nav id=\"menu-glowne\" aria-label=\"Menu główne\" hidden>…</nav>"
        }
      }
    ]
  },
  {
    "id": "motion-activation",
    "keywords": [
      "potrząśnięcie",
      "gest",
      "ruch urządzenia",
      "aktywowanie ruchem",
      "switch access",
      "aplikacja mobilna"
    ],
    "criteria": [
      "2.5.4"
    ],
    "alsoConsider": [
      "2.5.1"
    ],
    "severity": "Priorytet 2",
    "title": "Funkcja uruchamiana ruchem urządzenia lub gestem bez alternatywy",
    "description": "Funkcja aplikacji jest uruchamiana ruchem urządzenia (np. potrząśnięciem, obróceniem) lub gestem, a nie ma równoważnego przycisku. Przy obsłudze przełącznikiem (Switch Access/Control) dojście do menu głównego wymaga długiej ścieżki. Dotyczy: [wpisz funkcję].",
    "userImpact": "Osoby z ograniczoną sprawnością rąk, korzystające z urządzeń pomocniczych lub z telefonem zamocowanym na uchwycie, nie mogą wykonać funkcji lub robią to po bardzo długiej ścieżce.",
    "fixes": [
      {
        "label": "Alternatywa w interfejsie",
        "text": "Dodaj przycisk lub przełącznik wykonujący tę samą funkcję (np. „Cofnij” zamiast potrząśnięcia) oraz opcję wyłączenia reakcji na ruch w ustawieniach."
      }
    ]
  },
  {
    "id": "mobile-label-missing",
    "keywords": [
      "contentDescription",
      "accessibilityLabel",
      "android",
      "ios",
      "talkback",
      "voiceover",
      "etykieta w aplikacji",
      "hint"
    ],
    "criteria": [
      "1.1.1",
      "4.1.2"
    ],
    "alsoConsider": [
      "1.3.1"
    ],
    "severity": "Priorytet 1",
    "title": "Aplikacja mobilna: element bez etykiety lub z błędną etykietą dla czytnika ekranu",
    "description": "W aplikacji mobilnej element (ikona, obraz, kafelek, pole edycji) nie ma etykiety, ma zbyt długą lub błędną etykietę, albo czytnik ekranu odczytuje atrybut (np. podpowiedź) zamiast treści pola. Dotyczy: [wpisz ekran i system].",
    "userImpact": "Osoba korzystająca z czytnika ekranu (TalkBack, VoiceOver) słyszy niezrozumiałe lub błędne informacje i nie wie, do czego służy element.",
    "fixes": [
      {
        "label": "Android",
        "text": "Nadaj elementom etykietę contentDescription, grupuj wiersze listy w jeden element, a polom edycji ustaw android:hint.",
        "code": {
          "language": "xml",
          "code": "<ImageButton\n    android:id=\"@+id/zamknij\"\n    android:contentDescription=\"@string/zamknij\" />"
        }
      },
      {
        "label": "iOS",
        "text": "Ustaw accessibilityLabel (i accessibilityHint) dla elementów, które tego wymagają; wiersz listy grupuj w jeden element dostępności."
      }
    ]
  },
  {
    "id": "doc-pdf-scan",
    "keywords": [
      "skan",
      "pdf",
      "dokument",
      "obraz pdf",
      "ocr",
      "plik graficzny",
      "skan dokumentu",
      "dostępny pdf"
    ],
    "criteria": [
      "1.1.1",
      "1.4.5"
    ],
    "alsoConsider": [
      "2.4.2",
      "3.1.1",
      "1.3.1"
    ],
    "severity": "Priorytet 1",
    "title": "Dokument PDF będący skanem (obraz tekstu)",
    "description": "Dokument udostępniony do pobrania to skan (obraz tekstu) bez warstwy tekstowej, tytułu, języka i znaczników struktury. Dotyczy: [wpisz nazwy dokumentów].",
    "userImpact": "Osoby niewidome nie mogą odczytać dokumentu czytnikiem ekranu, a osoby słabowidzące nie mogą dopasować tekstu (powiększyć, zmienić kontrast, wyszukać w nim frazy).",
    "fixes": [
      {
        "label": "Dostępna wersja z edytowalnego źródła",
        "text": "Przygotuj dokument w edytorze (Word) z nagłówkami, listami i tekstem alternatywnym, a następnie wyeksportuj tagowany PDF (w Wordzie: Plik, Eksportuj, Opcje, Tagi struktury dokumentu)."
      },
      {
        "label": "OCR jako rozwiązanie awaryjne",
        "text": "Jeśli nie ma wersji edytowalnej, rozpoznaj tekst (OCR), sprawdź go i dopisz strukturę, tytuł oraz język; albo udostępnij treść na stronie w HTML."
      },
      {
        "label": "Dokumenty archiwalne",
        "text": "Dla podmiotów publicznych ustawa wyłącza z wymogu pliki biurowe opublikowane przed 23 września 2018 r., o ile nie są potrzebne do aktywnych procesów administracyjnych. Sprawdź wyłączenie przed zaleceniem usunięcia dokumentu."
      }
    ]
  },
  {
    "id": "doc-no-headings",
    "keywords": [
      "dokument",
      "word",
      "pdf",
      "nagłówki w dokumencie",
      "style",
      "spis treści",
      "regulamin",
      "tagowanie"
    ],
    "criteria": [
      "1.3.1"
    ],
    "alsoConsider": [
      "2.4.6"
    ],
    "severity": "Priorytet 1",
    "title": "Dokument bez struktury nagłówków i list",
    "description": "W dokumencie (PDF, DOCX) nagłówki nie są oznaczone stylami, numeracja jest wpisana ręcznie, a spis treści nie ma odnośników. W PDF brakuje znaczników struktury.",
    "userImpact": "Osoby korzystające z czytnika ekranu lub klawiatury nie mogą wygodnie poruszać się po dokumencie, nie wiedzą, gdzie się zaczyna sekcja ani ile jest pozycji listy.",
    "fixes": [
      {
        "label": "Style nagłówków i listy",
        "text": "Oznaczaj tytuły stylami Nagłówek 1–3 w zachowanej hierarchii, używaj prawdziwych list i generuj spis treści z odnośnikami."
      },
      {
        "label": "Eksport do PDF",
        "text": "Przed eksportem sprawdź dostępność w edytorze, a przy eksporcie zaznacz Tagi struktury dokumentu dla ułatwień dostępu. Sprawdź wynik w kontrolerze PDF."
      }
    ]
  },
  {
    "id": "doc-no-title-lang",
    "keywords": [
      "tytuł dokumentu",
      "metadane",
      "język dokumentu",
      "właściwości pliku",
      "pdf"
    ],
    "criteria": [
      "2.4.2",
      "3.1.1"
    ],
    "severity": "Priorytet 2",
    "title": "Dokument bez tytułu i języka w metadanych",
    "description": "Plik nie ma ustawionego tytułu (title) w metadanych albo wyświetla się nazwa pliku, i nie ma ustawionego języka dokumentu.",
    "userImpact": "Osoby korzystające z czytnika ekranu słyszą nazwę pliku zamiast tytułu, a wymowa tekstu może być nieprawidłowa.",
    "fixes": [
      {
        "label": "Uzupełnić metadane",
        "text": "Wpisz tytuł i język we właściwościach dokumentu (Word: Plik, Informacje, Właściwości; PDF: Właściwości dokumentu, wyświetlaj tytuł dokumentu) i ustaw język polski."
      }
    ]
  },
  {
    "id": "doc-table-merged",
    "keywords": [
      "tabela w dokumencie",
      "scalone komórki",
      "excel",
      "xlsx",
      "arkusz",
      "wiersz nagłówka",
      "tabela wielostronicowa"
    ],
    "criteria": [
      "1.3.1",
      "1.3.2"
    ],
    "severity": "Priorytet 1",
    "title": "Tabela w dokumencie lub arkuszu ze scalonymi komórkami i bez wiersza nagłówka",
    "description": "Rozbudowane tabele w dokumentach (DOC, PDF) lub arkuszach (XLSX) nie mają oznaczonego wiersza nagłówka, zawierają scalone komórki, puste znaczniki i nie powtarzają nagłówka na kolejnych stronach. W arkuszu dane nie są sformatowane jako tabela.",
    "userImpact": "Osoba korzystająca z czytnika ekranu nie jest w stanie przypisać wartości do nagłówków, a kolejność odczytu jest zaburzona.",
    "fixes": [
      {
        "label": "Prostsza struktura",
        "text": "Podziel dużą tabelę na mniejsze (scalone komórki zamień na tytuły kolejnych tabel), oznacz wiersz nagłówka i ustaw jego powtarzanie na każdej stronie."
      },
      {
        "label": "Arkusz kalkulacyjny",
        "text": "Sformatuj dane jako tabelę (Formatuj jako tabelę), ustaw wiersz nagłówka, usuń scalenia i uzupełnij tytuł pliku."
      }
    ]
  },
  {
    "id": "doc-form-fields",
    "keywords": [
      "formularz w dokumencie",
      "formularz pdf",
      "wielokropki",
      "pola do wypełnienia",
      "wniosek",
      "aktywny pdf"
    ],
    "criteria": [
      "1.3.1",
      "3.3.2",
      "4.1.2"
    ],
    "severity": "Priorytet 1",
    "title": "Formularz w dokumencie (Word, PDF) bez pól i powiązanych etykiet",
    "description": "Formularze udostępniane do pobrania nie mają pól wypełniania z przypisanymi etykietami (wielokropki zamiast pól, etykiety pod polem, układ w tabeli bez nagłówków). Nie można ich wypełnić cyfrowo.",
    "userImpact": "Osoba niewidoma nie może samodzielnie wypełnić wniosku, a osoby z trudnościami ruchowymi nie mogą go wypełnić na komputerze.",
    "fixes": [
      {
        "label": "Aktywny formularz",
        "text": "Przygotuj formularz jako aktywny PDF z polami o opisanych nazwach, właściwą kolejnością tabulacji i etykietami nad polami albo udostępnij formularz online."
      }
    ]
  },
  {
    "id": "video-audio-description",
    "keywords": [
      "audiodeskrypcja",
      "alternatywa dla wideo",
      "film bez opisu",
      "transkrypcja",
      "nagranie audio",
      "opis filmu"
    ],
    "criteria": [
      "1.2.3",
      "1.2.5"
    ],
    "alsoConsider": [
      "1.2.1"
    ],
    "severity": "Priorytet 1",
    "title": "Nagranie wideo bez audiodeskrypcji lub alternatywy tekstowej",
    "description": "Nagrania wideo (i nagrania tylko audio) nie mają audiodeskrypcji ani równoważnej alternatywy tekstowej opisującej ważne treści wizualne (akcje, gesty, sceneria) lub treść dźwięku. Dotyczy: [wpisz nagrania].",
    "userImpact": "Osoby niewidome i słabowidzące nie mają dostępu do treści wizualnych materiału; osoby niesłyszące do treści nagrania audio bez transkrypcji.",
    "fixes": [
      {
        "label": "Opis tekstowy lub audiodeskrypcja",
        "text": "Dodaj nad filmem krótki tekst opisujący, o czym jest film i co się w nim dzieje (np. w rozwijanym elemencie dostępnym z klawiatury) albo osobną wersję z audiodeskrypcją z osobnym nagłówkiem."
      },
      {
        "label": "Nagrania audio",
        "text": "Do nagrań dźwiękowych dodaj transkrypcję tekstową."
      }
    ]
  },
  {
    "id": "nav-inconsistent-order",
    "keywords": [
      "spójna nawigacja",
      "menu",
      "podmenu",
      "kolejność menu",
      "różne menu"
    ],
    "criteria": [
      "3.2.3"
    ],
    "alsoConsider": [
      "1.3.2",
      "2.4.3"
    ],
    "severity": "Priorytet 2",
    "title": "Powtarzalna nawigacja ma różną kolejność lub strukturę na podstronach",
    "description": "Elementy nawigacji (menu, podmenu) pojawiają się w innej kolejności lub strukturze na różnych podstronach, np. podmenu bieżącej sekcji jest wstawione w środku menu głównego i zmienia kolejność tabulacji.",
    "userImpact": "Użytkownicy klawiatury i czytnika ekranu nie mogą polegać na stałej kolejności elementów, więc muszą każdorazowo uczyć się układu.",
    "fixes": [
      {
        "label": "Stała kolejność",
        "text": "Zachowaj te same elementy menu w tej samej kolejności na każdej stronie, a podmenu udostępnij na żądanie (po aktywacji elementu nadrzędnego) zamiast wstawiać je do tabulacji."
      }
    ]
  },
  {
    "id": "no-multiple-ways",
    "keywords": [
      "wiele dróg",
      "wyszukiwarka",
      "mapa serwisu",
      "nawigacja",
      "brak wyszukiwarki"
    ],
    "criteria": [
      "2.4.5"
    ],
    "severity": "Priorytet 2",
    "title": "Brak drugiej drogi do podstron (wyszukiwarka lub mapa serwisu)",
    "description": "W serwisie nie ma wyszukiwarki ani mapy serwisu, a część podstron jest dostępna tylko pośrednio (nie ma do nich linku ze strony głównej).",
    "userImpact": "Osoby z trudnościami poznawczymi i korzystające z czytnika ekranu mają utrudnione odnalezienie informacji tylko przez menu.",
    "fixes": [
      {
        "label": "Druga droga",
        "text": "Dodaj wyszukiwarkę lub mapę serwisu i zapewnij linki do wszystkich ważnych podstron."
      }
    ]
  },
  {
    "id": "declaration-incomplete",
    "keywords": [
      "deklaracja dostępności",
      "a11y-komunikacja",
      "tłumacz pjm",
      "dostępność informacyjno-komunikacyjna",
      "ustawa",
      "brak alternatywnego kontaktu"
    ],
    "criteria": [
      "pl:art. 10"
    ],
    "severity": "Priorytet 2",
    "title": "Deklaracja dostępności niekompletna lub niezgodna ze wzorem",
    "description": "W deklaracji dostępności brakuje obowiązkowych elementów, np. sekcji a11y-komunikacja (informacja o dostępności komunikacyjno-informacyjnej: możliwość skorzystania z tłumacza języka migowego online, kontakt tekstowy, SMS, formularz) albo linki w deklaracji są opisane niezgodnie z działaniem. Podstawa: art. 10 ustawy z 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych. To wymóg ustawy, nie kryterium WCAG.",
    "userImpact": "Osoby z niepełnosprawnościami nie mają informacji o sposobach kontaktu z podmiotem; osoby niesłyszące bywają wykluczone z usługi dostępnej tylko przez rozmowę telefoniczną.",
    "fixes": [
      {
        "label": "Uzupełnić deklarację",
        "text": "Uzupełnij deklarację według struktury z dokumentu Warunki techniczne publikacji oraz struktura dokumentu elektronicznego deklaracji dostępności, w tym sekcję a11y-komunikacja."
      },
      {
        "label": "Alternatywne kanały kontaktu",
        "text": "Zapewnij sposób kontaktu inny niż rozmowa telefoniczna (formularz, SMS, e-mail, tłumacz języka migowego online)."
      }
    ]
  },
  {
    "id": "plain-language",
    "keywords": [
      "prosty język",
      "trudny język",
      "czytelność tekstu",
      "język urzędowy",
      "zrozumiałość",
      "indeks mglistości"
    ],
    "criteria": [
      "3.1.5"
    ],
    "severity": "Priorytet 3",
    "title": "Treść napisana zbyt trudnym językiem",
    "description": "Analiza tekstów wskazuje, że do zrozumienia treści potrzeba wielu lat edukacji; teksty są pisane językiem urzędowym lub prawniczym. To kryterium poziomu AAA — w raporcie ujmij jako rekomendację. Dotyczy: [wpisz strony].",
    "userImpact": "Osoby z niskim wykształceniem, niepełnosprawnością intelektualną, osoby niesłyszące (dla których polski bywa drugim językiem) i cudzoziemcy nie zrozumieją informacji, szczególnie ważnych w usługach publicznych i zdrowotnych.",
    "fixes": [
      {
        "label": "Prosty język",
        "text": "Przepisz najważniejsze teksty prostym językiem: krótkie zdania, jedna myśl w zdaniu, bez żargonu i skrótów, ważne informacje na początku; sprawdź czytelność narzędziem (np. indeks mglistości)."
      },
      {
        "label": "Wersja uproszczona",
        "text": "Dla długich, formalnych dokumentów dodaj krótkie streszczenie lub wersję w języku łatwym do czytania."
      }
    ]
  }
];

const fold = (value) => String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l");

// Wyszukiwanie od problemu: każde słowo zapytania musi wystąpić w tytule, słowach kluczowych, opisie lub numerach kryteriów.
export function searchBlocks(query, blocks = ISSUE_BLOCKS) {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return blocks
    .map((block) => {
      const title = fold(block.title);
      const hay = [title, fold((block.keywords || []).join(" ")), fold(block.description), block.criteria.join(" ")].join(" ");
      if (!words.every((word) => hay.includes(word))) return null;
      return { block, score: words.filter((word) => title.includes(word)).length * 2 + (title.startsWith(words[0]) ? 3 : 0) };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.block);
}

export function blocksForCriteria(ids = []) {
  if (!ids.length) return ISSUE_BLOCKS;
  const set = new Set(ids);
  return ISSUE_BLOCKS.filter((block) => block.criteria.some((id) => set.has(id)));
}

export function blockById(id) {
  return ISSUE_BLOCKS.find((block) => block.id === id) || null;
}
