# Warstwa płatności — model zagrożeń i stan zabezpieczeń

Gałąź: `feat/tpay-platnosci`. Nic nie jest wdrożone, brak danych Tpay.
Dokument dla przeglądu bezpieczeństwa — opisuje, co zostało zabezpieczone i **czego
świadomie nie zabezpieczono**.

## Powierzchnia

| Punkt | Metoda | Kto woła |
|---|---|---|
| `/api/platnosc-start` | POST, JSON | przeglądarka kupującego |
| `/api/tpay-itn` | POST, form-urlencoded | serwery Tpay |
| `/api/cennik` | GET, parametry w adresie | przeglądarka kupującego |
| `/zapis`, `/platnosc-udana`, `/platnosc-nieudana` | GET | każdy |

Nie istnieje **żaden** punkt końcowy, który przyjmuje identyfikator zamówienia
i zwraca dane. To jest decyzja projektowa, nie przeoczenie: bez takiego punktu
nie ma powierzchni na IDOR-a.

`/api/cennik` dodany 23.09.2026 wraz z wariantami ceny. Przyjmuje klucz
produktu, klucz wariantu i liczbę osób; zwraca kwotę wyliczoną z tego samego
katalogu, z którego liczy ją płatność. Istnieje po to, żeby kupujący zobaczył
wygaśnięcie promocji przed zapłatą, a nie dopiero na bramce.

Czego ten punkt **nie** robi: nie przyjmuje kwoty, nie zapisuje niczego, nie
zna zamówień i nie zwraca danych osobowych. Wszystko, co oddaje, jest i tak
napisane na stronie sprzedażowej. Nie da się przez niego wpłynąć na cenę
transakcji — płatność liczy ją niezależnie, w `api/platnosc-start.mjs`.

Co zostaje do przemyślenia: punkt jest nielimitowany, więc pozwala odpytywać
katalog dowolnie często i zgadywać nazwy wariantów. Koszt takiego zgadywania to
poznanie ceny promocyjnej bez linku — nie dostęp do cudzych danych. Uznane za
akceptowalne, do przeglądu razem z resztą braku ograniczeń liczby żądań.

## Zabezpieczone

**Manipulacja ceną.** Kwotę wylicza wyłącznie `api/_katalog.mjs`. Przeglądarka
wysyła identyfikator szkolenia i kod rabatowy. Pola `amount`, `kwota`,
`cenaGrosze` w ciele żądania są ignorowane — pokryte testem
`kwota podana przez przegladarke jest ignorowana`.

**Nadużycie kodu rabatowego.** Kody są w zmiennej `TPAY_KODY_RABATOWE`, nie w repo.
Kod ma datę ważności i listę szkoleń, których dotyczy. Kod nie może podnieść ceny
ani zejść poniżej zera — nieprawidłowa konfiguracja cofa do ceny stałej, nie do zera.

**Podrobione powiadomienie o płatności.** `/api/tpay-itn` weryfikuje odłączony
podpis JWS: algorytm musi być RS256, `x5u` musi zaczynać się od
`https://secure.tpay.com`, certyfikat musi być w okresie ważności i podpisany
przez `tpay-jws-root.pem`, a podpis liczony jest nad surowym ciałem żądania.
Bez kontroli `x5u` napastnik wskazałby własny certyfikat i „potwierdził" dowolną
wpłatę — ten przypadek ma osobny test.

**Niedopłata.** Sprawdzane jest `tr_paid >= tr_amount` oraz waluta PLN. Sam
`tr_status` nie wystarcza.

**Fałszywe potwierdzenie przez powrót z bramki.** Strona `/platnosc-udana` jest
statyczna: nie przyjmuje parametrów, niczego nie wyszukuje i nie pokazuje danych.
Adresy powrotu przekazywane do Tpay nie zawierają identyfikatora zamówienia, więc
nie wycieka on do historii przeglądarki ani nagłówka `Referer`.

**Zgadywanie identyfikatora.** Pełny UUID. Dziś nieistotne, bo nic po nim nie
odpytuje; istotne, gdyby ktoś kiedyś dopisał odczyt statusu.

## Niezabezpieczone — świadomie, do decyzji

**Brak ograniczenia liczby żądań.** `/api/platnosc-start` można wołać w pętli:
zgadywać kody rabatowe albo generować transakcje. Funkcje bezstanowe nie mają
wspólnego licznika. Realne złagodzenie wymaga zewnętrznego magazynu albo
ograniczeń po stronie Vercela. **To jest najpoważniejsza znana luka.**

**Idempotencja działa tylko w obrębie jednej instancji.** Zbiór `obsluzone`
żyje w pamięci procesu. Inna instancja nie wie o obsłużonym powiadomieniu.
Dziś nieszkodliwe, bo obsługa jedynie loguje. **W chwili dodania realizacji
zamówienia — wysyłki dostępu, maila, faktury — stanie się to ryzykiem podwójnej
realizacji.** Wymaga trwałego magazynu z kluczem `tr_id`.

**Brak trwałego zapisu zamówień.** Źródłem prawdy jest panel Tpay plus logi
Vercela. Po rotacji logów korelacja „zamówienie → wpłata" zostaje tylko w Tpay.

**Dane kupujących idą do zewnętrznego procesora.** Istniejący
`public/assets/checkout-forms.js` wysyła formularze do `api.web3forms.com`.
Nowy formularz `/zapis` tego nie robi, ale stary mechanizm nadal działa
na innych stronach i nie ma go w rejestrze podprocesorów.

**Regulamin jest niezgodny ze stanem faktycznym.** Nadal opisuje przelew
tradycyjny. Musi wymieniać operatora płatności i zasady odstąpienia, zanim
przyjmiesz pierwszą prawdziwą wpłatę.

## Pułapka wdrożeniowa

`.gitignore` ignoruje `/public/`, a `vercel.json` wdraża „committed public
directory". Istniejące strony są śledzone, bo dodano je przez `git add -f`.
**Nowa strona dodana bez `-f` nie trafi na produkcję i nikt tego nie zauważy,
dopóki ktoś nie kliknie martwego odnośnika.**

## Czego nie sprawdzono

Kształt ciała żądania tworzącego transakcję (`POST /transactions`) pochodzi
z dokumentacji i oficjalnego SDK, ale **nie został potwierdzony na żywym
sandboksie**. To pierwsza rzecz do weryfikacji po wprowadzeniu danych.

## Potwierdzenie zawarcia umowy (od 28.09.2026)

Po ITN uznanym za zapłacone `api/tpay-itn.mjs` wysyła kupującemu
potwierdzenie na trwałym nośniku (§ 7 ust. 9 regulaminu): dane zamówienia,
cena, warunki realizacji, powtórzone oświadczenia (`-sXkY`, `-nX`), wzór
formularza odstąpienia i PDF regulaminu w załączniku. Kopia UDW na
`POCZTA_KOPIA` (domyślnie a11y@wlaczwizje.pl) jest archiwum i dowodem.

- Wysyłka: Gmail SMTP (`smtp.gmail.com:465`), własny minimalny klient
  w `api/_poczta.mjs`, bez zależności npm. Hasło aplikacji Google tylko
  w zmiennej `SMTP_HASLO` w Vercelu. Komenda AUTH nigdy nie trafia do logu.
- Adresy są sprawdzane przed połączeniem: znak nowej linii, `<`, `>`, `,`
  albo `;` odrzuca adres, więc nie da się wstrzyknąć nagłówka ani odbiorcy.
- Bez PDF regulaminu klient **nie dostaje** potwierdzenia (sam link nie
  wystarcza). Zamiast tego idzie alarm na `POCZTA_KOPIA` z danymi do
  ręcznej wysyłki. PDF jest dołączany do paczki funkcji (`vercel.json`,
  `includeFiles`), a zapasowo pobierany przez HTTP.
- Błąd wysyłki nie zmienia odpowiedzi `TRUE` dla Tpay: płatność jest
  przyjęta niezależnie od poczty.
- Znane ograniczenie: idempotencja działa w obrębie jednej instancji
  funkcji. Powtórzone ITN trafiające na inną instancję może wysłać drugie,
  identyczne potwierdzenie. Szkoda niewielka (duplikat maila), rozwiązanie
  wymagałoby trwałego magazynu.
- Przy zakupie dla kilku osób ITN nie zna listy uczestników. Potwierdzenie
  idzie do kupującego, uczestników odczytasz z logu `platnosc-rozpoczeta`.
