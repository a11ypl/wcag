# WCAG prostym językiem: standard redakcyjny podstrony kryterium

Ten dokument opisuje roboczy standard dla rozbudowanych podstron kryteriów sukcesu WCAG w sekcji `WCAG prostym językiem`.

Cel: tworzyć praktyczne, polskie tutoriale, które pomagają redaktorom, projektantom, deweloperom i audytorom zrozumieć kryterium, wdrożyć je i sprawdzić bez tonu prawniczego.

## Zasady ogólne

- Pisz po polsku, prosto i konkretnie.
- Wyjaśniaj kryterium praktycznie, ale nie zmieniaj jego zakresu.
- Nie kopiuj długich fragmentów W3C, Understanding WCAG, How to Meet WCAG ani AAArdvark.
- Nie wymyślaj wymagań, których nie ma w WCAG.
- Oddziel wymaganie WCAG od dobrej praktyki, rekomendacji projektowej i techniki wdrożeniowej.
- Używaj przykładów z polskich serwisów, CMS-ów, formularzy, dokumentów i multimediów.
- Pisz tak, żeby treść była zrozumiała dla osoby nietechnicznej, ale użyteczna także dla dewelopera.
- Przy linkach zewnętrznych dodawaj informację dla czytnika ekranu: `<span class="sr-only"> (otwiera się w nowym oknie)</span>`.
- Przy grafikach używaj stabilnych lokalnych assetów, nie linków z CDN ani mediów społecznościowych.
- Linki w treści tutoriali mają być zgodne z identyfikacją marki: fioletowe, pogrubione i podkreślone.
- Linki muszą mieć widoczny stan `focus-visible`.
- Nie wolno polegać wyłącznie na kolorze jako sposobie oznaczania linku.
- Jeśli demo edukacyjne nie ma realnej logiki działania, nie może udawać interaktywnego komponentu.
- Statyczne demo formularza nie powinno używać prawdziwych pól `input`, `select` ani `textarea`.
- Prawdziwe kontrolki formularza stosujemy tylko wtedy, gdy przykład jest działający albo gdy pokazujemy kod, a nie wizualną makietę.
- Nie dodawaj zbędnego ARIA do statycznych makiet.
- Ostatni element okruszków na podstronie kryterium ma zawierać pełną nazwę kryterium, np. „3.3.1 Identyfikacja błędu”, a nie samo „3.3.1”.
- Ostatni element okruszków powinien oznaczać aktualną stronę, najlepiej jako tekst z `aria-current="page"`.
- Nie twórz zbędnego linku do aktualnej strony w okruszkach.
- Metadane kryterium w hero, np. „Postrzegalność · poziom A”, są treścią informacyjną.
- Metadane w hero muszą być czytelne i spełniać wymagania kontrastu tekstu.
- Nie obniżaj czytelności metadanych hero przez niskie `opacity`.
- Estetyczna subtelność nie może pogarszać czytelności informacji w hero.
- Bloki kodu edukacyjnego w `.wcag-code-example` mają zawijać długie linie i nie mogą wymagać poziomego przewijania na mobile.
- Każdy blok kodu musi mieć widoczną etykietę języka, np. „Kod — HTML”, „Kod — CSS” albo „Kod — JavaScript”.
- Sama etykieta „Kod” jest niewystarczająca.
- Jeśli to możliwe, element `code` powinien mieć klasę `language-html`, `language-css` albo `language-javascript`.
- Nie dodawaj biblioteki do kolorowania składni tylko po to, żeby oznaczyć język przykładu.
- Etykieta języka ma pomagać użytkownikowi szybko zrozumieć, na jaki rodzaj kodu patrzy.
- Przed rozbudową kryterium zapisz jego granicę merytoryczną: czego dotyczy i z czym łatwo je pomylić.
- Kryteria powiązane można wskazywać w sekcji „Powiązane kryteria”, ale nie wolno opisywać ich wymagań jako wymagań aktualnego kryterium.
- Jeśli pokazujesz zachowanie dynamiczne w statycznym demo, podpis albo opis musi jasno mówić, że to makieta edukacyjna, nie działający komponent.
- Jeśli demo nie jest działającym modalem, formularzem, tooltipem albo widgetem, nie wolno go tak przedstawiać.
- Dla złożonych zachowań, takich jak pułapka fokusu, lepszy jest schemat ścieżki fokusu niż makieta udająca komponent.
- Statyczne demo musi jasno informować, że jest schematem albo makietą edukacyjną.
- Jeśli demo pokazuje różnicę między atrapą a natywną kontrolką, dobry przykład może używać prawdziwych elementów HTML, np. `button` i `a`.
- Prawdziwe kontrolki w demo muszą być bezpieczne, lokalne i zrozumiale opisane.
- Nie pokazuj jako dobrego przykładu elementu `div` z `tabindex` albo `role`, jeśli wystarczy natywny `button` lub link.
- Przy kryteriach klawiaturowych można użyć natywnych kontrolek, żeby użytkownik mógł realnie sprawdzić fokus i obsługę klawiaturą.
- W przykładach edukacyjnych nie styluj linku jak przycisku, jeśli celem jest nauczenie różnicy między linkiem a buttonem.
- Button pokazuje akcję, a link pokazuje przejście.
- Link stylowany jak przycisk może być poprawny w interfejsie jako CTA, ale w tutorialu o klawiaturze lepiej rozdzielić role wizualnie.
- Jeśli demo klawiaturowe używa prawdziwego buttona, powinno dawać prosty, zrozumiały efekt działania albo jasno informować, że pokazuje tylko fokus.

## Docelowa struktura podstrony

Każda rozbudowana podstrona kryterium sukcesu powinna mieć poniższe sekcje w tej kolejności.

## 1. Krótko

Jednozdaniowe wyjaśnienie kryterium prostym językiem.

Wytyczne:

- Zacznij od najważniejszego skutku dla użytkownika.
- Nie zaczynaj od numeru przepisu ani formalnej definicji.
- Unikaj żargonu albo od razu go wyjaśnij.

Przykład tonu:

> Obraz, ikona albo wykres musi mieć tekstową alternatywę, jeśli przekazuje informację potrzebną do zrozumienia strony lub wykonania zadania.

## 2. Problem w praktyce

Opisz realną sytuację użytkownika, w której brak spełnienia kryterium tworzy barierę.

Wytyczne:

- Pokaż konkretne zadanie, np. zakup, wypełnienie formularza, pobranie dokumentu, obejrzenie filmu.
- Opisz, co widzi lub słyszy użytkownik oraz czego nie może zrobić.
- Nie sprowadzaj problemu tylko do jednej grupy użytkowników, jeśli kryterium ma szerszy wpływ.

## 3. Kogo to dotyczy

Wymień grupy użytkowników i krótko wyjaśnij, dlaczego kryterium jest dla nich ważne.

Wytyczne:

- Łącz grupy z konkretnym mechanizmem bariery.
- Nie pisz ogólnie: „osoby z niepełnosprawnościami”.
- Uwzględnij sytuacje czasowe i kontekstowe, jeśli są istotne.

## 4. Dobry przykład

Podaj konkretny przykład poprawnego rozwiązania.

Wytyczne:

- Pokaż kontekst, nie tylko sam fragment kodu.
- Wyjaśnij, dlaczego przykład jest poprawny.
- Jeśli możliwe, używaj przykładów bliskich polskim realiom: BIP, uczelnia, sklep internetowy, placówka medyczna, formularz rekrutacyjny, PDF z urzędu.

## 5. Zły przykład

Podaj konkretny przykład błędu.

Wytyczne:

- Pokaż, co dokładnie jest barierą.
- Nie zostawiaj złego przykładu bez wyjaśnienia.
- Nie używaj tonu wyśmiewającego autorów strony.

## 6. Przykład kodu

Dodaj kod, jeśli kryterium dotyczy HTML, CSS, ARIA albo JavaScript.

Wytyczne:

- Preferuj semantyczny HTML przed ARIA.
- Pokaż minimalny poprawny przykład.
- Jeśli pokazujesz zły kod, oznacz go wyraźnie jako zły przykład.
- Jeśli kod nie ma sensu dla danego kryterium, napisz to jasno.

Formułka, gdy kod nie jest najważniejszy:

> W tym kryterium najważniejsza jest treść, proces albo decyzja projektowa. Kod może pomóc, ale sam nie potwierdzi zgodności.

## 7. Przykład graficzny

Dodaj opis grafiki edukacyjnej albo miejsce na przyszły komponent wizualny.

Wytyczne:

- Grafika ma mieć podpis.
- Grafika informacyjna ma mieć tekst alternatywny.
- Jeśli grafika tylko powtarza treść sąsiedniego tekstu, może być dekoracyjna, ale decyzję trzeba opisać w kodzie.
- Nie używaj zewnętrznych, wygasających URL-i.

Minimalny opis w treści roboczej:

```text
[Miejsce na grafikę edukacyjną]
Podpis: Porównanie poprawnego i błędnego rozwiązania.
Alt: Dwa przykłady tego samego elementu interfejsu: pierwszy ma ..., drugi nie ma ...
```

## 8. Jak sprawdzić

Opisz procedurę testową krok po kroku.

Wytyczne:

- Test ma być możliwy do wykonania ręcznie.
- Podawaj konkretne kroki i oczekiwany wynik.
- Jeśli potrzebne jest narzędzie, podaj jego rolę, ale nie uzależniaj testu tylko od jednego narzędzia.

Przykładowa struktura:

1. Otwórz testowaną stronę.
2. Wykonaj konkretną akcję użytkownika.
3. Sprawdź widoczny efekt.
4. Sprawdź efekt z klawiatury albo technologią wspomagającą, jeśli to istotne.
5. Porównaj wynik z oczekiwanym zachowaniem.

## 9. Co sprawdzi automat, a czego nie

Oddziel testy automatyczne od oceny manualnej.

Wytyczne:

- Napisz, co narzędzie może wykryć.
- Napisz, czego narzędzie nie zrozumie bez oceny człowieka.
- Nie sugeruj, że zielony raport automatu oznacza pełną zgodność z WCAG.

Przykładowe rozróżnienie:

- Automat może wykryć brak atrybutu, niepoprawną strukturę albo zbyt niski kontrast.
- Automat nie oceni zawsze, czy opis jest sensowny, czy kolejność jest logiczna albo czy komunikat pomaga naprawić błąd.

## 10. Typowe błędy

Wymień błędy spotykane w polskich serwisach, CMS-ach, formularzach, dokumentach albo multimediach.

Wytyczne:

- Lista powinna być konkretna.
- Każdy błąd powinien być zrozumiały bez znajomości formalnego WCAG.
- Jeśli błąd dotyczy CMS-a, opisz też, co autor powinien wpisać albo zmienić.

## 11. Powiązane kryteria

Wskaż inne kryteria WCAG, które często łączą się z danym problemem.

Wytyczne:

- Podawaj numer i tytuł kryterium.
- Wyjaśnij związek jednym zdaniem.
- Nie twórz sztucznie długiej listy.
- Sekcja musi być listą linków do istniejących podstron kryteriów.
- Przed dodaniem linku sprawdź rzeczywisty slug pliku w `public/wcag-prostym-jezykiem/`.
- Nie twórz martwych linków.
- Tekst linku ma zawierać numer i nazwę kryterium, np. „1.3.1 Informacje i relacje”.

Przykład:

```html
<li><a href="/wcag-prostym-jezykiem/1-3-1-informacje-i-relacje">1.3.1 Informacje i relacje</a>: gdy opis, etykieta albo struktura musi być dostępna programowo.</li>
```

## 12. Źródła

Każda podstrona powinna mieć sekcję źródeł.

Wymagane źródła:

- WCAG, oficjalny standard W3C.
- Understanding WCAG dla danego kryterium.
- How to Meet WCAG dla danego kryterium.

Opcjonalne źródła:

- techniki W3C, jeśli są istotne,
- dokumentacja HTML, ARIA albo CSS, jeśli pomaga wyjaśnić wdrożenie,
- AAArdvark jako źródło pierwotnego prostego opracowania, gdy dana treść nadal z niego korzysta.

Wytyczne:

- Linkuj do oryginalnych, stabilnych źródeł.
- Nie cytuj długich fragmentów.
- Parafrazuj i dopowiadaj praktyczny kontekst.
- Jeśli źródło jest po angielsku, nie udawaj, że to polskie tłumaczenie oficjalne.

## Minimalna kontrola przed publikacją pojedynczego kryterium

Przed uznaniem podstrony za wzorcową sprawdź:

- Czy `h1` zawiera numer i tytuł kryterium.
- Czy sekcje idą w standardowej kolejności.
- Czy na stronie nie ma pustych placeholderów bez decyzji redakcyjnej.
- Czy przykłady dobry/zły są jednoznaczne.
- Czy kod, jeśli występuje, jest poprawny i nie promuje zbędnego ARIA.
- Czy grafika ma podpis i odpowiedni `alt` albo jest dekoracyjna.
- Czy test manualny da się wykonać krok po kroku.
- Czy oddzielono automaty od oceny manualnej.
- Czy źródła prowadzą do W3C i innych stabilnych adresów.
- Czy treść nie rozszerza WCAG o wymagania, których kryterium nie zawiera.
