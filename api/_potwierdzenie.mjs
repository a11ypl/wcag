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

/** Plik wzoru formularza odstapienia - osobny zalacznik, nie tresc maila. */
export const FORMULARZ_ODSTAPIENIA = "/formularz-odstapienia-od-umowy.pdf";

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Tresc potwierdzenia jako sekcje: {naglowek, akapity[], lista[], link}.
 * Z tych samych sekcji powstaje wersja HTML (prawdziwe naglowki i listy)
 * i wersja tekstowa - nie da sie ich rozjechac.
 */
function sekcjePotwierdzenia(zamowienie, platnosc, regulamin) {
  const { produkt } = zamowienie;
  const czas = platnosc.czas || new Date();
  const plikPdf = path.basename(regulamin.pdf);
  const plikFormularza = path.basename(FORMULARZ_ODSTAPIENIA);
  const szkolenie = !produkt.tresciCyfrowe;
  const sekcje = [];

  sekcje.push({
    naglowek: "Dane zamówienia",
    lista: [
      [szkolenie ? "Szkolenie otwarte online" : "Produkt", produkt.nazwa],
      [szkolenie ? "Termin" : "Dostęp", produkt.termin],
      ["Zapłacona kwota", `${kwotaZl(platnosc.kwota)} zł (cena końcowa, sprzedawca korzysta ze zwolnienia z VAT na podstawie art. 113 ustawy o VAT)`],
      ["Data zawarcia umowy", `${czasWarszawa(czas)} (zaksięgowanie płatności)`],
      ["Numer transakcji Tpay", platnosc.trId || "brak"],
    ].map(([etykieta, wartosc]) => ({ etykieta, wartosc })),
  });

  const realizacja = szkolenie
    ? [
      "Najpóźniej 1 dzień roboczy przed rozpoczęciem wyślemy wiadomość organizacyjną z linkiem do spotkania i informacjami technicznymi.",
      "Imienny certyfikat uczestnictwa w PDF wyślemy w ciągu 14 dni od zakończenia szkolenia.",
      ...(produkt.kursWPakiecie ? ["W cenie szkolenia otrzymujesz dostęp do kursu e-learning „Semantyczny HTML” od 1 grudnia 2026 r., na 12 miesięcy od przekazania dostępu."] : []),
    ]
    : ["Dane dostępu wyślemy na ten adres e-mail, w terminie zależnym od oświadczenia opisanego niżej."];
  realizacja.push("Fakturę wystawimy zgodnie z przepisami, w tym w Krajowym Systemie e-Faktur. Jeśli potrzebujesz faktury na firmę, a nie podano danych w formularzu, odpisz na tę wiadomość.");
  sekcje.push({
    naglowek: szkolenie ? "Jak zrealizujemy szkolenie" : "Jak dostarczymy treść cyfrową",
    lista: realizacja.map((wartosc) => ({ wartosc })),
  });

  const oswiadczenia = [];
  let link = null;
  if (szkolenie) {
    if (zamowienie.rozpoczecie) {
      oswiadczenia.push("Potwierdzamy, że zażądałeś(-aś) rozpoczęcia świadczenia usługi przed upływem 14 dni na odstąpienie od umowy i przyjąłeś(-ęłaś) do wiadomości, że po jej pełnym wykonaniu utracisz prawo odstąpienia od umowy.");
    } else {
      oswiadczenia.push("Nie zażądałeś(-aś) rozpoczęcia świadczenia usługi przed upływem 14 dni na odstąpienie od umowy.");
      if (produkt.dataStartu && dniDo(produkt.dataStartu, czas) < 14) {
        // Tylko konsumenci; wersja lagodna wybrana przez Damiana 29.09.
        if (platnosc.linkZgody) {
          oswiadczenia.push("Szkolenie zaczyna się wcześniej niż 14 dni od zawarcia umowy. Jeśli kupujesz jako osoba prywatna, potwierdź jednym kliknięciem, że chcesz, żebyśmy zaczęli przed upływem 14 dni na odstąpienie.");
          link = { tekst: "Chcę wziąć udział w szkoleniu", adres: platnosc.linkZgody };
        } else {
          oswiadczenia.push("Szkolenie zaczyna się wcześniej niż 14 dni od zawarcia umowy. Jeśli kupujesz jako osoba prywatna, odpisz, że chcesz, żebyśmy zaczęli przed upływem 14 dni na odstąpienie.");
        }
      }
    }
    if (produkt.kursWPakiecie) {
      if (zamowienie.kurs) {
        oswiadczenia.push("Potwierdzamy, że zażądałeś(-aś) dostarczenia kursu e-learning „Semantyczny HTML” przed upływem 14 dni na odstąpienie od umowy i przyjąłeś(-ęłaś) do wiadomości, że po jego dostarczeniu utracisz prawo odstąpienia od umowy w zakresie kursu.");
      } else if (dniDo(START_KURSU, czas) < 14) {
        oswiadczenia.push("Nie zażądałeś(-aś) wcześniejszego dostarczenia kursu e-learning „Semantyczny HTML”, więc dostęp do niego otrzymasz po upływie 14 dni od zawarcia umowy.");
      }
    }
  } else if (zamowienie.natychmiast) {
    oswiadczenia.push("Potwierdzamy, że zażądałeś(-aś) dostarczenia treści cyfrowej przed upływem 14 dni na odstąpienie od umowy i przyjąłeś(-ęłaś) do wiadomości, że po jej dostarczeniu utracisz prawo odstąpienia od umowy.");
  } else {
    oswiadczenia.push("Nie zażądałeś(-aś) natychmiastowego dostarczenia treści cyfrowej, więc dostęp wyślemy po upływie 14 dni od zawarcia umowy. Do tego czasu możesz odstąpić od umowy bez podawania przyczyny.");
  }
  sekcje.push({ naglowek: "Oświadczenia złożone przy zamówieniu", akapity: oswiadczenia, link });

  sekcje.push({
    naglowek: "Prawo odstąpienia od umowy",
    akapity: [
      "Jeśli kupujesz jako konsument albo przedsiębiorca na prawach konsumenta, możesz odstąpić od umowy w ciągu 14 dni od jej zawarcia, bez podawania przyczyny, na zasadach z § 11 regulaminu. Wystarczy napisać na a11y@wlaczwizje.pl.",
      `Wzór formularza odstąpienia przesyłamy w załączniku (plik ${plikFormularza}). Możesz z niego skorzystać, ale nie musisz.`,
    ],
  });
  sekcje.push({
    naglowek: "Regulamin",
    akapity: [`W załączniku przesyłamy regulamin w wersji obowiązującej w chwili zawarcia umowy (plik ${plikPdf}). Jest też do pobrania ze strony https://www.a11yfirst.pl${regulamin.pdf}.`],
  });
  sekcje.push({
    naglowek: "Pytania i reklamacje",
    akapity: ["Napisz na a11y@wlaczwizje.pl. Reklamacje rozpatrujemy w ciągu 14 dni."],
  });

  return { sekcje, plikPdf, plikFormularza };
}

function tekstZSekcji(sekcje) {
  const linie = ["Dzień dobry,", "", "dziękujemy za zamówienie i płatność. Potwierdzamy zawarcie umowy.", ""];
  for (const s of sekcje) {
    linie.push(s.naglowek.toUpperCase());
    for (const a of s.akapity || []) linie.push(a);
    if (s.link) linie.push(`${s.link.tekst}: ${s.link.adres}`);
    for (const e of s.lista || []) linie.push(`- ${e.etykieta ? `${e.etykieta}: ` : ""}${e.wartosc}`);
    linie.push("");
  }
  linie.push("Zespół Accessibility First, Włącz Wizję",
    "Włącz Wizję sp. z o.o., ul. Sternicza 129 lok. 50, 01-350 Warszawa",
    "a11y@wlaczwizje.pl, tel. +48 727 935 587");
  return linie.join("\n");
}

/**
 * HTML w identyfikacji Accessibility First (kolory, krój, stopka jak
 * newsletter-standard/template.html w repo mozg). Style inline, bez obrazow,
 * prawdziwe naglowki h1/h2 i listy ul, jezyk pl, landmark main i footer.
 */
const STYL_LINKU = 'style="color:#5f28b4;text-decoration:underline;font-weight:bold;"';

/**
 * Tekst do HTML: adresy e-mail i strony jako linki w identyfikacji marki
 * (fioletowe, podkreslone, pogrubione), jak w stopce. Kropka na koncu zdania
 * nie wchodzi do adresu.
 */
function zLinkami(tekst) {
  return esc(tekst).replace(
    /(https:\/\/[^\s<]+?|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})(?=[.,)]?(?:\s|$))/g,
    (adres) => `<a href="${adres.startsWith("https://") ? adres : `mailto:${adres}`}" ${STYL_LINKU}>${adres}</a>`,
  );
}

function htmlZSekcji(sekcje, temat) {
  const P = 'style="margin:0 0 16px;"';
  const blok = (s) => {
    let h = `<h2 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#5f28b4;">${esc(s.naglowek)}</h2>`;
    for (const a of s.akapity || []) h += `<p ${P}>${zLinkami(a)}</p>`;
    if (s.link) {
      h += `<p style="margin:0 0 16px;"><a href="${esc(s.link.adres)}" style="display:inline-block;padding:12px 20px;background-color:#5f28b4;color:#ffffff;font-weight:bold;text-decoration:underline;">${esc(s.link.tekst)}</a></p>`;
    }
    if (s.lista) {
      h += `<ul style="margin:0 0 16px;padding-left:24px;">${s.lista.map((e) =>
        `<li style="margin:0 0 8px;">${e.etykieta ? `<strong>${esc(e.etykieta)}:</strong> ` : ""}${zLinkami(e.wartosc)}</li>`).join("")}</ul>`;
    }
    return `<section class="pad" style="padding:8px 36px 8px;">${h}</section>`;
  };
  return `<!doctype html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(temat)}</title>
<style>a:focus{outline:3px solid #000;outline-offset:4px}@media(max-width:480px){.pad{padding-left:20px!important;padding-right:20px!important}h1{font-size:30px!important}h2{font-size:22px!important}}@media(forced-colors:active){a{border:2px solid LinkText!important}}</style></head>
<body style="margin:0;padding:0;background-color:#f8f9fa;color:#000000;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:1.6;overflow-wrap:anywhere;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;table-layout:fixed;border-collapse:collapse;"><tr><td style="padding:24px 0;" align="center">
<!--[if mso]><table role="presentation" width="640" align="center"><tr><td><![endif]-->
<main style="width:100%;max-width:640px;box-sizing:border-box;margin:0 auto;background-color:#ffffff;text-align:left;">
<div class="pad" style="padding:28px 36px;border-top:8px solid #fa9632;">
<p style="margin:0;color:#5f28b4;font-size:24px;line-height:1.3;font-weight:bold;">Accessibility First</p>
<p style="margin:6px 0 0;color:#000000;font-size:16px;">Włącz Wizję · dostępność w praktyce</p></div>
<div class="pad" style="padding:32px 36px;background-color:#5f28b4;color:#ffffff;">
<p style="margin:0 0 12px;font-size:16px;">Potwierdzenie zamówienia</p>
<h1 style="margin:0;font-size:36px;line-height:1.2;color:#ffffff;">Potwierdzamy zawarcie umowy</h1></div>
<div class="pad" style="padding:32px 36px 8px;"><p ${P}>Dzień dobry,</p><p ${P}>dziękujemy za zamówienie i płatność. Potwierdzamy zawarcie umowy.</p></div>
${sekcje.map(blok).join("\n")}
<div class="pad" style="padding:16px 36px 12px;"><p style="margin:0 0 18px;font-weight:bold;">Zespół Accessibility First</p></div>
<footer class="pad" style="padding:24px 36px 32px;background-color:#f8f9fa;font-size:16px;color:#000000;">
<p style="margin:0 0 16px;">Accessibility First<br>Włącz Wizję sp. z o.o., ul. Sternicza 129 lok. 50, 01-350 Warszawa<br>tel. +48 727 935 587<br><a href="mailto:a11y@wlaczwizje.pl" style="color:#5f28b4;text-decoration:underline;font-weight:bold;">a11y@wlaczwizje.pl</a></p>
<p style="margin:0;"><a href="https://www.a11yfirst.pl/regulamin" style="color:#5f28b4;text-decoration:underline;font-weight:bold;">Regulamin</a> · <a href="https://www.a11yfirst.pl/polityka-prywatnosci" style="color:#5f28b4;text-decoration:underline;font-weight:bold;">Polityka prywatności</a></p></footer>
</main><!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`;
}

/**
 * Buduje temat, tekst i HTML potwierdzenia.
 *
 * `zamowienie`: wynik rozlozIdentyfikator; `platnosc`: {kwota, trId, czas, linkZgody}.
 */
export function zbudujPotwierdzenie(zamowienie, platnosc, regulamin = REGULAMIN) {
  const temat = `Potwierdzenie zawarcia umowy: ${zamowienie.produkt.nazwa}, ${zamowienie.produkt.termin}`;
  const { sekcje, plikPdf, plikFormularza } = sekcjePotwierdzenia(zamowienie, platnosc, regulamin);
  return { temat, tekst: tekstZSekcji(sekcje), html: htmlZSekcji(sekcje, temat), plikPdf, plikFormularza };
}

/**
 * PDF regulaminu w wersji z katalogu. Kolejnosc: plik dolaczony do funkcji
 * (vercel.json, includeFiles), adres z REGULAMIN_PDF_URL (tylko do testow na
 * podgladzie przed publikacja regulaminu), wlasna domena. Bez PDF potwierdzenia
 * nie wysylamy - § 7 ust. 9 wymaga regulaminu w zalaczniku, sam link nie wystarcza.
 */
export async function wczytajRegulaminPdf(adresPubliczny, env = process.env, regulamin = REGULAMIN) {
  return wczytajPdf(regulamin.pdf, adresPubliczny, env);
}

/** PDF z public/: paczka funkcji, REGULAMIN_PDF_URL (tylko regulamin), wlasna domena, www. */
export async function wczytajPdf(sciezka, adresPubliczny, env = process.env) {
  const regulamin = { pdf: sciezka };
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
  throw new Error(`nie znaleziono PDF ${regulamin.pdf}`);
}
