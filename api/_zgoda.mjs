/**
 * Podpisany link do pozniejszego zadania rozpoczecia uslugi (§ 11 ust. 6
 * regulaminu), dla kupujacego, ktory przy zamowieniu nie zaznaczyl pola,
 * a szkolenie zaczyna sie wczesniej niz 14 dni od zawarcia umowy.
 *
 * Link trafia wylacznie do maila z potwierdzeniem. Token jest w czesci po "#",
 * ktorej przegladarka nie wysyla do serwera ani w naglowku Referer, wiec adres
 * e-mail z tokenu nie laduje w logach zadan. Strona wysyla token w tresci POST.
 *
 * Podpis HMAC-SHA256 kluczem wyprowadzonym z TPAY_CLIENT_SECRET: bez nowej
 * zmiennej srodowiskowej, a bez sekretu nie da sie podrobic tokenu dla cudzego
 * zamowienia. Zmiana sekretu Tpay uniewaznia wyslane linki - to akceptowalne,
 * bo klient zawsze moze napisac na a11y@.
 */

import crypto from "node:crypto";

function klucz(env) {
  const sekret = env.TPAY_CLIENT_SECRET;
  if (!sekret) throw new Error("brak TPAY_CLIENT_SECRET");
  return crypto.createHmac("sha256", sekret).update("a11y-zgoda-rozpoczecie-v1").digest();
}

const b64 = (tekst) => Buffer.from(tekst, "utf8").toString("base64url");

/** Token: base64url(JSON {z: tr_crc, e: email, d: wazny do RRRR-MM-DD}).podpis */
export function podpiszZgode({ zamowienie, email, wazneDo }, env = process.env) {
  const dane = b64(JSON.stringify({ z: zamowienie, e: email, d: wazneDo }));
  const podpis = crypto.createHmac("sha256", klucz(env)).update(dane).digest("base64url");
  return `${dane}.${podpis}`;
}

/** Zwraca {zamowienie, email, wazneDo} albo rzuca blad. */
export function sprawdzZgode(token, env = process.env, teraz = new Date()) {
  const [dane, podpis] = String(token || "").split(".");
  if (!dane || !podpis) throw new Error("zly-token");
  const oczekiwany = crypto.createHmac("sha256", klucz(env)).update(dane).digest();
  const podany = Buffer.from(podpis, "base64url");
  if (podany.length !== oczekiwany.length || !crypto.timingSafeEqual(podany, oczekiwany)) {
    throw new Error("zly-token");
  }
  const { z, e, d } = JSON.parse(Buffer.from(dane, "base64url").toString("utf8"));
  // Link dziala do konca dnia rozpoczecia szkolenia (czas warszawski).
  if (d && teraz.getTime() > new Date(`${d}T23:59:59+01:00`).getTime()) throw new Error("link-wygasl");
  return { zamowienie: z, email: e, wazneDo: d };
}
