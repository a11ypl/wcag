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
 */
export const PRODUKTY = {
  "wcag-dla-specjalistow": {
    nazwa: "WCAG dla specjalistów",
    podtytul: "jeśli zaczynasz",
    termin: "28-30.10.2026",
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
    nazwa: "AI dla audytora dostępności cyfrowej",
    podtytul: "jeśli chcesz audytować z AI",
    termin: "9-10.11.2026",
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
    cenaGrosze: 199900,
    warianty: {
      "webinar-2409": {
        nazwa: "cena dla uczestników webinaru",
        cenaGrosze: 159900,
        wazneDo: "2026-10-05",
      },
    },
  },
  // Kurs e-learningowy: dostep online, nie termin szkolenia.
  //
  // Sprzedaz ODLOZONA (decyzja z 22.09.2026, notatka 01 Biznesy) - pierwotny
  // start 28.09 i okno promocyjne 28.09-05.10 sa nieaktualne, wchodzi lista
  // preorderowa bez daty. Produkt zostaje w katalogu, bo mechanika jest gotowa
  // i przetestowana; wariantu promocyjnego nie definiujemy, dopoki nie zapadnie
  // decyzja o cenie dla listy (rekomendacja 500 zl).
  "semantyczny-html": {
    nazwa: "Semantyczny HTML",
    podtytul: "kurs e-learningowy, 12 lekcji",
    termin: "dostęp online, bezterminowo",
    cenaGrosze: 99900,
    tresciCyfrowe: true,
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
