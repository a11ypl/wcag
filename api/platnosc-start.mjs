/**
 * Rozpoczecie platnosci: przegladarka wysyla CO kupuje, serwer decyduje ZA ILE.
 *
 * Przegladarka nigdy nie podaje kwoty. Gdyby podawala, wystarczy narzedzia
 * dewelopera, zeby kupic szkolenie za 2 499 zl placac zlotowke. Kwote liczy
 * wylacznie api/_katalog.mjs.
 *
 * Zwracamy adres bramki; przekierowanie wykonuje przegladarka.
 */

import crypto from "node:crypto";
import { wycen, naZlote } from "./_katalog.mjs";

const BAZA_PRODUKCJA = "https://secure.tpay.com";
const BAZA_SANDBOX = "https://secure.sandbox.tpay.com";

const baza = () => (process.env.TPAY_SANDBOX === "1" ? BAZA_SANDBOX : BAZA_PRODUKCJA);

/**
 * Adres publiczny, pod ktorym Tpay ma oddzwonic z powiadomieniem.
 *
 * Na produkcji podajemy go jawnie w PUBLICZNY_ADRES. Na podgladzie Vercela
 * adres jest generowany przy kazdym wdrozeniu, wiec nie da sie go wpisac
 * z gory - bierzemy go wtedy ze zmiennych systemowych platformy
 * (VERCEL_BRANCH_URL jest stabilny dla galezi, VERCEL_URL zmienia sie
 * przy kazdym wdrozeniu). Dzieki temu testy w sandboksie nie wymagaja
 * zgadywania adresu ani poprawiania zmiennej po kazdym pushu.
 */
function ustalAdresPubliczny() {
  const jawny = process.env.PUBLICZNY_ADRES;
  if (jawny) return jawny.replace(/\/+$/, "");
  const zVercela = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;
  return zVercela ? `https://${zVercela.replace(/\/+$/, "")}` : "";
}

const POPRAWNY_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function bladWejscia(res, powod) {
  res.status(400).json({ blad: powod });
}

/** Token na chwile - Tpay zwraca expires_in, ale przy jednym zadaniu nie cachujemy. */
async function pobierzToken() {
  const odp = await fetch(`${baza()}/oauth/auth`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.TPAY_CLIENT_ID,
      client_secret: process.env.TPAY_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });
  if (!odp.ok) throw new Error(`autoryzacja Tpay nieudana: HTTP ${odp.status}`);
  const dane = await odp.json();
  if (!dane.access_token) throw new Error("Tpay nie zwrocil access_token");
  return dane.access_token;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ blad: "tylko POST" });
    return;
  }
  for (const zmienna of ["TPAY_CLIENT_ID", "TPAY_CLIENT_SECRET"]) {
    if (!process.env[zmienna]) {
      console.error(`[platnosc] brak zmiennej srodowiskowej ${zmienna}`);
      res.status(503).json({ blad: "platnosci chwilowo niedostepne" });
      return;
    }
  }

  const adresPubliczny = ustalAdresPubliczny();
  if (!adresPubliczny) {
    console.error("[platnosc] nie udalo sie ustalic adresu publicznego");
    res.status(503).json({ blad: "platnosci chwilowo niedostepne" });
    return;
  }

  const dane = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const { produkt: kluczProduktu, kod, imie, email, firma, nip, natychmiast,
          liczbaOsob, uczestnicy } = dane;

  if (!kluczProduktu) return bladWejscia(res, "brak-produktu");
  if (!imie || String(imie).trim().length < 3) return bladWejscia(res, "brak-imienia-i-nazwiska");
  if (!POPRAWNY_EMAIL.test(String(email || ""))) return bladWejscia(res, "bledny-email");

  const osoby = liczbaOsob === undefined ? 1 : liczbaOsob;
  const wycena = wycen(kluczProduktu, kod, osoby);
  if (!wycena.ok) return bladWejscia(res, wycena.powod);

  // Przy zakupie dla kilku osob kazdy uczestnik dostaje odrebny, imienny dostep,
  // wiec musimy znac jego dane. Sprawdzamy je tutaj, a nie tylko w przegladarce.
  const lista = Array.isArray(uczestnicy) ? uczestnicy : [];
  if (wycena.liczbaOsob > 1) {
    if (lista.length !== wycena.liczbaOsob) return bladWejscia(res, "niepelna-lista-uczestnikow");
    for (const osoba of lista) {
      if (!osoba || String(osoba.imie || "").trim().length < 3) {
        return bladWejscia(res, "brak-imienia-uczestnika");
      }
      if (!POPRAWNY_EMAIL.test(String(osoba.email || "").trim())) {
        return bladWejscia(res, "bledny-email-uczestnika");
      }
    }
  }

  // Identyfikator zamowienia wraca w powiadomieniu ITN jako tr_crc - po nim
  // rozpoznajemy, czego dotyczyla wplata.
  //
  // Pelny UUID, nie skrocony: identyfikator nie moze byc zgadywalny. Nie ma
  // dzis zadnego punktu, ktory po nim cokolwiek zwraca (patrz nizej), ale gdyby
  // ktos taki kiedys dopisal, krotki identyfikator natychmiast stalby sie idorem.
  // Nazwa produktu zostaje w srodku wylacznie po to, zeby przy reklamacji dalo
  // sie odczytac z panelu Tpay, czego dotyczyla wplata - nie jest to dana osobowa.
  // Przy tresciach cyfrowych zapisujemy w identyfikatorze, czy kupujacy zazadal
  // natychmiastowego swiadczenia. ITN zwraca wylacznie tr_crc, wiec bez tego
  // znacznika realizacja nie wiedzialaby, czy dostep nalezy sie od razu, czy po
  // 14 dniach. Nie wolno uzaleznic sprzedazy od zrzeczenia sie prawa odstapienia,
  // wiec sciezka "kupuje i czekam" musi istniec (wymog opisany przez sesje mozg-27
  // w raporty/2026-09-22-regulamin-tresci-cyfrowe-kurs.md).
  const zadaNatychmiast = wycena.produkt.tresciCyfrowe ? Boolean(natychmiast) : null;
  const znacznik = zadaNatychmiast === null ? "" : (zadaNatychmiast ? "-n1" : "-n0");
  const idZamowienia = `a11y-${kluczProduktu}${znacznik}-${crypto.randomUUID()}`;
  const adres = adresPubliczny;

  const opis = wycena.liczbaOsob > 1
    ? `${wycena.produkt.nazwa} (${wycena.produkt.termin}) - ${wycena.liczbaOsob} osob`
    : `${wycena.produkt.nazwa} (${wycena.produkt.termin})`;

  let token;
  try {
    token = await pobierzToken();
  } catch (blad) {
    console.error(`[platnosc] ${blad.message}`);
    res.status(502).json({ blad: "bramka-niedostepna" });
    return;
  }

  const zadanie = {
    amount: Number(naZlote(wycena.kwotaGrosze)),
    description: opis,
    hiddenDescription: idZamowienia,
    payer: {
      email: String(email).trim(),
      name: String(imie).trim(),
    },
    callbacks: {
      // Adresy powrotu sa CZYSTE - bez identyfikatora zamowienia w zapytaniu.
      //
      // Powrot z bramki nie jest dowodem zaplaty: kazdy moze wpisac ten adres
      // recznie. Strona potwierdzenia jest wiec statyczna, nic nie wyszukuje
      // i nie pokazuje zadnych danych. Brak identyfikatora w adresie oznacza
      // takze, ze nie wycieka on do historii przegladarki, naglowka Referer
      // ani do logow posrednikow.
      //
      // Jedynym miejscem, ktore uznaje platnosc za potwierdzona, jest ITN.
      payerUrls: {
        success: `${adres}/platnosc-udana`,
        error: `${adres}/platnosc-nieudana`,
      },
      notification: { url: `${adres}/api/tpay-itn` },
    },
  };

  const odp = await fetch(`${baza()}/transactions`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(zadanie),
  });

  if (!odp.ok) {
    console.error(`[platnosc] utworzenie transakcji nieudane: HTTP ${odp.status} ${await odp.text()}`);
    res.status(502).json({ blad: "bramka-odrzucila-transakcje" });
    return;
  }

  const transakcja = await odp.json();
  const adresBramki = transakcja.transactionPaymentUrl || transakcja.paymentUrl;
  if (!adresBramki) {
    console.error(`[platnosc] brak adresu bramki w odpowiedzi: ${JSON.stringify(transakcja)}`);
    res.status(502).json({ blad: "brak-adresu-platnosci" });
    return;
  }

  // Zapis do logu: po tym odtworzysz, co zostalo zamowione, zanim przyjdzie ITN.
  console.log(JSON.stringify({
    zdarzenie: "platnosc-rozpoczeta",
    zamowienie: idZamowienia,
    produkt: kluczProduktu,
    kwota_zl: naZlote(wycena.kwotaGrosze),
    rabat: wycena.rabat,
    liczba_osob: wycena.liczbaOsob,
    cena_jednostkowa_zl: naZlote(wycena.cenaJednostkowaGrosze),
    uczestnicy: lista.map((o) => ({ imie: o.imie, email: o.email })),
    tresci_cyfrowe: Boolean(wycena.produkt.tresciCyfrowe),
    zadanie_natychmiastowego_swiadczenia: zadaNatychmiast,
    dostep: zadaNatychmiast === null ? "wg terminu szkolenia"
      : (zadaNatychmiast ? "niezwlocznie po platnosci" : "po 14 dniach od zakupu"),
    firma: firma || null,
    nip: nip || null,
    tr_id: transakcja.transactionId || null,
  }));

  res.status(200).json({
    url: adresBramki,
    zamowienie: idZamowienia,
    kwota: naZlote(wycena.kwotaGrosze),
    liczbaOsob: wycena.liczbaOsob,
    rabatZastosowany: Boolean(wycena.rabat?.zastosowany),
  });
}
