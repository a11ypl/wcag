/**
 * Przyjmuje pozniejsze zadanie rozpoczecia uslugi z linku w potwierdzeniu.
 *
 * Nie zwraca zadnych danych zamowienia - tylko wynik. Dowodem zadania jest
 * potwierdzenie na trwalym nosniku wyslane kupujacemu z kopia UDW na
 * POCZTA_KOPIA (log Vercela nie jest trwaly).
 */

import { sprawdzZgode } from "./_zgoda.mjs";
import { rozlozIdentyfikator } from "./_potwierdzenie.mjs";
import { wyslijMail, konfiguracjaPoczty } from "./_poczta.mjs";

const STOPKA = `Zespół Accessibility First, Włącz Wizję
Włącz Wizję sp. z o.o., ul. Sternicza 129 lok. 50, 01-350 Warszawa
a11y@wlaczwizje.pl, tel. +48 727 935 587`;

export function trescPotwierdzeniaZgody(produkt, czas) {
  return {
    temat: `Potwierdzenie żądania rozpoczęcia usługi: ${produkt.nazwa}, ${produkt.termin}`,
    tekst: [
      "Dzień dobry,",
      "",
      `potwierdzamy, że ${czas} zażądałeś(-aś) rozpoczęcia świadczenia usługi „${produkt.nazwa}” (${produkt.termin}) przed upływem 14 dni na odstąpienie od umowy i przyjąłeś(-ęłaś) do wiadomości, że po pełnym wykonaniu usługi utracisz prawo odstąpienia od umowy.`,
      "",
      "Jeśli odstąpisz od umowy w trakcie szkolenia, zapłacisz za część już wykonaną (§ 11 ust. 7 regulaminu). Wiadomość organizacyjną z linkiem do spotkania wyślemy najpóźniej 1 dzień roboczy przed rozpoczęciem.",
      "",
      "Jeśli to nie Ty kliknąłeś(-aś) w link, napisz na a11y@wlaczwizje.pl.",
      "",
      STOPKA,
    ].join("\n"),
  };
}

export default async function handler(req, res, zaleznosci = {}) {
  if (req.method !== "POST") {
    res.status(405).json({ blad: "tylko-POST" });
    return;
  }
  const dane = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

  let zgoda;
  try {
    zgoda = sprawdzZgode(dane.token);
  } catch (blad) {
    const powod = blad.message === "link-wygasl" ? "link-wygasl" : "zly-link";
    res.status(400).json({ blad: powod });
    return;
  }
  const zamowienie = rozlozIdentyfikator(zgoda.zamowienie);
  if (!zamowienie || zamowienie.produkt.tresciCyfrowe) {
    res.status(400).json({ blad: "zly-link" });
    return;
  }

  const teraz = new Date();
  const czas = new Intl.DateTimeFormat("pl-PL", {
    timeZone: "Europe/Warsaw", day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(teraz).replace(",", ", godz.");

  console.log(JSON.stringify({
    zdarzenie: "zadanie-rozpoczecia-z-linku",
    zamowienie: zgoda.zamowienie,
    czas: teraz.toISOString(),
  }));

  const { temat, tekst } = trescPotwierdzeniaZgody(zamowienie.produkt, czas);
  try {
    await (zaleznosci.wyslijMail || wyslijMail)({
      do: zgoda.email,
      udw: [konfiguracjaPoczty().kopia],
      temat,
      tekst,
    });
  } catch (blad) {
    // Zadanie jest zlozone, ale bez potwierdzenia na trwalym nosniku nie mamy
    // dowodu. Mowimy kupujacemu wprost, zeby napisal - nie udajemy sukcesu.
    console.error(JSON.stringify({ zdarzenie: "zadanie-rozpoczecia-bez-potwierdzenia", powod: String(blad.message || blad) }));
    res.status(502).json({ blad: "brak-potwierdzenia" });
    return;
  }

  res.status(200).json({ ok: true });
}
