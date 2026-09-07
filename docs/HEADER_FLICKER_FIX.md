# Stabilny nagłówek podczas przewijania

## Przyczyna i zakres

Nagranie pokazuje naprzemienne wyświetlanie pełnego logo i ikony. Historyczny
`public/assets/header.js` przełączał klasę `header-compact` przy `scrollY > 80`.
Klasa zmieniała szerokość logo z 300 do 44 px i wysokość z 54 do 44 px.
Przeglądarka kompensowała zmianę układu przez kotwiczenie przewijania.
W lokalnym odtworzeniu w Chromium jedno przewinięcie do 85 px uruchamiało pętlę:
85 → 75 → 85 px, a wysokość nagłówka zmieniała się między około 72 i 62 px.
Test zarejestrował 61 przełączeń w 1,2 sekundy, po czym zatrzymał nasłuchiwanie.

Commit `c94ebe5` wprowadził progi 120/40 px, ale nadal zmieniał układ strony.
Nie zmienił też adresu `header.js?v=3`. Konfiguracja Vercel pozwala przechowywać
zasoby `/assets/` przez rok (`immutable`), więc przeglądarka mogła nadal używać
starszego kodu. Nie ustalono zawartości cache przeglądarki autora nagrania.

## Rozwiązanie

- Usunięto przełączanie nagłówka przy przewijaniu oraz powiązane reguły CSS.
- Pełne logo na desktopie i ikona do 992 px zależą wyłącznie od szerokości okna.
  Strona główna zachowuje własny układ z pełnym logo.
- Usunięto odwołania do skryptu z publicznych stron.
  Plik `header.js` pozostaje jako zgodność dla wcześniej wygenerowanych stron.
- Zmieniono adres wspólnego arkusza na `styles.css?v=19`. Stary skrypt nie ma już
  reguł CSS, którymi mógłby poruszać stroną.
- Zachowano istniejące logo, kolory, fokus i responsywny nagłówek statyczny na
  małych ekranach. Źródłem wyglądu były istniejące zasoby projektu.

## Weryfikacja

`tests/browser/header-stability.mjs` używa Playwright z istniejącego projektu
`a11yfirst-lab`; nie dodaje zależności. Strony i zasoby są podawane z lokalnego
`public/` przez przechwytywanie żądań. Zewnętrzne połączenia są blokowane.

```sh
node tests/browser/header-stability.mjs
node --check public/assets/header.js
git diff --check
```

Jeśli zainstalowany Chromium ma inną wersję niż domyślna wersja Playwright,
ustaw `CHROMIUM_PATH` na ścieżkę jego pliku wykonywalnego. Opcjonalna zmienna
`HEADER_BEFORE_DIR` wskazuje katalog z pierwotnymi plikami `styles.css`,
`header.js`, `index.html`, aby sprawdzić, czy test wykrywa błąd sprzed poprawki.
`HEADER_PUBLIC_DIR` pozwala sprawdzić osobną kopię katalogu `public/`, na przykład
dokładną zawartość przygotowanego commita.

Test obejmuje sześć stron (siedem, jeśli dostępna jest strona webinarów), pięć
szerokości 320–1440 px, dodatkowy scenariusz
z odstępami tekstu, stabilność rozmiarów i pozycji przewijania, widoczność linków
nagłówka, skip link z klawiatury i ponowne wstrzyknięcie starego skryptu.
Sprawdza też adresy CSS i brak skryptu nagłówka we wszystkich publicznych stronach
używających logo. Zrzuty ekranu zapisuje w ignorowanym `output/header-stability/`.

Wynik pełnej wersji lokalnej: 42 scenariusze przeglądarkowe, kontrola 131 stron HTML, skip link
i test starego skryptu zakończone powodzeniem. Przeszły również 32 istniejące
testy Node, kontrola nawigacji 87 kryteriów WCAG oraz walidacja pięciu stron
renderowanych przez CMS. Test regresji wykrywa zmianę układu na kodzie sprzed
poprawki. Zrzuty desktopu i telefonu sprawdzono wizualnie.

Przed pushem osobno sprawdzono dokładny zakres commita, bez wcześniejszych
niezapisanych zmian: 36 scenariuszy przeglądarkowych i 128 stron HTML, wszystkie
z wynikiem pozytywnym, również skip link i odporność na stary skrypt z cache.

## Wdrożenie i ograniczenia

Wdrożenie serwisu używa gotowego katalogu `public/`; główny skrypt `npm run build`
dotyczy osobnych aplikacji workspace. Szablony CMS sprawdzono przez renderowanie
i walidację w pamięci, bez nadpisywania treści w `public/`.

Commit obejmuje wyłącznie poprawkę nagłówka, jej test i ten opis. Wcześniejsze
zmiany treści, formularzy, konfiguracji oraz nieśledzony CMS i webinary pozostają
lokalnie. Lokalny szablon CMS i renderer wydarzeń również otrzymały poprawkę;
należy zachować ją przy późniejszym dodawaniu tych modułów do repozytorium.

Po publikacji trzeba sprawdzić pobranie
`styles.css?v=19` oraz przewijanie na produkcji. Karty otwarte przed wdrożeniem
wymagają ponownego załadowania dokumentu. Testy dotyczą Chromium, bez zewnętrznego
audytora SiteLint; nie zastępują pełnego audytu dostępności ani testów Safari.
