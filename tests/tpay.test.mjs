/**
 * Testy warstwy platnosci: wycena po stronie serwera i odrzucanie
 * powiadomien bez wiarygodnego podpisu.
 *
 * Nie dotykaja sieci ani prawdziwych kont Tpay.
 */

import test from "node:test";
import assert from "node:assert/strict";

const { wycen, PRODUKTY } = await import("../api/_katalog.mjs");

// Warianty testowe wstrzykniete do katalogu: jeden juz wygasly, jeden drozszy
// od ceny regularnej. W repo takich nie trzymamy - to sa sytuacje, ktore maja
// nie zadzialac, a nie oferta.
PRODUKTY["dostepne-dokumenty"].warianty["test-wygasly"] = {
  nazwa: "wariant po terminie", cenaGrosze: 159900, wazneDo: "2026-01-01",
};
PRODUKTY["dostepne-dokumenty"].warianty["test-zadrogi"] = {
  nazwa: "wariant drozszy od ceny regularnej", cenaGrosze: 999900,
};

// Kurs "Semantyczny HTML" nie jest w sprzedazy (cena nieustalona), wiec
// mechanike tresci cyfrowych sprawdzamy na produkcie testowym.
PRODUKTY["test-tresc-cyfrowa"] = {
  nazwa: "Tresc cyfrowa testowa", termin: "dostep online", cenaGrosze: 99900, tresciCyfrowe: true,
};

test("cena stala zgadza sie z cennikiem", () => {
  assert.equal(wycen("wcag-dla-specjalistow").kwotaGrosze, 249900);
  assert.equal(wycen("ai-dla-audytora").kwotaGrosze, 199900);
  assert.equal(wycen("dostepne-dokumenty").kwotaGrosze, 199900);
});

test("wariant z linku obniza cene do ustalonej kwoty", () => {
  const w = wycen("wcag-dla-specjalistow", "webinar-2409");
  assert.equal(w.kwotaGrosze, 199900);
  assert.equal(w.wariant.zastosowany, true);
});

test("wielkosc liter i spacje w identyfikatorze wariantu nie maja znaczenia", () => {
  assert.equal(wycen("wcag-dla-specjalistow", "  WEBINAR-2409 ").kwotaGrosze, 199900);
});

test("wariant nalezy do produktu - nie da sie go przeniesc na inny", () => {
  // Kurs nie ma zadnego wariantu, wiec identyfikator z innego szkolenia
  // musi zostac zignorowany, a nie zastosowany.
  const w = wycen("test-tresc-cyfrowa", "webinar-2409");
  assert.equal(w.kwotaGrosze, 99900, "musi zostac cena stala");
  assert.equal(w.wariant.zastosowany, false);
  assert.equal(w.wariant.powod, "nieznany-wariant");
});

test("wariant po terminie waznosci nie dziala i mowi dlaczego", () => {
  const w = wycen("dostepne-dokumenty", "test-wygasly");
  assert.equal(w.kwotaGrosze, 199900);
  assert.equal(w.wariant.powod, "wariant-wygasl");
  assert.equal(w.wariant.wazneDo, "2026-01-01", "kupujacy ma zobaczyc date, nie sam komunikat");
});

test("wariant nie moze podniesc ceny ani jej wyzerowac", () => {
  const w = wycen("dostepne-dokumenty", "test-zadrogi");
  assert.equal(w.kwotaGrosze, 199900);
  assert.equal(w.wariant.zastosowany, false);
});

test("zmyslony wariant nie jest bledem - obowiazuje cena regularna", () => {
  const w = wycen("wcag-dla-specjalistow", "wymyslony-przez-kupujacego");
  assert.equal(w.ok, true);
  assert.equal(w.kwotaGrosze, 249900);
});

test("nieznany produkt jest odrzucany, nie wyceniany", () => {
  assert.equal(wycen("nie-ma-takiego").ok, false);
});

test("katalog nie zawiera produktu w sprzedazy bez ceny albo terminu", () => {
  for (const [klucz, p] of Object.entries(PRODUKTY)) {
    if (p.wSprzedazy === false) continue;
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
    // Domyslnie z akceptacja regulaminu - testy braku akceptacji podaja ja jawnie.
    await start({ method: "POST", body: { zgoda: true, ...cialo }, headers: {} }, res);
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
  assert.match(zadanie.hiddenDescription, /^a11y-dostepne-dokumenty-s0-[0-9a-f-]{36}$/);
  assert.equal(zadanie.callbacks.payerUrls.success, "https://a11yfirst.pl/platnosc-udana");
  assert.ok(!zadanie.callbacks.payerUrls.success.includes("?"), "brak identyfikatora w adresie powrotu");
  assert.equal(zadanie.callbacks.notification.url, "https://a11yfirst.pl/api/tpay-itn");
});

test("bledne dane kupujacego sa odrzucane", async () => {
  const { res } = await wywolajStart({ produkt: "dostepne-dokumenty", imie: "A", email: "zly" });
  assert.equal(res.kod, 400);
});

// --- Tresci cyfrowe: prawo odstapienia ---

test("kurs bez zgody na natychmiastowe swiadczenie nadal da sie kupic", async () => {
  const { res, zadanie } = await wywolajStart({
    produkt: "test-tresc-cyfrowa", imie: "Jan Kowalski", email: "jan@example.com",
    natychmiast: false,
  });
  assert.equal(res.kod, 200, "brak zgody nie moze blokowac sprzedazy");
  assert.match(zadanie.hiddenDescription, /^a11y-test-tresc-cyfrowa-n0-/);
});

test("zgoda na natychmiastowe swiadczenie jest widoczna w identyfikatorze", async () => {
  const { zadanie } = await wywolajStart({
    produkt: "test-tresc-cyfrowa", imie: "Jan Kowalski", email: "jan@example.com",
    natychmiast: true,
  });
  assert.match(zadanie.hiddenDescription, /^a11y-test-tresc-cyfrowa-n1-/);
});

test("szkolenie z terminem nie dostaje znacznika tresci cyfrowych", async () => {
  const { zadanie } = await wywolajStart({
    produkt: "wcag-dla-specjalistow", imie: "Jan Kowalski", email: "jan@example.com",
    natychmiast: true,
  });
  assert.ok(!/-n[01]-/.test(zadanie.hiddenDescription), "znacznik dotyczy tylko tresci cyfrowych");
});

// --- Zakup dla kilku osob ---

test("zakup dla trzech osob liczy iloczyn, bez rabatu ilosciowego", async () => {
  const { res, zadanie } = await wywolajStart({
    produkt: "test-tresc-cyfrowa", imie: "Firma Sp. z o.o.", email: "biuro@firma.pl",
    liczbaOsob: 3,
    uczestnicy: [
      { imie: "Anna Nowak", email: "anna@firma.pl" },
      { imie: "Jan Kowalski", email: "jan@firma.pl" },
      { imie: "Ewa Wisniewska", email: "ewa@firma.pl" },
    ],
  });
  assert.equal(res.kod, 200);
  assert.equal(zadanie.amount, 2997);
});

test("liczba osob bez kompletnej listy uczestnikow jest odrzucana", async () => {
  const { res } = await wywolajStart({
    produkt: "test-tresc-cyfrowa", imie: "Firma", email: "biuro@firma.pl",
    liczbaOsob: 3,
    uczestnicy: [{ imie: "Anna Nowak", email: "anna@firma.pl" }],
  });
  assert.equal(res.kod, 400);
});

test("uczestnik z blednym adresem blokuje zamowienie", async () => {
  const { res } = await wywolajStart({
    produkt: "test-tresc-cyfrowa", imie: "Firma", email: "biuro@firma.pl",
    liczbaOsob: 2,
    uczestnicy: [
      { imie: "Anna Nowak", email: "anna@firma.pl" },
      { imie: "Jan Kowalski", email: "to-nie-jest-email" },
    ],
  });
  assert.equal(res.kod, 400);
});

// --- Regulamin z 28.09.2026: § 7 ust. 7, § 9, § 11 ---

test("bez akceptacji regulaminu serwer nie tworzy transakcji", async () => {
  for (const zgoda of [undefined, false, "on", 1]) {
    const { res, zadanie } = await wywolajStart({
      produkt: "dostepne-dokumenty", imie: "Anna Nowak", email: "anna@example.com", zgoda,
    });
    assert.equal(res.kod, 400, `zgoda=${zgoda} nie moze wystarczyc`);
    assert.equal(res.tresc.blad, "brak-akceptacji-regulaminu");
    assert.equal(zadanie, undefined, "do Tpay nic nie moze pojsc");
  }
});

test("kurs Semantyczny HTML nie jest w sprzedazy, dopoki nie ma ceny", async () => {
  assert.equal(wycen("semantyczny-html").ok, false);
  assert.equal(wycen("semantyczny-html").powod, "produkt-niedostepny");
  const { res, zadanie } = await wywolajStart({
    produkt: "semantyczny-html", imie: "Jan Kowalski", email: "jan@example.com",
  });
  assert.equal(res.kod, 400);
  assert.equal(zadanie, undefined);
});

test("szkolenie: zadanie rozpoczecia uslugi trafia do identyfikatora, kursu w pakiecie nie ma", async () => {
  const przypadki = [
    [{ rozpoczecie: true }, "s1"],
    [{ rozpoczecie: true, kurs: true }, "s1"],
    [{ rozpoczecie: false, kurs: true }, "s0"],
    [{}, "s0"],
  ];
  for (const [oswiadczenia, znacznik] of przypadki) {
    const { res, zadanie } = await wywolajStart({
      produkt: "ai-dla-audytora", imie: "Jan Kowalski", email: "jan@example.com", ...oswiadczenia,
    });
    assert.equal(res.kod, 200, "oswiadczenia sa dobrowolne i nie blokuja zakupu");
    assert.match(zadanie.hiddenDescription, new RegExp(`^a11y-ai-dla-audytora-${znacznik}-[0-9a-f]{8}-`));
  }
});

test("tresc cyfrowa nie dostaje znacznikow szkolenia", async () => {
  const { zadanie } = await wywolajStart({
    produkt: "test-tresc-cyfrowa", imie: "Jan Kowalski", email: "jan@example.com",
    rozpoczecie: true, kurs: true,
  });
  assert.ok(!/-s[01]/.test(zadanie.hiddenDescription));
});

test("nazwa szkolenia AI zgodna ze strona", () => {
  assert.equal(PRODUKTY["ai-dla-audytora"].nazwa, "AI w audytowaniu dostępności cyfrowej");
});

// --- Formularz /zapis: art. 17 ustawy o prawach konsumenta ---

const { readFileSync } = await import("node:fs");
const formularz = readFileSync(new URL("../public/zapis.html", import.meta.url), "utf8");

test("przycisk zamowienia informuje o obowiazku zaplaty", () => {
  const przyciski = [...formularz.matchAll(/<button[^>]*type="submit"[^>]*>([\s\S]*?)<\/button>/g)];
  assert.equal(przyciski.length, 1);
  assert.equal(przyciski[0][1].trim(), "Zamawiam z obowiązkiem zapłaty");
  assert.ok(!formularz.includes("Przejdź do płatności"));
});

test("oswiadczenia o wczesniejszym rozpoczeciu nie sa wymagane ani zaznaczone", () => {
  assert.ok(!formularz.includes('id="kurs"'), "kurs nie jest w pakiecie szkolen (decyzja z 29.09)");
  assert.ok(!formularz.includes("W cenie każdego szkolenia"));
  for (const id of ["rozpoczecie", "natychmiast"]) {
    const pole = formularz.match(new RegExp(`<input[^>]*id="${id}"[^>]*>`));
    assert.ok(pole, `brak pola ${id}`);
    assert.ok(!/\brequired\b/.test(pole[0]), `${id} nie moze byc wymagane`);
    assert.ok(!/\bchecked\b/.test(pole[0]), `${id} nie moze byc zaznaczone domyslnie`);
  }
  assert.match(formularz, /<input[^>]*id="zgoda"[^>]*required/);
});

test("informacja o metodach platnosci jest przed przyciskiem, a kurs bez ceny nie jest w ofercie", () => {
  assert.ok(formularz.indexOf("Jak przebiega płatność") < formularz.indexOf("Zamawiam z obowiązkiem zapłaty"));
  assert.ok(!formularz.includes('value="semantyczny-html"'));
  assert.ok(!/[\u2013\u2014]/.test(formularz), "bez polpauz i pauz w tekscie dla klienta");
});

// --- Potwierdzenie zawarcia umowy po platnosci (§ 7 ust. 9) ---

const { rozlozIdentyfikator, zbudujPotwierdzenie } = await import("../api/_potwierdzenie.mjs");
const { zbudujWiadomosc, wyslijMail } = await import("../api/_poczta.mjs");
const { wyslijPotwierdzenie } = await import("../api/tpay-itn.mjs");

const UUID = "123e4567-e89b-42d3-a456-426614174000";

test("identyfikator zamowienia rozklada sie na produkt i oswiadczenia", () => {
  const s = rozlozIdentyfikator(`a11y-wcag-dla-specjalistow-s1k0-${UUID}`);
  assert.equal(s.kluczProduktu, "wcag-dla-specjalistow");
  assert.equal(s.rozpoczecie, true);
  assert.equal(s.kurs, false);
  assert.equal(s.natychmiast, null);
  const c = rozlozIdentyfikator(`a11y-test-tresc-cyfrowa-n1-${UUID}`);
  assert.equal(c.natychmiast, true);
  const stary = rozlozIdentyfikator(`a11y-dostepne-dokumenty-${UUID}`);
  assert.equal(stary.kluczProduktu, "dostepne-dokumenty");
  assert.equal(stary.rozpoczecie, null);
  assert.equal(rozlozIdentyfikator(`a11y-nieistniejacy-${UUID}`), null);
  assert.equal(rozlozIdentyfikator("cokolwiek"), null);
});

test("potwierdzenie szkolenia zawiera wymagane elementy i powtarza oswiadczenia", () => {
  const z = rozlozIdentyfikator(`a11y-wcag-dla-specjalistow-s1-${UUID}`);
  const { temat, tekst, html, plikPdf, plikFormularza } = zbudujPotwierdzenie(z, {
    kwota: "1999.00", trId: "TR-TEST", czas: new Date("2026-10-01T12:05:00Z"),
  });
  assert.equal(plikFormularza, "formularz-odstapienia-od-umowy.pdf");
  assert.equal(temat, "Potwierdzenie zawarcia umowy: WCAG dla specjalistów, 28-30.10.2026");
  assert.equal(plikPdf, "regulamin-2026-09-29.pdf");
  for (const fragment of [
    "1999,00 zł", "01.10.2026, godz. 14:05", "TR-TEST", "art. 113",
    "zażądałeś(-aś) rozpoczęcia świadczenia usługi przed upływem 14 dni",
    "formularz-odstapienia-od-umowy.pdf", "regulamin-2026-09-29.pdf",
    "Krajowym Systemie e-Faktur",
  ]) assert.ok(tekst.includes(fragment), `brak: ${fragment}`);
  assert.ok(!/[\u2013\u2014]/.test(tekst + temat), "bez polpauz i pauz w tresci dla klienta");
  assert.ok(!tekst.includes("Semantyczny HTML"), "szkolenie nie obejmuje kursu");
  assert.ok(!tekst.includes("Ja/My niniejszym"), "wzor formularza jest w zalaczniku, nie w tresci");
  assert.ok(!html.includes("Ja/My niniejszym"));
  assert.ok(html.includes("TR-TEST") && html.includes("1999,00 zł"), "HTML ma te same dane co tekst");
});

test("HTML potwierdzenia jest dostepny: jezyk, h1, naglowki h2, listy, landmarki", () => {
  const z = rozlozIdentyfikator(`a11y-wcag-dla-specjalistow-s0-${UUID}`);
  const { html } = zbudujPotwierdzenie(z, { kwota: "2499.00", trId: "T", czas: new Date("2026-10-20T10:00:00Z"),
    linkZgody: "https://www.a11yfirst.pl/zgoda-rozpoczecie#t=abc" });
  assert.match(html, /<html lang="pl">/);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, "dokladnie jeden h1");
  assert.ok((html.match(/<h2[ >]/g) || []).length >= 5, "sekcje jako prawdziwe naglowki h2");
  assert.match(html, /<ul[ >][\s\S]*<li[ >]/, "dane zamowienia jako lista");
  assert.match(html, /<main[ >]/);
  assert.match(html, /<footer[ >]/);
  assert.ok(html.includes('href="https://www.a11yfirst.pl/zgoda-rozpoczecie#t=abc"'), "link zgody jako link");
  assert.ok(!/<h[3-6][ >]/.test(html), "bez przeskokow poziomow");
  assert.ok(!/<img/.test(html), "bez obrazow");
  const tekstBezZnacznikow = html.replace(/<a [^>]*>[^<]*<\/a>/g, "").replace(/<[^>]+>/g, " ");
  assert.ok(!/a11y@wlaczwizje\.pl/.test(tekstBezZnacznikow), "kazdy adres e-mail jest linkiem");
  assert.ok(!/https:\/\/www\.a11yfirst\.pl\/regulamin-/.test(tekstBezZnacznikow), "adres PDF regulaminu jest linkiem");
  for (const a of html.match(/<a [^>]*>/g)) {
    if (a.includes("background-color")) continue; // przycisk zgody
    assert.match(a, /color:#5f28b4;text-decoration:underline;font-weight:bold;/, `link w identyfikacji: ${a}`);
  }
  assert.ok(html.includes('<a href="mailto:a11y@wlaczwizje.pl"'), "mailto");
  assert.ok(html.includes('href="https://www.a11yfirst.pl/regulamin-2026-09-29.pdf"'), "kropka po adresie poza linkiem");
  assert.ok(!/[\u2013\u2014]/.test(html), "bez polpauz i pauz");
});

test("bez zadania rozpoczecia, przy szkoleniu za mniej niz 14 dni, mail daje link zamiast formulki", () => {
  const z = rozlozIdentyfikator(`a11y-wcag-dla-specjalistow-s0-${UUID}`);
  const blisko = zbudujPotwierdzenie(z, { kwota: "2499.00", trId: "T", czas: new Date("2026-10-20T10:00:00Z") }).tekst;
  assert.ok(blisko.includes("Jeśli kupujesz jako osoba prywatna, odpisz"), "bez linku: zwykla odpowiedz");
  assert.ok(!blisko.includes("zdaniem"), "nie wymagamy konkretnej formulki");
  const zLinkiem = zbudujPotwierdzenie(z, { kwota: "2499.00", trId: "T", czas: new Date("2026-10-20T10:00:00Z"),
    linkZgody: "https://www.a11yfirst.pl/zgoda-rozpoczecie#t=abc" }).tekst;
  assert.ok(zLinkiem.includes("Jeśli kupujesz jako osoba prywatna, potwierdź jednym kliknięciem"));
  assert.ok(zLinkiem.includes("Chcę wziąć udział w szkoleniu: https://www.a11yfirst.pl/zgoda-rozpoczecie#t=abc"));
  assert.ok(!zLinkiem.includes("nie możemy dopuścić"), "wersja lagodna");
  const daleko = zbudujPotwierdzenie(z, { kwota: "2499.00", trId: "T", czas: new Date("2026-10-01T10:00:00Z") }).tekst;
  assert.ok(!daleko.includes("Jeśli kupujesz jako osoba prywatna"));
});

test("wiadomosc MIME: PDF w zalaczniku, UDW poza naglowkami, polskie znaki w temacie", () => {
  const m = zbudujWiadomosc({
    od: "a11y@wlaczwizje.pl", nazwaNadawcy: "Accessibility First", do: "jan@example.com",
    temat: "Potwierdzenie zawarcia umowy: Dostępne dokumenty", tekst: "Dzień dobry",
    zalaczniki: [{ nazwa: "regulamin.pdf", typ: "application/pdf", dane: Buffer.from("%PDF-1.7 test") }],
  });
  assert.match(m, /^Subject: =\?UTF-8\?B\?/m);
  assert.match(m, /Content-Disposition: attachment; filename="regulamin.pdf"/);
  assert.ok(m.includes(Buffer.from("%PDF-1.7 test").toString("base64")));
  assert.ok(!/^Bcc:/mi.test(m));
  assert.ok(!/multipart\/alternative/.test(m), "bez HTML: sam tekst");
});

test("wiadomosc MIME z HTML: tekst i HTML jako alternatywy, oba zalaczniki osobno", () => {
  const m = zbudujWiadomosc({
    od: "a11y@wlaczwizje.pl", do: "jan@example.com", temat: "t", tekst: "Dzień dobry",
    html: "<!doctype html><html lang=\"pl\"><body><h1>Dzień dobry</h1></body></html>",
    zalaczniki: [
      { nazwa: "regulamin.pdf", typ: "application/pdf", dane: Buffer.from("%PDF-1") },
      { nazwa: "formularz.pdf", typ: "application/pdf", dane: Buffer.from("%PDF-2") },
    ],
  });
  const zewn = /^Content-Type: multipart\/mixed; boundary="([^"]+)"/m.exec(m)[1];
  const alt = /Content-Type: multipart\/alternative; boundary="([^"]+)"/.exec(m)[1];
  assert.notEqual(zewn, alt);
  const czescAlt = m.slice(m.indexOf(`--${alt}`), m.indexOf(`--${alt}--`));
  assert.ok(czescAlt.indexOf("text/plain") < czescAlt.indexOf("text/html"), "tekst przed HTML");
  assert.ok(m.replace(/\r\n/g, "").includes(Buffer.from("<!doctype html><html lang=\"pl\"><body><h1>Dzień dobry</h1></body></html>").toString("base64")));
  assert.ok(m.indexOf(`--${alt}--`) < m.indexOf('filename="regulamin.pdf"'), "zalaczniki poza alternative");
  assert.match(m, /filename="formularz.pdf"/);
  assert.ok(m.trimEnd().endsWith(`--${zewn}--`));
});

test("adres z wstrzyknietym naglowkiem jest odrzucany przed polaczeniem", async () => {
  const env = { SMTP_UZYTKOWNIK: "a11y@wlaczwizje.pl", SMTP_HASLO: "x" };
  await assert.rejects(
    wyslijMail({ do: "jan@example.com\r\nBcc: ktos@zly.pl", temat: "t", tekst: "t" }, env),
    /niepoprawny adres/,
  );
});

const polaZaplacone = {
  tr_id: "TR-TEST", tr_crc: `a11y-ai-dla-audytora-s0-${UUID}`, tr_status: "true",
  tr_amount: "1599.00", tr_paid: "1599.00", tr_currency: "PLN", tr_email: "jan@example.com",
};

test("po platnosci klient dostaje potwierdzenie z PDF, a a11y@ kopie UDW", async () => {
  const wyslane = [];
  const wynik = await wyslijPotwierdzenie(polaZaplacone, {
    wyslijMail: async (m) => { wyslane.push(m); },
    wczytajRegulaminPdf: async () => Buffer.from("%PDF-1.7"),
    wczytajFormularzPdf: async () => Buffer.from("%PDF-1.7 formularz"),
  });
  assert.equal(wynik.wyslano, true);
  assert.equal(wyslane.length, 1);
  assert.equal(wyslane[0].do, "jan@example.com");
  assert.deepEqual(wyslane[0].udw, ["a11y@wlaczwizje.pl"]);
  assert.deepEqual(wyslane[0].zalaczniki.map((z) => z.nazwa),
    ["regulamin-2026-09-29.pdf", "formularz-odstapienia-od-umowy.pdf"]);
  assert.ok(wyslane[0].zalaczniki.every((z) => z.typ === "application/pdf"));
  assert.ok(wyslane[0].tekst.includes("AI w audytowaniu dostępności cyfrowej"));
  assert.match(wyslane[0].html, /<h2[ >]/, "klient dostaje tez wersje HTML");
});

test("bez PDF formularza odstapienia potwierdzenie nie wychodzi, idzie alarm do a11y@", async () => {
  const wyslane = [];
  const wynik = await wyslijPotwierdzenie(polaZaplacone, {
    wyslijMail: async (m) => { wyslane.push(m); },
    wczytajRegulaminPdf: async () => Buffer.from("%PDF-1.7"),
    wczytajFormularzPdf: async () => { throw new Error("nie znaleziono PDF /formularz-odstapienia-od-umowy.pdf"); },
  });
  assert.equal(wynik.wyslano, false);
  assert.equal(wyslane.length, 1);
  assert.equal(wyslane[0].do, "a11y@wlaczwizje.pl");
  assert.match(wyslane[0].tekst, /formularz-odstapienia/);
});

test("PDF formularza odstapienia lezy w public/, jest w paczce funkcji ITN i ma te sama tresc co regulamin", async () => {
  const fs = await import("node:fs/promises");
  const pdf = await fs.readFile(new URL("../public/formularz-odstapienia-od-umowy.pdf", import.meta.url));
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  const vercel = JSON.parse(await fs.readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.equal(vercel.functions["api/tpay-itn.mjs"].includeFiles, "public/*.pdf");
  const strona = await fs.readFile(new URL("../public/formularz-odstapienia-od-umowy.html", import.meta.url), "utf8");
  const regulamin = await fs.readFile(new URL("../public/regulamin.html", import.meta.url), "utf8");
  const pola = (h) => [...h.matchAll(/<strong>([^<]+):<\/strong>/g)].map((x) => x[1]);
  const zalacznik = regulamin.slice(regulamin.indexOf('id="zalacznik"'));
  assert.deepEqual(pola(strona), pola(zalacznik), "pola formularza zgodne z zalacznikiem regulaminu");
  assert.match(strona, /<html lang="pl">/);
});

test("bez PDF regulaminu klient nie dostaje niepelnego potwierdzenia, idzie alarm do a11y@", async () => {
  const wyslane = [];
  const wynik = await wyslijPotwierdzenie(polaZaplacone, {
    wyslijMail: async (m) => { wyslane.push(m); },
    wczytajRegulaminPdf: async () => { throw new Error("brak PDF"); },
  });
  assert.equal(wynik.wyslano, false);
  assert.equal(wyslane.length, 1);
  assert.equal(wyslane[0].do, "a11y@wlaczwizje.pl");
  assert.match(wyslane[0].temat, /NIE wysłane/);
});

test("sekret obejscia ochrony podgladu trafia do adresu ITN tylko w sandboxie", async () => {
  const { adresPowiadomien } = await import("../api/platnosc-start.mjs");
  const baza = "https://podglad.vercel.app";
  const sekret = "abc123";
  assert.equal(adresPowiadomien(baza, { TPAY_SANDBOX: "1", VERCEL_AUTOMATION_BYPASS_SECRET: sekret }),
    "https://podglad.vercel.app/api/tpay-itn?x-vercel-protection-bypass=abc123");
  assert.equal(adresPowiadomien(baza, { VERCEL_AUTOMATION_BYPASS_SECRET: sekret }),
    "https://podglad.vercel.app/api/tpay-itn", "produkcja bez sekretu w adresie");
  assert.equal(adresPowiadomien(baza, { TPAY_SANDBOX: "1" }), "https://podglad.vercel.app/api/tpay-itn");
});

// --- Pozniejsze zadanie rozpoczecia uslugi z linku (decyzja Damiana 29.09) ---

const { podpiszZgode, sprawdzZgode } = await import("../api/_zgoda.mjs");
const { default: zgodaHandler } = await import("../api/zgoda-rozpoczecie.mjs");
const ENV_ZGODY = { TPAY_CLIENT_SECRET: "sekret-testowy" };

test("token zgody: podpis, podmiana i wygasniecie", () => {
  const t = podpiszZgode({ zamowienie: `a11y-wcag-dla-specjalistow-s0-${UUID}`, email: "jan@example.com", wazneDo: "2026-10-28" }, ENV_ZGODY);
  const z = sprawdzZgode(t, ENV_ZGODY, new Date("2026-10-20T10:00:00Z"));
  assert.equal(z.email, "jan@example.com");
  const [dane, podpis] = t.split(".");
  const obce = Buffer.from(JSON.stringify({ z: `a11y-wcag-dla-specjalistow-s0-${UUID}`, e: "zly@example.com", d: "2026-10-28" })).toString("base64url");
  assert.throws(() => sprawdzZgode(`${obce}.${podpis}`, ENV_ZGODY), /zly-token/, "podmiana adresu");
  assert.throws(() => sprawdzZgode(t, { TPAY_CLIENT_SECRET: "inny" }), /zly-token/, "inny klucz");
  assert.throws(() => sprawdzZgode(t, ENV_ZGODY, new Date("2026-10-30T10:00:00Z")), /link-wygasl/);
  assert.throws(() => sprawdzZgode(dane, ENV_ZGODY), /zly-token/);
});

test("klikniecie linku wysyla potwierdzenie zadania na trwalym nosniku", async () => {
  const stary = process.env.TPAY_CLIENT_SECRET;
  process.env.TPAY_CLIENT_SECRET = ENV_ZGODY.TPAY_CLIENT_SECRET;
  try {
    const token = podpiszZgode({ zamowienie: `a11y-wcag-dla-specjalistow-s0-${UUID}`, email: "jan@example.com", wazneDo: "2099-01-01" });
    const wyslane = [];
    const res = atrapaOdpowiedzi();
    await zgodaHandler({ method: "POST", body: { token } }, res, { wyslijMail: async (m) => { wyslane.push(m); } });
    assert.equal(res.kod, 200);
    assert.equal(wyslane[0].do, "jan@example.com");
    assert.deepEqual(wyslane[0].udw, ["a11y@wlaczwizje.pl"]);
    assert.match(wyslane[0].tekst, /zażądałeś\(-aś\) rozpoczęcia świadczenia usługi „WCAG dla specjalistów”/);
    assert.ok(!/[\u2013\u2014]/.test(wyslane[0].tekst + wyslane[0].temat));

    const zly = atrapaOdpowiedzi();
    await zgodaHandler({ method: "POST", body: { token: token.slice(0, -2) + "xx" } }, zly, { wyslijMail: async () => { throw new Error("nie powinno"); } });
    assert.equal(zly.kod, 400);

    const cyfrowy = podpiszZgode({ zamowienie: `a11y-test-tresc-cyfrowa-n0-${UUID}`, email: "jan@example.com", wazneDo: "2099-01-01" });
    const c = atrapaOdpowiedzi();
    await zgodaHandler({ method: "POST", body: { token: cyfrowy } }, c, { wyslijMail: async () => {} });
    assert.equal(c.kod, 400, "link dotyczy tylko szkolen");
  } finally {
    process.env.TPAY_CLIENT_SECRET = stary;
  }
});

test("strona zgody: pole niezaznaczone, noindex, bez pauz", () => {
  const strona = readFileSync(new URL("../public/zgoda-rozpoczecie.html", import.meta.url), "utf8");
  const pole = strona.match(/<input[^>]*id="rozpoczecie"[^>]*>/)[0];
  assert.ok(!/\bchecked\b/.test(pole));
  assert.match(strona, /noindex/);
  assert.ok(!/[\u2013\u2014]/.test(strona));
});

test("formularz ostrzega o szkoleniu za mniej niz 14 dni", () => {
  assert.match(formularz, /data-start="2026-10-28"/);
  assert.match(formularz, /<p id="rozpoczecieUwaga"[^>]*hidden/);
});

test("bramka rozmawia z Open API Tpay, nie z domena certyfikatow", async () => {
  const zrodlo = readFileSync(new URL("../api/platnosc-start.mjs", import.meta.url), "utf8");
  assert.match(zrodlo, /BAZA_PRODUKCJA = "https:\/\/api\.tpay\.com"/);
  assert.match(zrodlo, /BAZA_SANDBOX = "https:\/\/openapi\.sandbox\.tpay\.com"/);
});

test("ITN: status TRUE wielkimi literami (jak wysyla Tpay) to zaplata, inne nie", async () => {
  const { ocenPlatnosc } = await import("../api/tpay-itn.mjs");
  const baza = { tr_amount: "1999.00", tr_paid: "1999.00", tr_currency: "PLN" };
  assert.equal(ocenPlatnosc({ ...baza, tr_status: "TRUE" }).zaplacone, true);
  assert.equal(ocenPlatnosc({ ...baza, tr_status: "true" }).zaplacone, true);
  assert.equal(ocenPlatnosc({ ...baza, tr_status: "PAID" }).zaplacone, true);
  assert.equal(ocenPlatnosc({ ...baza, tr_status: "FALSE" }).zaplacone, false);
  assert.equal(ocenPlatnosc({ ...baza, tr_status: "CHARGEBACK" }).zaplacone, false);
  assert.equal(ocenPlatnosc({ ...baza, tr_status: "TRUE", tr_paid: "1998.99" }).zaplacone, false, "niedoplata");
  assert.equal(ocenPlatnosc({ ...baza, tr_status: "TRUE", tr_currency: "EUR" }).zaplacone, false);
  assert.equal(ocenPlatnosc({ ...baza, tr_status: "TRUE" }, { zgodna: false }).zaplacone, false, "zla suma md5");
});
