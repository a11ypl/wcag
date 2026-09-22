/**
 * Katalog produktow i kodow rabatowych - JEDYNE zrodlo prawdy o cenie.
 *
 * Przegladarka nigdy nie podaje kwoty. Wysyla identyfikator produktu i
 * ewentualny kod rabatowy; kwote wylicza wylacznie serwer. Bez tego kazdy
 * moglby podmienic cene w narzedziach dewelopera i kupic szkolenie za zlotowke.
 *
 * Kwoty trzymamy w groszach (liczby calkowite), zeby uniknac bledow
 * zmiennoprzecinkowych przy rabatach.
 *
 * Wlacz Wizje sp. z o.o. nie jest platnikiem VAT - kwota brutto rowna sie
 * netto, a dokument sprzedazy wystawiany jest ze zwolnieniem.
 */

/** Gorny limit na jedno zamowienie - zabezpieczenie przed pomylka i naduzyciem. */
export const MAKS_OSOB = 20;

export const PRODUKTY = {
  "wcag-dla-specjalistow": {
    nazwa: "WCAG dla specjalistów",
    podtytul: "jeśli zaczynasz",
    termin: "28-30.10.2026",
    cenaGrosze: 249900,
  },
  "ai-dla-audytora": {
    nazwa: "AI dla audytora dostępności cyfrowej",
    podtytul: "jeśli chcesz audytować z AI",
    termin: "9-10.11.2026",
    cenaGrosze: 199900,
  },
  "dostepne-dokumenty": {
    nazwa: "Dostępne dokumenty w praktyce",
    podtytul: "jeśli chcesz tworzyć dostępne dokumenty",
    termin: "26-27.11.2026",
    cenaGrosze: 199900,
  },
  // Kurs e-learningowy: dostep online, nie termin szkolenia. Sprzedaz od 28.09.2026,
  // cena promocyjna 500 zl dla uczestnikow webinaru wazna do 05.10.2026 - obsluguje
  // ja kod rabatowy, nie druga cena na stronie.
  "semantyczny-html": {
    nazwa: "Semantyczny HTML",
    podtytul: "kurs e-learningowy, 12 lekcji",
    termin: "dostęp online, bezterminowo",
    cenaGrosze: 99900,
    tresciCyfrowe: true,
  },
};

/**
 * Kody rabatowe pochodza WYLACZNIE ze zmiennej srodowiskowej, nigdy z repo.
 * Kod zapisany w kodzie zrodlowym strony przestaje byc rabatem dla uczestnikow
 * webinaru i staje sie publiczna cena - tak jest dzis w checkout-forms.js,
 * gdzie 'jestemwgrupie' widzi kazdy, kto otworzy plik.
 *
 * Format TPAY_KODY_RABATOWE (JSON):
 *   {"WEBINAR0925": {"produkty": ["dostepne-dokumenty"],
 *                    "cenaGrosze": 159900,
 *                    "wazneDo": "2026-09-30"}}
 *
 * Podajemy cene docelowa, nie procent - ceny promocyjne sa ustalane kwotowo
 * (1 999 zamiast 2 499), a nie jako rowny procent.
 */
function wczytajKody() {
  const surowe = process.env.TPAY_KODY_RABATOWE;
  if (!surowe) return {};
  try {
    const dane = JSON.parse(surowe);
    return dane && typeof dane === "object" ? dane : {};
  } catch {
    console.error("[katalog] TPAY_KODY_RABATOWE nie jest poprawnym JSON-em - rabaty wylaczone");
    return {};
  }
}

/** Porownanie odporne na roznice wielkosci liter i biale znaki. */
function znormalizuj(kod) {
  return String(kod || "").trim().toUpperCase();
}

/**
 * Wylicza kwote do zaplaty.
 * Zwraca {ok, produkt, kluczProduktu, kwotaGrosze, rabat, powod}.
 * Nieznany albo wygasly kod NIE jest bledem - po prostu obowiazuje cena stala.
 */
export function wycen(kluczProduktu, kod, liczbaOsob = 1) {
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
    rabat: null,
  };

  // Kod rabatowy z webinaru jest zachęta dla osoby, ktora w nim uczestniczyla,
  // wiec nie mnozy sie na caly zespol. Zalozenie zachowawcze - latwo poluzowac,
  // trudno odzyskac przychod. Do potwierdzenia przez Damiana.
  if (osoby > 1) {
    return kod
      ? { ...wynik, rabat: { zastosowany: false, powod: "kod-tylko-dla-jednej-osoby" } }
      : wynik;
  }

  const szukany = znormalizuj(kod);
  if (!szukany) return wynik;

  const kody = wczytajKody();
  const wpis = kody[szukany] || kody[Object.keys(kody).find((k) => znormalizuj(k) === szukany)];
  if (!wpis) return { ...wynik, rabat: { zastosowany: false, powod: "nieznany-kod" } };

  const produktyKodu = Array.isArray(wpis.produkty) ? wpis.produkty : [];
  if (produktyKodu.length && !produktyKodu.includes(kluczProduktu)) {
    return { ...wynik, rabat: { zastosowany: false, powod: "kod-nie-dotyczy-tego-produktu" } };
  }

  if (wpis.wazneDo) {
    // Koniec dnia wskazanego jako ostatni dzien waznosci, czas warszawski.
    const koniec = new Date(`${wpis.wazneDo}T23:59:59+02:00`);
    if (Number.isNaN(koniec.getTime()) || Date.now() > koniec.getTime()) {
      return { ...wynik, rabat: { zastosowany: false, powod: "kod-wygasl" } };
    }
  }

  const cenaPoRabacie = Number.parseInt(wpis.cenaGrosze, 10);
  if (!Number.isInteger(cenaPoRabacie) || cenaPoRabacie <= 0 || cenaPoRabacie > produkt.cenaGrosze) {
    return { ...wynik, rabat: { zastosowany: false, powod: "bledna-konfiguracja-kodu" } };
  }

  return {
    ...wynik,
    cenaJednostkowaGrosze: cenaPoRabacie,
    kwotaGrosze: cenaPoRabacie * osoby,
    rabat: { zastosowany: true, kod: szukany, cenaPrzed: produkt.cenaGrosze },
  };
}

export const naZlote = (grosze) => (grosze / 100).toFixed(2);
