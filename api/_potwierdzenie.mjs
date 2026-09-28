/**
 * Potwierdzenie zawarcia umowy na trwalym nosniku (§ 7 ust. 9 regulaminu).
 *
 * Wysylane automatycznie po ITN, ktore uznalo platnosc za zaplacona - wtedy
 * umowa jest zawarta (§ 7 ust. 8 lit. a). Zawiera: dane zamowienia, cene,
 * istotne warunki realizacji, potwierdzenie oswiadczen o wczesniejszym
 * rozpoczeciu, wzor formularza odstapienia i regulamin w PDF w wersji z chwili
 * zawarcia umowy.
 *
 * Tresc zgodna z szablonem mozg/raporty/2026-09-24-mail-dostep-tresci-cyfrowej-szablon.md.
 * Zdan potwierdzajacych oswiadczenia nie skracaj i nie przenos do stopki:
 * to przeslanka utraty prawa odstapienia.
 *
 * Bez pauz i polpauz w tresci dla klienta (zasada komunikacji marki).
 */

import fs from "node:fs/promises";
import path from "node:path";
import { PRODUKTY, REGULAMIN } from "./_katalog.mjs";

const DZIEN_MS = 24 * 60 * 60 * 1000;
const START_KURSU = "2026-12-01";

/**
 * Rozklada identyfikator zamowienia (tr_crc) z api/platnosc-start.mjs:
 *   a11y-<produkt>[-n0|-n1|-s0k0|-s1k1|...]-<uuid>
 * Zwraca null, jesli identyfikator nie pochodzi z naszej bramki.
 */
export function rozlozIdentyfikator(crc) {
  const m = /^a11y-([a-z0-9-]+?)(?:-(n[01]|s[01](?:k[01])?))?-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/
    .exec(String(crc || ""));
  if (!m || !PRODUKTY[m[1]]) return null;
  const znacznik = m[2] || "";
  const flaga = (litera) => {
    const z = new RegExp(`${litera}([01])`).exec(znacznik);
    return z ? z[1] === "1" : null;
  };
  return {
    kluczProduktu: m[1],
    produkt: PRODUKTY[m[1]],
    natychmiast: flaga("n"),
    rozpoczecie: flaga("s"),
    kurs: flaga("k"),
  };
}

/** Data i godzina w strefie Europe/Warsaw, np. "28.09.2026, godz. 14:05". */
export function czasWarszawa(data) {
  const f = new Intl.DateTimeFormat("pl-PL", {
    timeZone: "Europe/Warsaw", day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).formatToParts(data);
  const c = Object.fromEntries(f.map((p) => [p.type, p.value]));
  return `${c.day}.${c.month}.${c.year}, godz. ${c.hour}:${c.minute}`;
}

function dniDo(dataIso, odKiedy) {
  return (new Date(`${dataIso}T00:00:00+01:00`).getTime() - odKiedy.getTime()) / DZIEN_MS;
}

const kwotaZl = (tekst) => Number.parseFloat(tekst).toFixed(2).replace(".", ",");

const WZOR_ODSTAPIENIA = `WZÓR FORMULARZA ODSTĄPIENIA OD UMOWY
(formularz należy wypełnić i odesłać tylko w przypadku zamiaru odstąpienia od umowy)

Adresat:
Włącz Wizję sp. z o.o.
ul. Sternicza 129 lok. 50
01-350 Warszawa
e-mail: a11y@wlaczwizje.pl

Ja/My niniejszym informuję/informujemy o odstąpieniu od umowy dotyczącej:

Nazwa Produktu: ..............................
Data zawarcia umowy: ..............................
Imię i nazwisko Konsumenta / Konsumentów: ..............................
Adres Konsumenta / Konsumentów: ..............................
Adres e-mail użyty przy zamówieniu: ..............................
Data: ..............................
Podpis Konsumenta / Konsumentów: ..............................

Podpis jest wymagany wyłącznie wtedy, gdy formularz jest przesyłany w wersji papierowej.`;

const STOPKA = `Zespół Accessibility First, Włącz Wizję
Włącz Wizję sp. z o.o., ul. Sternicza 129 lok. 50, 01-350 Warszawa
a11y@wlaczwizje.pl, tel. +48 727 935 587`;

/**
 * Buduje temat i tresc potwierdzenia.
 *
 * `zamowienie`: wynik rozlozIdentyfikator; `platnosc`: {kwota, trId, czas}.
 */
export function zbudujPotwierdzenie(zamowienie, platnosc, regulamin = REGULAMIN) {
  const { produkt } = zamowienie;
  const czas = platnosc.czas || new Date();
  const plikPdf = path.basename(regulamin.pdf);
  const szkolenie = !produkt.tresciCyfrowe;
  const linie = [];

  linie.push(
    "Dzień dobry,",
    "",
    "dziękujemy za zamówienie i płatność. Potwierdzamy zawarcie umowy.",
    "",
    "Dane zamówienia:",
    `- ${szkolenie ? "szkolenie otwarte online" : "produkt"}: ${produkt.nazwa},`,
    `- ${szkolenie ? "termin" : "dostęp"}: ${produkt.termin},`,
    `- zapłacona kwota: ${kwotaZl(platnosc.kwota)} zł (cena końcowa, sprzedawca korzysta ze zwolnienia z VAT na podstawie art. 113 ustawy o VAT),`,
    `- data zawarcia umowy: ${czasWarszawa(czas)} (zaksięgowanie płatności),`,
    `- numer transakcji Tpay: ${platnosc.trId || "brak"}.`,
    "",
  );

  if (szkolenie) {
    linie.push(
      "Jak zrealizujemy szkolenie:",
      "- najpóźniej 1 dzień roboczy przed rozpoczęciem wyślemy wiadomość organizacyjną z linkiem do spotkania i informacjami technicznymi,",
      "- imienny certyfikat uczestnictwa w PDF wyślemy w ciągu 14 dni od zakończenia szkolenia,",
    );
    if (produkt.kursWPakiecie) {
      linie.push("- w cenie szkolenia otrzymujesz dostęp do kursu e-learning „Semantyczny HTML” od 1 grudnia 2026 r.,");
    }
  } else {
    linie.push(
      "Jak dostarczymy treść cyfrową:",
      "- dane dostępu wyślemy na ten adres e-mail, w terminie zależnym od oświadczenia opisanego niżej,",
    );
  }
  linie.push(
    "- fakturę wystawimy zgodnie z przepisami, w tym w Krajowym Systemie e-Faktur. Jeśli potrzebujesz faktury na firmę, a nie podano danych w formularzu, odpisz na tę wiadomość.",
    "",
    "Oświadczenia złożone przy zamówieniu:",
  );

  if (szkolenie) {
    if (zamowienie.rozpoczecie) {
      linie.push("Potwierdzamy, że zażądałeś(-aś) rozpoczęcia świadczenia usługi przed upływem 14 dni na odstąpienie od umowy i przyjąłeś(-ęłaś) do wiadomości, że po jej pełnym wykonaniu utracisz prawo odstąpienia od umowy.");
    } else {
      linie.push("Nie zażądałeś(-aś) rozpoczęcia świadczenia usługi przed upływem 14 dni na odstąpienie od umowy.");
      if (produkt.dataStartu && dniDo(produkt.dataStartu, czas) < 14) {
        linie.push("Szkolenie zaczyna się wcześniej niż 14 dni od zawarcia umowy. Jeśli chcesz w nim uczestniczyć, odpisz na tę wiadomość zdaniem: „Żądam rozpoczęcia świadczenia usługi przed upływem 14 dni na odstąpienie od umowy. Przyjmuję do wiadomości, że po pełnym wykonaniu usługi utracę prawo odstąpienia od umowy.”");
      }
    }
    if (produkt.kursWPakiecie) {
      linie.push("");
      if (zamowienie.kurs) {
        linie.push("Potwierdzamy, że zażądałeś(-aś) dostarczenia kursu e-learning „Semantyczny HTML” przed upływem 14 dni na odstąpienie od umowy i przyjąłeś(-ęłaś) do wiadomości, że po jego dostarczeniu utracisz prawo odstąpienia od umowy w zakresie kursu.");
      } else if (dniDo(START_KURSU, czas) < 14) {
        linie.push("Nie zażądałeś(-aś) wcześniejszego dostarczenia kursu e-learning „Semantyczny HTML”, więc dostęp do niego otrzymasz po upływie 14 dni od zawarcia umowy.");
      } else {
        linie.push("Nie zażądałeś(-aś) wcześniejszego dostarczenia kursu e-learning „Semantyczny HTML”. Do startu kursu minie ponad 14 dni, więc dostęp otrzymasz 1 grudnia 2026 r.");
      }
    }
  } else if (zamowienie.natychmiast) {
    linie.push("Potwierdzamy, że zażądałeś(-aś) dostarczenia treści cyfrowej przed upływem 14 dni na odstąpienie od umowy i przyjąłeś(-ęłaś) do wiadomości, że po jej dostarczeniu utracisz prawo odstąpienia od umowy.");
  } else {
    linie.push("Nie zażądałeś(-aś) natychmiastowego dostarczenia treści cyfrowej, więc dostęp wyślemy po upływie 14 dni od zawarcia umowy. Do tego czasu możesz odstąpić od umowy bez podawania przyczyny.");
  }

  linie.push(
    "",
    "Prawo odstąpienia od umowy:",
    "Jeśli kupujesz jako konsument albo przedsiębiorca na prawach konsumenta, możesz odstąpić od umowy w ciągu 14 dni od jej zawarcia, bez podawania przyczyny, na zasadach z § 11 regulaminu. Wystarczy napisać na a11y@wlaczwizje.pl. Możesz skorzystać ze wzoru formularza zamieszczonego niżej, ale nie musisz.",
    "",
    `W załączniku przesyłamy regulamin w wersji obowiązującej w chwili zawarcia umowy (plik ${plikPdf}, do pobrania też z https://www.a11yfirst.pl${regulamin.pdf}).`,
    "",
    "Pytania i reklamacje: a11y@wlaczwizje.pl. Reklamacje rozpatrujemy w ciągu 14 dni.",
    "",
    STOPKA,
    "",
    "",
    WZOR_ODSTAPIENIA,
  );

  return {
    temat: `Potwierdzenie zawarcia umowy: ${produkt.nazwa}, ${produkt.termin}`,
    tekst: linie.join("\n"),
    plikPdf,
  };
}

/**
 * PDF regulaminu w wersji z katalogu. Kolejnosc: plik dolaczony do funkcji
 * (vercel.json, includeFiles), adres z REGULAMIN_PDF_URL (tylko do testow na
 * podgladzie przed publikacja regulaminu), wlasna domena. Bez PDF potwierdzenia
 * nie wysylamy - § 7 ust. 9 wymaga regulaminu w zalaczniku, sam link nie wystarcza.
 */
export async function wczytajRegulaminPdf(adresPubliczny, env = process.env, regulamin = REGULAMIN) {
  const lokalny = path.join(process.cwd(), "public", regulamin.pdf);
  try {
    const dane = await fs.readFile(lokalny);
    if (dane.subarray(0, 5).toString() === "%PDF-") return dane;
  } catch { /* brak pliku w paczce funkcji - probujemy przez HTTP */ }

  const adresy = [env.REGULAMIN_PDF_URL, adresPubliczny && `${adresPubliczny}${regulamin.pdf}`,
    `https://www.a11yfirst.pl${regulamin.pdf}`].filter(Boolean);
  for (const adres of adresy) {
    try {
      // Na chronionym podgladzie Vercela (test na sandboxie) potrzebny jest
      // naglowek obejscia; na produkcji zmiennej nie ma i naglowek nie idzie.
      const naglowki = env.VERCEL_AUTOMATION_BYPASS_SECRET
        ? { "x-vercel-protection-bypass": env.VERCEL_AUTOMATION_BYPASS_SECRET } : {};
      const odp = await fetch(adres, { headers: naglowki });
      if (!odp.ok) continue;
      const dane = Buffer.from(await odp.arrayBuffer());
      if (dane.subarray(0, 5).toString() === "%PDF-") return dane;
    } catch { /* nastepny adres */ }
  }
  throw new Error(`nie znaleziono PDF regulaminu ${regulamin.pdf}`);
}
