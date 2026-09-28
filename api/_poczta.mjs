/**
 * Wysylka maili przez SMTP Google Workspace (smtp.gmail.com:465, TLS od
 * pierwszego bajtu), bez zewnetrznych bibliotek.
 *
 * Dlaczego bez nodemailera: strona jest publikowana jako katalog public/ bez
 * kroku instalacji (vercel.json: installCommand "Skip install"), a glowny
 * package.json nalezy do innego projektu. Zaleznosc npm oznaczalaby zmiane
 * sposobu wdrazania calej strony. Potrzebujemy jednej rzeczy: wyslac jeden
 * mail tekstowy z jednym zalacznikiem PDF - to kilkadziesiat linii.
 *
 * Konfiguracja wylacznie w zmiennych srodowiskowych Vercela:
 *   SMTP_UZYTKOWNIK  konto Google, ktore wysyla (np. a11y@wlaczwizje.pl)
 *   SMTP_HASLO       haslo aplikacji Google (16 znakow), nigdy w repo ani w logach
 *   POCZTA_NADAWCA   adres w polu Od (domyslnie SMTP_UZYTKOWNIK)
 *   POCZTA_KOPIA     adres kopii UDW i alarmow (domyslnie a11y@wlaczwizje.pl)
 */

import tls from "node:tls";
import crypto from "node:crypto";

const HOST = "smtp.gmail.com";
const PORT = 465;
const LIMIT_MS = 15000;

export function konfiguracjaPoczty(env = process.env) {
  const uzytkownik = env.SMTP_UZYTKOWNIK || "";
  const haslo = env.SMTP_HASLO || "";
  return {
    gotowa: Boolean(uzytkownik && haslo),
    uzytkownik,
    haslo,
    nadawca: env.POCZTA_NADAWCA || uzytkownik,
    kopia: env.POCZTA_KOPIA || "a11y@wlaczwizje.pl",
  };
}

/** Naglowek z polskimi znakami: RFC 2047, kodowanie base64. */
function naglowekUtf8(tekst) {
  return /^[\x20-\x7e]*$/.test(tekst)
    ? tekst
    : `=?UTF-8?B?${Buffer.from(tekst, "utf8").toString("base64")}?=`;
}

function base64WLiniach(bufor) {
  return bufor.toString("base64").replace(/.{1,76}/g, "$&\r\n");
}

/** Adres bez znakow, ktore moglyby wstrzyknac naglowek albo komende SMTP. */
function czystyAdres(adres) {
  const a = String(adres || "").trim();
  if (!/^[^\s@<>,;"\r\n]+@[^\s@<>,;"\r\n]+\.[^\s@<>,;"\r\n]{2,}$/.test(a)) {
    throw new Error("niepoprawny adres e-mail");
  }
  return a;
}

/**
 * Buduje wiadomosc MIME: tekst (UTF-8) i opcjonalne zalaczniki.
 * Pole UDW nie trafia do naglowkow - tylko do koperty SMTP.
 */
export function zbudujWiadomosc({ od, nazwaNadawcy, do: odbiorca, odpowiedzDo, temat, tekst, zalaczniki = [] }) {
  const granica = `a11y-${crypto.randomUUID()}`;
  const domena = od.split("@")[1];
  const naglowki = [
    `From: ${naglowekUtf8(nazwaNadawcy || od)} <${od}>`,
    `To: <${odbiorca}>`,
    ...(odpowiedzDo ? [`Reply-To: <${odpowiedzDo}>`] : []),
    `Subject: ${naglowekUtf8(temat)}`,
    `Date: ${new Date().toUTCString().replace("GMT", "+0000")}`,
    `Message-ID: <${crypto.randomUUID()}@${domena}>`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${granica}"`,
  ];
  const czesci = [
    [
      `--${granica}`,
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: base64",
      "",
      base64WLiniach(Buffer.from(tekst.replace(/\r?\n/g, "\r\n"), "utf8")),
    ].join("\r\n"),
    ...zalaczniki.map((z) => [
      `--${granica}`,
      `Content-Type: ${z.typ}; name="${z.nazwa}"`,
      `Content-Disposition: attachment; filename="${z.nazwa}"`,
      "Content-Transfer-Encoding: base64",
      "",
      base64WLiniach(z.dane),
    ].join("\r\n")),
  ];
  return `${naglowki.join("\r\n")}\r\n\r\n${czesci.join("\r\n")}\r\n--${granica}--\r\n`;
}

/** Minimalny klient SMTP: EHLO, AUTH PLAIN, MAIL, RCPT, DATA, QUIT. */
function rozmowaSmtp({ uzytkownik, haslo, od, odbiorcy, wiadomosc }) {
  return new Promise((resolve, reject) => {
    const gniazdo = tls.connect({ host: HOST, port: PORT, servername: HOST });
    const zegar = setTimeout(() => zakoncz(new Error("SMTP: przekroczony czas")), LIMIT_MS);
    let bufor = "";
    let czekajacy = null;

    function zakoncz(blad) {
      clearTimeout(zegar);
      gniazdo.destroy();
      if (blad) reject(blad); else resolve();
    }

    gniazdo.setEncoding("utf8");
    gniazdo.on("error", (b) => zakoncz(b));
    gniazdo.on("data", (kawalek) => {
      bufor += kawalek;
      // Odpowiedz wielolinijkowa konczy sie linia "NNN tekst" (spacja po kodzie).
      const linie = bufor.split("\r\n");
      const ostatnia = linie.slice(0, -1).reverse().find((l) => /^\d{3}[ -]/.test(l));
      if (ostatnia && /^\d{3} /.test(ostatnia) && czekajacy) {
        const kod = Number(ostatnia.slice(0, 3));
        bufor = "";
        const k = czekajacy;
        czekajacy = null;
        k(kod, ostatnia);
      }
    });

    const odpowiedz = () => new Promise((r) => { czekajacy = (kod, linia) => r({ kod, linia }); });

    async function krok(komenda, oczekiwany, opis) {
      const czekaj = odpowiedz();
      if (komenda !== null) gniazdo.write(`${komenda}\r\n`);
      const { kod, linia } = await czekaj;
      // Tresc odpowiedzi serwera logujemy bez komendy - komenda AUTH zawiera haslo.
      if (kod !== oczekiwany) throw new Error(`SMTP ${opis}: ${linia}`);
    }

    (async () => {
      await krok(null, 220, "powitanie");
      await krok("EHLO a11yfirst.pl", 250, "EHLO");
      const plain = Buffer.from(`\u0000${uzytkownik}\u0000${haslo}`, "utf8").toString("base64");
      await krok(`AUTH PLAIN ${plain}`, 235, "logowanie");
      await krok(`MAIL FROM:<${od}>`, 250, "nadawca");
      for (const o of odbiorcy) await krok(`RCPT TO:<${o}>`, 250, "odbiorca");
      await krok("DATA", 354, "DATA");
      // Kropka na poczatku linii konczylaby wiadomosc - podwajamy ja (RFC 5321).
      const tresc = wiadomosc.replace(/\r\n\./g, "\r\n..");
      await krok(`${tresc}\r\n.`, 250, "wysylka");
      gniazdo.write("QUIT\r\n");
      zakoncz();
    })().catch(zakoncz);
  });
}

/**
 * Wysyla mail. Zwraca {wyslano: true} albo rzuca blad bez danych logowania.
 * `udw` - lista adresow kopii ukrytej (tylko koperta, nie naglowki).
 */
export async function wyslijMail({ do: odbiorca, udw = [], temat, tekst, zalaczniki = [] }, env = process.env) {
  const k = konfiguracjaPoczty(env);
  if (!k.gotowa) throw new Error("brak konfiguracji SMTP (SMTP_UZYTKOWNIK, SMTP_HASLO)");
  const od = czystyAdres(k.nadawca);
  const cel = czystyAdres(odbiorca);
  const kopie = [...new Set(udw.filter(Boolean).map(czystyAdres))].filter((a) => a !== cel);
  const wiadomosc = zbudujWiadomosc({
    od,
    nazwaNadawcy: "Accessibility First, Włącz Wizję",
    do: cel,
    odpowiedzDo: k.kopia,
    temat,
    tekst,
    zalaczniki,
  });
  await rozmowaSmtp({ uzytkownik: k.uzytkownik, haslo: k.haslo, od, odbiorcy: [cel, ...kopie], wiadomosc });
  return { wyslano: true };
}
