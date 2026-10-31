/**
 * Pozniejsze zadanie rozpoczecia uslugi z linku w potwierdzeniu zamowienia.
 *
 * Token jest w czesci adresu po "#", zeby nie trafial do logow serwera ani
 * naglowka Referer. Wysylamy go w tresci POST. Pole zgody nie jest zaznaczone
 * domyslnie - kupujacy zaznacza je sam.
 */

(function () {
  "use strict";

  const form = document.getElementById("zgodaForm");
  if (!form) return;
  const status = document.getElementById("zgodaStatus");
  const bledy = document.getElementById("zgodaBledy");

  const token = new URLSearchParams(location.hash.slice(1)).get("t") || "";

  const KOMUNIKATY = {
    "zly-link": "Ten link jest niepełny albo nieprawidłowy. Otwórz go ponownie z wiadomości albo napisz na a11y@wlaczwizje.pl.",
    "link-wygasl": "Ten link już wygasł. Napisz na a11y@wlaczwizje.pl.",
    "brak-potwierdzenia": "Nie udało się wysłać potwierdzenia. Napisz na a11y@wlaczwizje.pl, że chcesz wziąć udział.",
  };

  function pokazBlad(tekst) {
    bledy.innerHTML = "<h2>Nie udało się potwierdzić</h2><p>" + tekst + "</p>";
    bledy.hidden = false;
    bledy.focus();
  }

  if (!token) {
    pokazBlad(KOMUNIKATY["zly-link"]);
    form.hidden = true;
    return;
  }

  form.addEventListener("submit", async function (zdarzenie) {
    zdarzenie.preventDefault();
    bledy.hidden = true;
    if (!document.getElementById("rozpoczecie").checked) {
      pokazBlad("Zaznacz pole z żądaniem rozpoczęcia usługi.");
      return;
    }
    const przycisk = form.querySelector('[type="submit"]');
    przycisk.disabled = true;
    try {
      const odp = await fetch("/api/zgoda-rozpoczecie", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: token }),
      });
      const wynik = await odp.json().catch(function () { return {}; });
      if (!odp.ok) throw new Error(KOMUNIKATY[wynik.blad] || KOMUNIKATY["brak-potwierdzenia"]);
      form.hidden = true;
      status.innerHTML = "<p><strong>Dziękujemy, potwierdzone.</strong> Potwierdzenie wysłaliśmy na adres e-mail podany przy zamówieniu. Do zobaczenia na szkoleniu.</p>";
      status.hidden = false;
      history.replaceState(null, "", location.pathname);
    } catch (blad) {
      przycisk.disabled = false;
      pokazBlad(blad.message);
    }
  });
})();
