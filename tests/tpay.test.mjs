/**
 * Testy warstwy platnosci: wycena po stronie serwera i odrzucanie
 * powiadomien bez wiarygodnego podpisu.
 *
 * Nie dotykaja sieci ani prawdziwych kont Tpay.
 */

import test from "node:test";
import assert from "node:assert/strict";

process.env.TPAY_KODY_RABATOWE = JSON.stringify({
  WEBINAR0925: { produkty: ["dostepne-dokumenty"], cenaGrosze: 159900, wazneDo: "2026-12-31" },
  WYGASLY: { produkty: ["dostepne-dokumenty"], cenaGrosze: 159900, wazneDo: "2026-01-01" },
  ZADROGI: { produkty: ["dostepne-dokumenty"], cenaGrosze: 999900, wazneDo: "2026-12-31" },
  WEBINAR2409: { produkty: ["semantyczny-html"], cenaGrosze: 50000, wazneDo: "2026-10-05" },
});

const { wycen, PRODUKTY } = await import("../api/_katalog.mjs");

test("cena stala zgadza sie z cennikiem", () => {
  assert.equal(wycen("semantyczny-html").kwotaGrosze, 99900);
  assert.equal(wycen("wcag-dla-specjalistow").kwotaGrosze, 249900);
  assert.equal(wycen("ai-dla-audytora").kwotaGrosze, 199900);
  assert.equal(wycen("dostepne-dokumenty").kwotaGrosze, 199900);
});

test("wazny kod obniza cene do ustalonej kwoty", () => {
  const w = wycen("dostepne-dokumenty", "WEBINAR0925");
  assert.equal(w.kwotaGrosze, 159900);
  assert.equal(w.rabat.zastosowany, true);
});

test("wielkosc liter i spacje w kodzie nie maja znaczenia", () => {
  assert.equal(wycen("dostepne-dokumenty", "  webinar0925 ").kwotaGrosze, 159900);
});

test("kod przypisany do innego produktu nie dziala", () => {
  const w = wycen("wcag-dla-specjalistow", "WEBINAR0925");
  assert.equal(w.kwotaGrosze, 249900, "musi zostac cena stala");
  assert.equal(w.rabat.zastosowany, false);
});

test("kod po terminie waznosci nie dziala", () => {
  const w = wycen("dostepne-dokumenty", "WYGASLY");
  assert.equal(w.kwotaGrosze, 199900);
  assert.equal(w.rabat.powod, "kod-wygasl");
});

test("kod nie moze podniesc ceny ani jej wyzerowac", () => {
  assert.equal(wycen("dostepne-dokumenty", "ZADROGI").kwotaGrosze, 199900);
});

test("kurs po kodzie z webinaru kosztuje 500 zl", () => {
  const w = wycen("semantyczny-html", "WEBINAR2409");
  assert.equal(w.kwotaGrosze, 50000);
  assert.equal(w.rabat.zastosowany, true);
});

test("nieznany produkt jest odrzucany, nie wyceniany", () => {
  assert.equal(wycen("nie-ma-takiego").ok, false);
});

test("katalog nie zawiera produktu bez ceny albo terminu", () => {
  for (const [klucz, p] of Object.entries(PRODUKTY)) {
    assert.ok(Number.isInteger(p.cenaGrosze) && p.cenaGrosze > 0, `${klucz}: zla cena`);
    assert.ok(p.termin && p.nazwa, `${klucz}: brak terminu albo nazwy`);
  }
});

// --- ITN: powiadomienie bez wiarygodnego podpisu nie moze nic potwierdzic ---

function atrapaOdpowiedzi() {
  return {
    kod: null, tresc: null,
    status(k) { this.kod = k; return this; },
    send(t) { this.tresc = t; return this; },
    json(o) { this.tresc = o; return this; },
  };
}

function zadanie(cialo, naglowki = {}) {
  const req = { method: "POST", headers: naglowki, body: cialo };
  req[Symbol.asyncIterator] = async function* () { yield Buffer.from(cialo); };
  return req;
}

const { default: itn } = await import("../api/tpay-itn.mjs");
const CIALO = "id=123&tr_id=TR-1&tr_amount=1999.00&tr_crc=a11y-x&tr_status=true";

test("ITN bez naglowka podpisu jest odrzucone", async () => {
  const res = atrapaOdpowiedzi();
  await itn(zadanie(CIALO), res);
  assert.equal(res.kod, 400);
  assert.notEqual(res.tresc, "TRUE");
});

test("ITN z podpisem o zlym formacie jest odrzucone", async () => {
  const res = atrapaOdpowiedzi();
  await itn(zadanie(CIALO, { "x-jws-signature": "to-nie-jest-jws" }), res);
  assert.equal(res.kod, 400);
});

test("ITN wskazujacy certyfikat spoza domeny Tpay jest odrzucone", async () => {
  const naglowek = Buffer.from(JSON.stringify({
    alg: "RS256", x5u: "https://atakujacy.example/cert.pem",
  })).toString("base64url");
  const res = atrapaOdpowiedzi();
  await itn(zadanie(CIALO, { "x-jws-signature": `${naglowek}..cGRw` }), res);
  assert.equal(res.kod, 400, "x5u spoza secure.tpay.com nie moze byc zaakceptowany");
  assert.notEqual(res.tresc, "TRUE");
});

test("ITN z nieobslugiwanym algorytmem jest odrzucone", async () => {
  const naglowek = Buffer.from(JSON.stringify({
    alg: "none", x5u: "https://secure.tpay.com/x509/notifications-jws.pem",
  })).toString("base64url");
  const res = atrapaOdpowiedzi();
  await itn(zadanie(CIALO, { "x-jws-signature": `${naglowek}..cGRw` }), res);
  assert.equal(res.kod, 400);
});

test("ITN metoda inna niz POST jest odrzucone", async () => {
  const res = atrapaOdpowiedzi();
  await itn({ method: "GET", headers: {} }, res);
  assert.equal(res.kod, 405);
});

// --- Start platnosci: przegladarka nie moze wplynac na kwote ---

function atrapaFetch(zapamietaj) {
  return async (url, opcje) => {
    if (String(url).endsWith("/oauth/auth")) {
      return { ok: true, json: async () => ({ access_token: "token-testowy" }) };
    }
    zapamietaj.zadanie = JSON.parse(opcje.body);
    return {
      ok: true,
      json: async () => ({ transactionPaymentUrl: "https://secure.tpay.com/zaplac/abc", transactionId: "TR-9" }),
    };
  };
}

async function wywolajStart(cialo) {
  process.env.TPAY_CLIENT_ID = "id";
  process.env.TPAY_CLIENT_SECRET = "sekret";
  process.env.PUBLICZNY_ADRES = "https://a11yfirst.pl";
  const zapamietane = {};
  const oryginalny = globalThis.fetch;
  globalThis.fetch = atrapaFetch(zapamietane);
  try {
    const { default: start } = await import("../api/platnosc-start.mjs");
    const res = atrapaOdpowiedzi();
    await start({ method: "POST", body: cialo, headers: {} }, res);
    return { res, zadanie: zapamietane.zadanie };
  } finally {
    globalThis.fetch = oryginalny;
  }
}

test("kwota podana przez przegladarke jest ignorowana", async () => {
  const { res, zadanie } = await wywolajStart({
    produkt: "wcag-dla-specjalistow",
    imie: "Jan Kowalski",
    email: "jan@example.com",
    amount: 1, kwota: 1, cenaGrosze: 100, // proba podmiany ceny
  });
  assert.equal(res.kod, 200);
  assert.equal(zadanie.amount, 2499, "serwer musi policzyc cene sam");
});

test("identyfikator zamowienia nie jest zgadywalny i nie wycieka w adresach powrotu", async () => {
  const { zadanie } = await wywolajStart({
    produkt: "dostepne-dokumenty", imie: "Anna Nowak", email: "anna@example.com",
  });
  assert.match(zadanie.hiddenDescription, /^a11y-dostepne-dokumenty-[0-9a-f-]{36}$/);
  assert.equal(zadanie.callbacks.payerUrls.success, "https://a11yfirst.pl/platnosc-udana");
  assert.ok(!zadanie.callbacks.payerUrls.success.includes("?"), "brak identyfikatora w adresie powrotu");
  assert.equal(zadanie.callbacks.notification.url, "https://a11yfirst.pl/api/tpay-itn");
});

test("brak zgody na regulamin nie blokuje serwera, ale brak danych juz tak", async () => {
  const { res } = await wywolajStart({ produkt: "dostepne-dokumenty", imie: "A", email: "zly" });
  assert.equal(res.kod, 400);
});

// --- Tresci cyfrowe: prawo odstapienia ---

test("kurs bez zgody na natychmiastowe swiadczenie nadal da sie kupic", async () => {
  const { res, zadanie } = await wywolajStart({
    produkt: "semantyczny-html", imie: "Jan Kowalski", email: "jan@example.com",
    natychmiast: false,
  });
  assert.equal(res.kod, 200, "brak zgody nie moze blokowac sprzedazy");
  assert.match(zadanie.hiddenDescription, /^a11y-semantyczny-html-n0-/);
});

test("zgoda na natychmiastowe swiadczenie jest widoczna w identyfikatorze", async () => {
  const { zadanie } = await wywolajStart({
    produkt: "semantyczny-html", imie: "Jan Kowalski", email: "jan@example.com",
    natychmiast: true,
  });
  assert.match(zadanie.hiddenDescription, /^a11y-semantyczny-html-n1-/);
});

test("szkolenie z terminem nie dostaje znacznika tresci cyfrowych", async () => {
  const { zadanie } = await wywolajStart({
    produkt: "wcag-dla-specjalistow", imie: "Jan Kowalski", email: "jan@example.com",
    natychmiast: true,
  });
  assert.ok(!/-n[01]-/.test(zadanie.hiddenDescription), "znacznik dotyczy tylko tresci cyfrowych");
});
