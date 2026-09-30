/**
 * Odbior powiadomienia o platnosci z Tpay (ITN).
 *
 * To jest jedyne miejsce, ktore moze uznac platnosc za potwierdzona. Przegladarka
 * po powrocie z bramki NIE jest dowodem zaplaty - uzytkownik moze tam trafic
 * bez placenia, wpisujac adres recznie.
 *
 * Kontrakt wg dokumentacji Tpay (sprawdzony 2026-09-21):
 *  - metoda POST, typ tresci application/x-www-form-urlencoded,
 *  - podpis w naglowku X-JWS-Signature: odlaczony JWS (RFC 7515), RS256,
 *    trzy czesci rozdzielone kropkami, srodkowa pusta,
 *  - podpisywany jest ciag `<naglowek-b64url>.<base64url(surowe cialo)>`,
 *  - certyfikat podpisujacy wskazuje pole x5u w naglowku JWS; MUSI zaczynac sie
 *    od https://secure.tpay.com, inaczej atakujacy podstawilby wlasny certyfikat,
 *  - odpowiedz musi miec status 200 i tresc dokladnie `TRUE`; kazda inna
 *    powoduje ponawianie (do 37 prob w ciagu doby),
 *  - to samo powiadomienie potrafi przyjsc wielokrotnie - obsluga musi byc
 *    idempotentna.
 */

import crypto from "node:crypto";
import { rozlozIdentyfikator, zbudujPotwierdzenie, wczytajRegulaminPdf } from "./_potwierdzenie.mjs";
import { wyslijMail, konfiguracjaPoczty } from "./_poczta.mjs";
import { podpiszZgode } from "./_zgoda.mjs";

/**
 * Wylaczamy parser ciala Vercela. Podpis liczony jest z SUROWEGO tekstu -
 * gdyby platforma zdazyla go sparsowac, strumien bylby juz pusty, a kazde
 * powiadomienie odrzucone jako niepodpisane.
 */
export const config = { api: { bodyParser: false } };

const BAZA_PRODUKCJA = "https://secure.tpay.com";
const BAZA_SANDBOX = "https://secure.sandbox.tpay.com";

/** Cache certyfikatow w pamieci instancji - ograniczamy ruch do Tpay. */
const cacheCertow = new Map();

function dozwolonyX5u(x5u, sandbox) {
  const baza = sandbox ? BAZA_SANDBOX : BAZA_PRODUKCJA;
  return typeof x5u === "string" && x5u.startsWith(`${baza}/`);
}

async function pobierzPem(url) {
  if (cacheCertow.has(url)) return cacheCertow.get(url);
  const odp = await fetch(url);
  if (!odp.ok) throw new Error(`nie pobrano certyfikatu ${url}: HTTP ${odp.status}`);
  const pem = await odp.text();
  cacheCertow.set(url, pem);
  return pem;
}

function bezOgonkaBase64url(tekst) {
  return Buffer.from(tekst.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

/**
 * Weryfikuje odlaczony podpis JWS nad surowym cialem zadania.
 * Rzuca wyjatkiem przy kazdej nieprawidlowosci - brak podpisu tez jest bledem.
 */
async function sprawdzPodpis(naglowekJws, suroweCialo, sandbox) {
  if (!naglowekJws) throw new Error("brak naglowka X-JWS-Signature");

  const [naglowekB64, srodek, podpisB64] = String(naglowekJws).split(".");
  if (!naglowekB64 || !podpisB64) throw new Error("zly format JWS");
  if (srodek) throw new Error("oczekiwano odlaczonego JWS (pusta czesc srodkowa)");

  const naglowek = JSON.parse(bezOgonkaBase64url(naglowekB64).toString("utf8"));
  if (naglowek.alg !== "RS256") throw new Error(`nieobslugiwany algorytm: ${naglowek.alg}`);
  if (!dozwolonyX5u(naglowek.x5u, sandbox)) {
    throw new Error(`x5u spoza domeny Tpay: ${naglowek.x5u}`);
  }

  const certPem = await pobierzPem(naglowek.x5u);
  const cert = new crypto.X509Certificate(certPem);

  const teraz = new Date();
  if (teraz < new Date(cert.validFrom) || teraz > new Date(cert.validTo)) {
    throw new Error("certyfikat podpisujacy poza okresem waznosci");
  }

  const bazaCa = sandbox ? BAZA_SANDBOX : BAZA_PRODUKCJA;
  const rootPem = await pobierzPem(`${bazaCa}/x509/tpay-jws-root.pem`);
  if (!cert.verify(new crypto.X509Certificate(rootPem).publicKey)) {
    throw new Error("certyfikat nie pochodzi od zaufanego CA Tpay");
  }

  const doPodpisu = `${naglowekB64}.${Buffer.from(suroweCialo).toString("base64url")}`;
  const ok = crypto.verify(
    "sha256",
    Buffer.from(doPodpisu),
    { key: cert.publicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
    bezOgonkaBase64url(podpisB64),
  );
  if (!ok) throw new Error("podpis nie zgadza sie z trescia powiadomienia");
}

/** Dodatkowa kontrola: suma md5 liczona z kodu bezpieczenstwa sprzedawcy. */
function sprawdzMd5(pola) {
  const kod = process.env.TPAY_KOD_BEZPIECZENSTWA;
  if (!kod) return { sprawdzono: false };
  const oczekiwana = crypto
    .createHash("md5")
    .update(`${pola.id}${pola.tr_id}${pola.tr_amount}${pola.tr_crc}${kod}`)
    .digest("hex");
  return { sprawdzono: true, zgodna: oczekiwana === pola.md5sum };
}

async function surowyTekst(req) {
  if (typeof req.body === "string") return req.body;
  const kawalki = [];
  for await (const kawalek of req) kawalki.push(kawalek);
  return Buffer.concat(kawalki).toString("utf8");
}

/**
 * Czy powiadomienie potwierdza pelna zaplate.
 *
 * Status to nie wszystko. Sprawdzamy takze, czy wplynela PELNA kwota i we
 * wlasciwej walucie - inaczej niedoplata przeszlaby jako zaplacone szkolenie.
 * Tpay wysyla status wielkimi literami ("TRUE"; sprawdzone na sandboxie
 * 30.09.2026). "PAID" to wplata zaksiegowana. CHARGEBACK i FALSE nie sa zaplata.
 */
export function ocenPlatnosc(pola, md5 = { zgodna: null }) {
  const naleznosc = Number.parseFloat(pola.tr_amount);
  const wplata = Number.parseFloat(pola.tr_paid);
  const kwotaZgodna = Number.isFinite(naleznosc) && Number.isFinite(wplata) && wplata >= naleznosc;
  const walutaZgodna = !pola.tr_currency || pola.tr_currency === "PLN";
  const status = String(pola.tr_status || "").toUpperCase();
  const zaplacone =
    (status === "TRUE" || status === "PAID") && md5.zgodna !== false && kwotaZgodna && walutaZgodna;
  return { zaplacone, kwotaZgodna, walutaZgodna };
}

/** Pamiec instancji - odsiewa powtorki w obrebie jednego procesu. */
const obsluzone = new Set();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const sandbox = process.env.TPAY_SANDBOX === "1";

  let cialo;
  try {
    cialo = await surowyTekst(req);
    await sprawdzPodpis(req.headers["x-jws-signature"], cialo, sandbox);
  } catch (blad) {
    // Nie odpowiadamy TRUE - powiadomienie bez poprawnego podpisu nie jest
    // powiadomieniem od Tpay i nie moze potwierdzic zadnej platnosci.
    console.error(JSON.stringify({ zdarzenie: "itn-odrzucone", powod: String(blad.message || blad) }));
    res.status(400).send("BAD SIGNATURE");
    return;
  }

  const pola = Object.fromEntries(new URLSearchParams(cialo));
  const md5 = sprawdzMd5(pola);

  const { zaplacone, kwotaZgodna, walutaZgodna } = ocenPlatnosc(pola, md5);

  // Idempotencja: to samo powiadomienie potrafi przyjsc wiele razy.
  const klucz = `${pola.tr_id}:${pola.tr_status}`;
  const powtorka = obsluzone.has(klucz);
  obsluzone.add(klucz);

  console.log(JSON.stringify({
    zdarzenie: powtorka ? "itn-powtorka" : "itn-przyjete",
    tr_id: pola.tr_id,
    zamowienie: pola.tr_crc,
    status: pola.tr_status,
    kwota: pola.tr_amount,
    zaplacono: pola.tr_paid,
    waluta: pola.tr_currency,
    email: pola.tr_email,
    tryb_testowy: pola.test_mode,
    md5_sprawdzona: md5.sprawdzono,
    md5_zgodna: md5.zgodna ?? null,
    kwota_zgodna: kwotaZgodna,
    waluta_zgodna: walutaZgodna,
    uznane_za_zaplacone: zaplacone,
  }));

  // Potwierdzenie zawarcia umowy (§ 7 ust. 9 regulaminu) - przed odpowiedzia,
  // bo po wyslaniu odpowiedzi Vercel moze zamrozic funkcje. Blad wysylki nie
  // zmienia odpowiedzi dla Tpay: platnosc jest przyjeta, a brak maila zglaszamy
  // alarmem na POCZTA_KOPIA, zeby czlowiek wyslal potwierdzenie recznie.
  if (zaplacone && !powtorka) {
    await wyslijPotwierdzenie(pola);
  }

  // Potwierdzenie odbioru. Dokladnie ta tresc, bez znaku konca linii.
  res.status(200).send("TRUE");
}

function adresPubliczny() {
  const jawny = process.env.PUBLICZNY_ADRES;
  if (jawny) return jawny.replace(/\/+$/, "");
  const zVercela = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;
  return zVercela ? `https://${zVercela.replace(/\/+$/, "")}` : "";
}

/**
 * Wysyla klientowi potwierdzenie z PDF regulaminu, z kopia UDW na POCZTA_KOPIA
 * (archiwum i dowod oswiadczen). Nigdy nie rzuca - kazdy problem konczy sie
 * wpisem w logu i, jesli sie da, alarmem do czlowieka.
 */
export async function wyslijPotwierdzenie(pola, zaleznosci = {}) {
  const wyslij = zaleznosci.wyslijMail || wyslijMail;
  const pdf = zaleznosci.wczytajRegulaminPdf || wczytajRegulaminPdf;
  const poczta = konfiguracjaPoczty();
  const zamowienie = rozlozIdentyfikator(pola.tr_crc);

  const alarm = async (powod) => {
    console.error(JSON.stringify({ zdarzenie: "potwierdzenie-niewyslane", zamowienie: pola.tr_crc, powod }));
    try {
      await wyslij({
        do: poczta.kopia,
        temat: `[Tpay] Potwierdzenie NIE wysłane: ${pola.tr_id || pola.tr_crc}`,
        tekst: [
          "Płatność jest zaksięgowana, ale automatyczne potwierdzenie zawarcia umowy nie wyszło.",
          "Wyślij je ręcznie z PDF regulaminu (szablon: raporty/2026-09-24-mail-dostep-tresci-cyfrowej-szablon.md).",
          "",
          `Powód: ${powod}`,
          `Transakcja Tpay: ${pola.tr_id}`,
          `Zamówienie: ${pola.tr_crc}`,
          `Kwota: ${pola.tr_paid} ${pola.tr_currency || "PLN"}`,
          `E-mail kupującego: ${pola.tr_email}`,
          "",
          "Oświadczenia i uczestników znajdziesz w logu Vercela (zdarzenie platnosc-rozpoczeta).",
        ].join("\n"),
      });
    } catch (blad) {
      console.error(JSON.stringify({ zdarzenie: "alarm-niewyslany", powod: String(blad.message || blad) }));
    }
    return { wyslano: false, powod };
  };

  if (!zamowienie) return alarm("identyfikator zamowienia spoza bramki");
  if (!poczta.gotowa && !zaleznosci.wyslijMail) {
    console.error(JSON.stringify({ zdarzenie: "potwierdzenie-niewyslane", zamowienie: pola.tr_crc, powod: "brak konfiguracji SMTP" }));
    return { wyslano: false, powod: "brak konfiguracji SMTP" };
  }

  let regulamin;
  try {
    regulamin = await pdf(adresPubliczny());
  } catch (blad) {
    return alarm(String(blad.message || blad));
  }

  // Link do pozniejszego zadania rozpoczecia uslugi - tylko przy szkoleniu bez
  // zaznaczonego pola. O tym, czy pojawi sie w tresci, decyduje termin startu.
  let linkZgody = null;
  if (zamowienie.rozpoczecie === false && zamowienie.produkt.dataStartu) {
    try {
      const token = podpiszZgode({
        zamowienie: pola.tr_crc, email: pola.tr_email, wazneDo: zamowienie.produkt.dataStartu,
      });
      linkZgody = `${adresPubliczny() || "https://www.a11yfirst.pl"}/zgoda-rozpoczecie#t=${token}`;
    } catch { /* bez sekretu - tresc podpowie kontakt mailowy */ }
  }

  const { temat, tekst, plikPdf } = zbudujPotwierdzenie(zamowienie, {
    kwota: pola.tr_paid || pola.tr_amount,
    trId: pola.tr_id,
    czas: new Date(),
    linkZgody,
  });

  try {
    await wyslij({
      do: pola.tr_email,
      udw: [poczta.kopia],
      temat,
      tekst,
      zalaczniki: [{ nazwa: plikPdf, typ: "application/pdf", dane: regulamin }],
    });
  } catch (blad) {
    return alarm(`wysylka do klienta: ${String(blad.message || blad)}`);
  }

  console.log(JSON.stringify({ zdarzenie: "potwierdzenie-wyslane", zamowienie: pola.tr_crc, tr_id: pola.tr_id }));
  return { wyslano: true };
}
