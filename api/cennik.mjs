/**
 * Publiczny odczyt ceny: co kosztuje dany produkt, z uwzglednieniem wariantu.
 *
 * Istnieje po to, zeby kupujacy zobaczyl cene ZANIM zaplaci - w szczegolnosci
 * zeby dowiedzial sie, ze promocja z linku juz wygasla, zamiast odkryc to
 * dopiero na bramce.
 *
 * Punkt jest bezstanowy i nie zwraca zadnych danych osobowych ani zamowien -
 * tylko to, co i tak jest napisane na stronie. Nie przyjmuje ceny i niczego
 * nie zapisuje, wiec nie tworzy powierzchni do podmiany kwoty: platnosc i tak
 * liczy sie osobno w api/platnosc-start.mjs, na podstawie tego samego katalogu.
 */

import { wycen, naZlote, MAKS_OSOB } from "./_katalog.mjs";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ blad: "tylko-GET" });
    return;
  }

  const { produkt, wariant, osoby } = req.query || {};
  const wycena = wycen(produkt, wariant, osoby === undefined ? 1 : osoby);
  if (!wycena.ok) {
    res.status(400).json({ blad: wycena.powod });
    return;
  }

  res.status(200).json({
    produkt: wycena.produkt.nazwa,
    termin: wycena.produkt.termin,
    liczbaOsob: wycena.liczbaOsob,
    cenaJednostkowa: naZlote(wycena.cenaJednostkowaGrosze),
    kwota: naZlote(wycena.kwotaGrosze),
    maksOsob: MAKS_OSOB,
    wariant: wycena.wariant,
  });
}
