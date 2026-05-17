# WCAG prostym językiem: rozpoznanie techniczne

Data rozpoznania: 2026-05-16

## 1. Gdzie znajdują się treści kryteriów WCAG

Sekcja `WCAG prostym językiem` jest obecnie utrzymywana jako statyczny HTML w katalogu wdrożeniowym `public/`.

Najważniejsze pliki:

- `public/wcag-prostym-jezykiem.html` - strona zbiorcza z listą kryteriów sukcesu.
- `public/wcag-prostym-jezykiem/*.html` - podstrony pojedynczych kryteriów.
- `public/assets/styles.css` - wspólne style strony, kart kryteriów i podstron WCAG.
- `public/assets/header.js` - prosty skrypt zmieniający stan nagłówka po przewinięciu.
- `vercel.json` - konfiguracja statycznego wdrożenia Vercel z `outputDirectory: "public"` i `cleanUrls: true`.

Nie znalazłem osobnych plików Markdown, MDX, JSON, TS ani JS, które byłyby źródłem danych dla obecnej listy kryteriów lub podstron `public/wcag-prostym-jezykiem/*.html`. Treści są wpisane bezpośrednio w plikach HTML.

W repo istnieje katalog `cms/` z plikowym generatorem stron z JSON, ale obecna sekcja `WCAG prostym językiem` nie jest przechowywana w `cms/content/pages/*.json` i nie wygląda na generowaną przez ten CMS w aktualnym stanie.

## 2. Jak generowane są podstrony

Podstrony kryteriów są gotowymi plikami HTML w:

```text
public/wcag-prostym-jezykiem/
```

W katalogu jest 87 plików `.html` z kryteriami, np.:

- `public/wcag-prostym-jezykiem/1-1-1-tresc-nietekstowa.html`
- `public/wcag-prostym-jezykiem/2-4-7-widoczny-fokus.html`
- `public/wcag-prostym-jezykiem/3-3-1-identyfikacja-bledu.html`

Każda podstrona ma podobny ręczny szablon: metadane SEO i Open Graph, JSON-LD typu `Article`, skip link, globalny nagłówek, breadcrumbs, hero, sekcję `.knowledge-article.wcag-detail`, panele `.knowledge-panel`, źródła, nawigację między kryteriami, stopkę i `../assets/header.js`.

Nie ma obecnie jawnego generatora dla tych 87 podstron. Jeśli powstał kiedyś skrypt generujący, nie jest widoczny w aktualnych plikach projektu.

## 3. Jak działa routing dla `/wcag-prostym-jezykiem`

Projekt jest statycznym wdrożeniem Vercel. W głównym `vercel.json` ustawiono:

```json
{
  "framework": null,
  "outputDirectory": "public",
  "cleanUrls": true
}
```

To oznacza, że pliki HTML z `public/` są wystawiane jako czyste adresy bez rozszerzenia `.html`.

Przykłady:

- `public/wcag-prostym-jezykiem.html` jest dostępne jako `/wcag-prostym-jezykiem`.
- `public/wcag-prostym-jezykiem/1-1-1-tresc-nietekstowa.html` jest dostępne jako `/wcag-prostym-jezykiem/1-1-1-tresc-nietekstowa`.

Linki w sekcji używają już adresów bez `.html`, zgodnie z `cleanUrls`.

## 4. Jakie komponenty są używane

To nie są komponenty frameworka, tylko powtarzalne wzorce HTML i klasy CSS.

Najważniejsze klasy:

- `.skip-link` - link pomijania do głównej treści.
- `.breadcrumbs` - ścieżka okruszków.
- `.hero`, `.page-hero` - hero strony lub podstrony.
- `.eyebrow` i `.subtitle` - etykieta oraz opis w hero.
- `.knowledge-article` - główny wrapper sekcji treści.
- `.knowledge-tabs` - linki do grup kryteriów na stronie zbiorczej.
- `.knowledge-grid` - siatka kart kryteriów.
- `.knowledge-panel` - panel lub karta treści.
- `.wcag-criterion-card` - karta kryterium na stronie zbiorczej.
- `.wcag-detail` - wrapper treści pojedynczego kryterium.
- `.detail-list` - lista punktów wdrożeniowych.
- `.recommended-resources` - lista źródeł.
- `.criterion-navigation` - nawigacja poprzednie/lista/następne.
- `.sr-only` - tekst tylko dla technologii wspomagających.

Wspólny skrypt `public/assets/header.js` dodaje klasę `header-compact` do `body`, gdy strona jest przewinięta ponad 80 px.

## 5. Gdzie najlepiej dodać wspólny szablon podstrony kryterium

Najbezpieczniej nie zaczynać od przebudowy routingu ani całej strony. Rekomendowany kierunek:

1. Zachować obecny output w `public/` jako źródło produkcyjne.
2. Przygotować wzorcową rozbudowę najpierw w jednym istniejącym pliku HTML.
3. Dodać nowe style tylko wtedy, gdy nie wystarczają obecne klasy `.knowledge-panel`, `.detail-list`, `.recommended-resources` i `.criterion-navigation`.
4. Po akceptacji wzorca zdecydować, czy dalsze kryteria rozwijać ręcznie, czy przygotować mały generator tylko dla WCAG, np. przyszłe `content/wcag/*.json` albo `content/wcag/*.md` plus skrypt generujący `public/wcag-prostym-jezykiem/*.html`.

Nie polecam na tym etapie włączać sekcji WCAG do istniejącego `cms/`, bo obecny CMS ma ogólne klocki stron i nie ma jeszcze modelu danych dla 87 kryteriów, źródeł W3C, przykładów kodu, powiązanych kryteriów i grafik edukacyjnych.

## 6. Jak najbezpieczniej rozbudować pojedyncze kryterium

Dla pojedynczego kryterium, np. 1.1.1:

1. Pracować tylko na jednym pliku szczegółu: `public/wcag-prostym-jezykiem/1-1-1-tresc-nietekstowa.html`.
2. Nie zmieniać jeszcze wszystkich 87 podstron.
3. Zachować obecny shell strony: `<head>`, header, breadcrumbs, hero, footer i `header.js`.
4. Zmienić tylko zawartość sekcji `<section class="knowledge-article wcag-detail" aria-labelledby="criterion-title">`.
5. Użyć istniejących klas, jeśli wystarczą.
6. Jeśli potrzebne są nowe style dla kodu, przykładów dobry/zły albo grafiki edukacyjnej, dodać je punktowo w `public/assets/styles.css` pod istniejącymi stylami WCAG.
7. Po rozbudowie sprawdzić desktop, mobile, nawigację klawiaturą, hierarchię nagłówków, linki zewnętrzne, teksty alternatywne i nawigację poprzednie/lista/następne.

## 7. Jak uruchomić projekt lokalnie i co sprawdzić po zmianach

Projekt produkcyjny jest statyczny i nie ma `package.json` w katalogu głównym. Najprostszy lokalny podgląd:

```bash
python3 -m http.server 8080 --directory public
```

Potem otworzyć:

```text
http://127.0.0.1:8080/wcag-prostym-jezykiem.html
http://127.0.0.1:8080/wcag-prostym-jezykiem/1-1-1-tresc-nietekstowa.html
```

Uwaga: lokalny `http.server` nie odtwarza automatycznie Vercel `cleanUrls`, więc w podglądzie lokalnym najpewniej używać adresów z `.html`.

Dostępne komendy CMS, jeśli zmiany dotyczą katalogu `cms/`:

```bash
cd cms
npm run serve
npm run build
npm run build:strict
npm run publish
```

Dla obecnej sekcji WCAG komendy CMS nie są obowiązkowym źródłem prawdy, bo treści WCAG nie są obecnie w danych CMS. Po zmianach w statycznym HTML najważniejsze są: lokalny podgląd, test klawiaturą, sprawdzenie responsywności, sprawdzenie linków, metadanych, canonicali i opcjonalna walidacja HTML.

## 8. Ryzyka przed masową rozbudową treści

- Brak pojedynczego źródła danych: lista kryteriów i podstrony są ręcznie zdublowane w HTML.
- Ryzyko rozjazdu między kartą na stronie zbiorczej a treścią szczegółu.
- Brak generatora utrudnia aktualizację wspólnych elementów, np. źródeł, licencji i nawigacji poprzednie/następne.
- Masowa edycja 87 plików HTML łatwo wprowadzi niespójny HTML, błędne linki albo zaburzoną hierarchię nagłówków.
- Docelowy tutorial będzie znacznie dłuższy niż obecne podstrony i może wymagać nowych klas dla przykładów kodu, przykładów dobry/zły, grafik edukacyjnych i list kontrolnych.
- Trzeba pilnować licencji i źródeł: obecne strony odnoszą się do AAArdvark i CC BY-SA 4.0, a docelowa rozbudowa ma opierać się także na oficjalnych zasobach W3C.
- Przy grafikach edukacyjnych trzeba używać tylko stabilnych lokalnych assetów.
- Trzeba oddzielić praktyczne wyjaśnienia od formalnych wymagań WCAG, żeby nie dopisać wymagań, których w kryterium nie ma.
