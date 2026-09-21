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

  // Status to nie wszystko. Sprawdzamy takze, czy wplynela PELNA kwota i we
  // wlasciwej walucie - inaczej niedoplata przeszlaby jako zaplacone szkolenie.
  const naleznosc = Number.parseFloat(pola.tr_amount);
  const wplata = Number.parseFloat(pola.tr_paid);
  const kwotaZgodna = Number.isFinite(naleznosc) && Number.isFinite(wplata) && wplata >= naleznosc;
  const walutaZgodna = !pola.tr_currency || pola.tr_currency === "PLN";

  const zaplacone =
    pola.tr_status === "true" && md5.zgodna !== false && kwotaZgodna && walutaZgodna;

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

  // Potwierdzenie odbioru. Dokladnie ta tresc, bez znaku konca linii.
  res.status(200).send("TRUE");
}
