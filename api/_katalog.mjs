/**
 * Katalog produktow i wariantow ceny - JEDYNE zrodlo prawdy o kwocie.
 *
 * Przegladarka nigdy nie podaje ceny. Wysyla identyfikator produktu i
 * ewentualny identyfikator wariantu; kwote wylicza wylacznie serwer. Bez tego
 * kazdy moglby podmienic cene w narzedziach dewelopera i kupic szkolenie za
 * zlotowke.
 *
 * Kwoty trzymamy w groszach (liczby calkowite), zeby uniknac bledow
 * zmiennoprzecinkowych.
 *
 * Wlacz Wizje sp. z o.o. nie jest platnikiem VAT - kwota brutto rowna sie
 * netto, a dokument sprzedazy wystawiany jest ze zwolnieniem.
 */

/** Gorny limit na jedno zamowienie - zabezpieczenie przed pomylka i naduzyciem. */
export const MAKS_OSOB = 20;

/**
 * Wersja regulaminu, ktora kupujacy akceptuje przy zamowieniu, i jej PDF
 * dolaczany do potwierdzenia na trwalym nosniku (§ 7 ust. 9 regulaminu).
 *
 * UWAGA przy merge PR #18: nazwa pliku PDF musi odpowiadac wersji
 * opublikowanej w public/. Po kazdej zmianie tekstu regulaminu - nowa wersja
 * tutaj i nowy plik PDF, stary zostaje (archiwum dla wczesniejszych umow).
 */
export const REGULAMIN = {
  wersja: "2026-09-24",
  pdf: "/regulamin-2026-09-24.pdf",
};

/**
 * Promocje jako WARIANT CENY, nie kod rabatowy (decyzja Damiana z 23.09.2026).
 *
 * Kodow rabatowych nie ma nigdzie na stronie. Promocja powebinarowa dziala
 * przez dedykowany link, ktory wskazuje wariant:
 *
 *   /zapis?szkolenie=wcag-dla-specjalistow&wariant=webinar-2409
 *
 * Wariant jest zagniezdzony w produkcie, wiec z definicji nie da sie uzyc
 * wariantu jednego szkolenia przy innym - nie ma tu czego sprawdzac krzyzowo
 * i nie ma jak sie pomylic w konfiguracji.
 *
 * Te dane moga lezec w repozytorium, w odroznieniu od dawnych kodow: modul
 * jest serwerowy (`api/`), nie trafia do przegladarki. Dawny kod rabatowy byl
 * wpisany w plik JavaScript wysylany do kazdego odwiedzajacego - przestawal
 * wtedy byc rabatem dla uczestnikow webinaru i stawal sie publiczna cena.
 *
 * Link po dacie waznosci nie jest bledem: kupujacy widzi cene regularna wraz
 * z wyjasnieniem, dlaczego promocja juz nie obowiazuje.
 *
 * Kwoty promocyjne: cennik z 21.09.2026 (notatka 01 Biznesy). Data waznosci
 * 2026-10-05 - jedno okno dla wszystkich trzech szkolen, potwierdzona przez
 * Damiana 23.09.2026. Uwaga: to NIE jest to samo okno, co dawna promocja na
 * kurs (28.09-05.10), ktora jest nieaktualna wraz z odlozeniem sprzedazy.
 */
export const PRODUKTY = {
  "wcag-dla-specjalistow": {
    nazwa: "WCAG dla specjalistów",
    podtytul: "jeśli zaczynasz",
    termin: "28-30.10.2026",
    dataStartu: "2026-10-28",
    kursWPakiecie: true,
    cenaGrosze: 249900,
    warianty: {
      "webinar-2409": {
        nazwa: "cena dla uczestników webinaru",
        cenaGrosze: 199900,
        wazneDo: "2026-10-05",
      },
    },
  },
  "ai-dla-audytora": {
    nazwa: "AI w audytowaniu dostępności cyfrowej",
    podtytul: "jeśli chcesz audytować z AI",
    termin: "9-10.11.2026",
    dataStartu: "2026-11-09",
    kursWPakiecie: true,
    cenaGrosze: 199900,
    warianty: {
      "webinar-2409": {
        nazwa: "cena dla uczestników webinaru",
        cenaGrosze: 159900,
        wazneDo: "2026-10-05",
      },
    },
  },
  "dostepne-dokumenty": {
    nazwa: "Dostępne dokumenty w praktyce",
    podtytul: "jeśli chcesz tworzyć dostępne dokumenty",
    termin: "26-27.11.2026",
    dataStartu: "2026-11-26",
    kursWPakiecie: true,
    cenaGrosze: 199900,
    warianty: {
      "webinar-2409": {
        nazwa: "cena dla uczestników webinaru",
        cenaGrosze: 159900,
        wazneDo: "2026-10-05",
      },
    },
  },
  // Kurs e-learningowy "Semantyczny HTML": start 01.12.2026, preorder od
  // pazdziernika, CENA NIEUSTALONA (stan na 28.09.2026). Produkt jest w
  // katalogu, bo mechanika tresci cyfrowych (zgoda na natychmiastowe
  // dostarczenie, znacznik -n1/-n0) jest gotowa i przetestowana, ale
  // wSprzedazy: false blokuje go w wycenie. Nie wpisuj ceny bez decyzji
  // Damiana w notatce 01 Biznesy.
  //
  // Uczestnicy szkolen otwartych dostaja kurs w cenie szkolenia (kursWPakiecie).
  "semantyczny-html": {
    nazwa: "Semantyczny HTML",
    podtytul: "kurs e-learningowy",
    termin: "dostęp online od 01.12.2026",
    cenaGrosze: null,
    tresciCyfrowe: true,
    wSprzedazy: false,
  },
};

/** Porownanie odporne na roznice wielkosci liter i biale znaki. */
function znormalizuj(wartosc) {
  return String(wartosc || "").trim().toLowerCase();
}

/**
 * Czy wariant jest wazny na teraz.
 *
 * `wazneDo` to ostatni dzien obowiazywania wlacznie, liczony do konca dnia
 * czasu warszawskiego. Brak `wazneDo` znaczy "bezterminowo".
 */
function czyWazny(wariant) {
  if (!wariant.wazneDo) return true;
  const koniec = new Date(`${wariant.wazneDo}T23:59:59+02:00`);
  return !Number.isNaN(koniec.getTime()) && Date.now() <= koniec.getTime();
}

/**
 * Wylicza kwote do zaplaty.
 *
 * Zwraca {ok, produkt, kluczProduktu, liczbaOsob, cenaJednostkowaGrosze,
 *         kwotaGrosze, wariant, powod}.
 *
 * Nieznany albo wygasly wariant NIE jest bledem - obowiazuje wtedy cena stala,
 * a pole `wariant` niesie powod, ktory strona pokazuje kupujacemu.
 */
export function wycen(kluczProduktu, kluczWariantu, liczbaOsob = 1) {
  const produkt = PRODUKTY[kluczProduktu];
  if (!produkt) return { ok: false, powod: "nieznany-produkt" };
  if (produkt.wSprzedazy === false) return { ok: false, powod: "produkt-niedostepny" };

  // Zakup firmowy: cena to iloczyn, bez progow ilosciowych - ta sama stawka
  // przy jednej i przy dziesieciu osobach (decyzja Damiana z 22.09.2026).
  const osoby = Number.parseInt(liczbaOsob, 10);
  if (!Number.isInteger(osoby) || osoby < 1 || osoby > MAKS_OSOB) {
    return { ok: false, powod: "bledna-liczba-osob" };
  }

  const wynik = {
    ok: true,
    produkt,
    kluczProduktu,
    liczbaOsob: osoby,
    cenaJednostkowaGrosze: produkt.cenaGrosze,
    kwotaGrosze: produkt.cenaGrosze * osoby,
    wariant: null,
  };

  const szukany = znormalizuj(kluczWariantu);
  if (!szukany) return wynik;

  // Cena powebinarowa jest zacheta dla osoby, ktora w webinarze uczestniczyla,
  // wiec nie mnozy sie na caly zespol. Zalozenie zachowawcze - latwo poluzowac,
  // trudno odzyskac przychod. Do potwierdzenia przez Damiana.
  if (osoby > 1) {
    return { ...wynik, wariant: { zastosowany: false, powod: "wariant-tylko-dla-jednej-osoby" } };
  }

  const warianty = produkt.warianty || {};
  const klucz = Object.keys(warianty).find((k) => znormalizuj(k) === szukany);
  if (!klucz) return { ...wynik, wariant: { zastosowany: false, powod: "nieznany-wariant" } };

  const wariant = warianty[klucz];
  if (!czyWazny(wariant)) {
    return {
      ...wynik,
      wariant: { zastosowany: false, powod: "wariant-wygasl", wazneDo: wariant.wazneDo },
    };
  }

  // Wariant moze cene wylacznie obnizyc. Blad w katalogu nie moze sprawic,
  // ze ktos zaplaci wiecej, niz widzi na stronie.
  const cena = Number.parseInt(wariant.cenaGrosze, 10);
  if (!Number.isInteger(cena) || cena <= 0 || cena > produkt.cenaGrosze) {
    return { ...wynik, wariant: { zastosowany: false, powod: "bledna-konfiguracja-wariantu" } };
  }

  return {
    ...wynik,
    cenaJednostkowaGrosze: cena,
    kwotaGrosze: cena * osoby,
    wariant: {
      zastosowany: true,
      klucz,
      nazwa: wariant.nazwa || null,
      cenaPrzed: produkt.cenaGrosze,
      wazneDo: wariant.wazneDo || null,
    },
  };
}

export const naZlote = (grosze) => (grosze / 100).toFixed(2);
