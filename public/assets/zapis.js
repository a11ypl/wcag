/**
 * Formularz zapisu na szkolenie.
 *
 * Do serwera ida WYLACZNIE: identyfikator szkolenia, identyfikator wariantu
 * ceny z linku i dane kupujacego. Kwota nie jest tu liczona ani wysylana - wylicza ja api/_katalog.mjs.
 * Gdyby cena szla z przegladarki, mozna by ja podmienic w narzedziach dewelopera.
 *
 * Bledy pokazujemy w podsumowaniu nad formularzem, z przeniesieniem fokusu -
 * inaczej osoba korzystajaca z czytnika ekranu nie dowie sie, ze cos poszlo nie tak.
 */

(function () {
  "use strict";

  const form = document.getElementById("zapisForm");
  if (!form) return;

  const podsumowanieBledow = document.getElementById("zapisBledy");
  const status = document.getElementById("zapisStatus");

  const KOMUNIKATY = {
    "brak-produktu": "Wybierz szkolenie.",
    "brak-imienia-i-nazwiska": "Podaj imię i nazwisko uczestnika.",
    "bledny-email": "Podaj poprawny adres e-mail.",
    "nieznany-produkt": "To szkolenie jest już niedostępne. Odśwież stronę.",
    "produkt-niedostepny": "Ten produkt nie jest jeszcze w sprzedaży.",
    "brak-akceptacji-regulaminu": "Zaakceptuj regulamin i potwierdź zapoznanie się z polityką prywatności.",
    "bramka-niedostepna": "Operator płatności chwilowo nie odpowiada. Spróbuj za chwilę.",
    "bramka-odrzucila-transakcje": "Operator płatności odrzucił transakcję. Spróbuj ponownie lub napisz na a11y@wlaczwizje.pl.",
    "brak-adresu-platnosci": "Nie udało się otworzyć płatności. Napisz na a11y@wlaczwizje.pl.",
    "platnosci-chwilowo-niedostepne": "Płatności online są chwilowo wyłączone. Napisz na a11y@wlaczwizje.pl.",
  };

  /** Preselekcja szkolenia z adresu, np. /zapis?szkolenie=dostepne-dokumenty.
   *  To klucz katalogowy, nie identyfikator cudzego zamowienia - i tak jest
   *  sprawdzany po stronie serwera, wiec podmiana niczego nie daje. */
  const parametry = new URLSearchParams(location.search);
  const wariant = parametry.get("wariant") || "";
  const wybrane = parametry.get("szkolenie");
  if (wybrane) {
    const pole = form.querySelector(`input[name="produkt"][value="${CSS.escape(wybrane)}"]`);
    if (pole) pole.checked = true;
  }

  /** Oswiadczenia o wczesniejszym rozpoczeciu zaleza od rodzaju produktu:
   *  szkolenie otwarte - rozpoczecie uslugi i kurs z pakietu, tresc cyfrowa -
   *  natychmiastowe dostarczenie. Pola nigdy nie sa zaznaczone domyslnie
   *  i nigdy nie sa wymagane: nie wolno uzaleznic sprzedazy od zrzeczenia sie
   *  prawa odstapienia. Ukryte pole jest odznaczane, zeby nie poszlo
   *  oswiadczenie, ktorego kupujacy nie widzial. */
  const polaProduktu = form.querySelectorAll('input[name="produkt"]');
  const SEKCJE = [
    { sekcja: "zgodaRozpoczecie", pole: "rozpoczecie", dlaCyfrowych: false },
    { sekcja: "zgodaKurs", pole: "kurs", dlaCyfrowych: false },
    { sekcja: "zgodaCyfrowa", pole: "natychmiast", dlaCyfrowych: true },
  ];

  function odswiezOswiadczenia() {
    const wybrany = form.querySelector('input[name="produkt"]:checked');
    const cyfrowy = Boolean(wybrany && wybrany.dataset.tresciCyfrowe === "1");
    SEKCJE.forEach(function (s) {
      const sekcja = document.getElementById(s.sekcja);
      if (!sekcja) return;
      const widoczna = s.dlaCyfrowych === cyfrowy;
      sekcja.hidden = !widoczna;
      if (!widoczna) {
        const pole = document.getElementById(s.pole);
        if (pole) pole.checked = false;
      }
    });
  }
  polaProduktu.forEach((pole) => pole.addEventListener("change", odswiezOswiadczenia));
  odswiezOswiadczenia();

  /** Cena przychodzi z serwera, nie z przegladarki - tu tylko ja pokazujemy.
   *  Dzieki temu kupujacy widzi, ze promocja z linku wygasla, zanim zaplaci. */
  const panelCeny = document.getElementById("zapisCena");

  async function odswiezCene() {
    const wybrany = form.querySelector('input[name="produkt"]:checked');
    if (!panelCeny || !wybrany) return;
    const pytanie = new URLSearchParams({ produkt: wybrany.value });
    if (wariant) pytanie.set("wariant", wariant);
    try {
      const odp = await fetch("/api/cennik?" + pytanie.toString());
      if (!odp.ok) { panelCeny.hidden = true; return; }
      const dane = await odp.json();
      let tresc = "<p><strong>Do zapłaty: " + dane.kwota + " zł</strong></p>";
      if (dane.wariant && dane.wariant.zastosowany) {
        tresc += "<p>Cena promocyjna z Twojego linku zamiast " +
                 (dane.wariant.cenaPrzed / 100).toFixed(2) + " zł" +
                 (dane.wariant.wazneDo ? ". Link jest ważny do " + dane.wariant.wazneDo + "." : ".") + "</p>";
      } else if (dane.wariant && dane.wariant.powod === "wariant-wygasl") {
        tresc += "<p>Promocja z tego linku wygasła " + dane.wariant.wazneDo +
                 ". Obowiązuje cena regularna.</p>";
      }
      panelCeny.innerHTML = tresc;
      panelCeny.hidden = false;
    } catch (blad) {
      panelCeny.hidden = true;
    }
  }
  polaProduktu.forEach(function (pole) { pole.addEventListener("change", odswiezCene); });
  odswiezCene();

  function pokazBledy(lista) {
    if (!podsumowanieBledow) return;
    if (!lista.length) {
      podsumowanieBledow.hidden = true;
      podsumowanieBledow.innerHTML = "";
      return;
    }
    const naglowek = lista.length === 1 ? "Popraw jeden błąd:" : `Popraw ${lista.length} błędy:`;
    podsumowanieBledow.innerHTML =
      `<h2>${naglowek}</h2><ul>${lista.map((b) => `<li>${b}</li>`).join("")}</ul>`;
    podsumowanieBledow.hidden = false;
    podsumowanieBledow.focus();
  }

  function zwaliduj(dane, zgoda) {
    const bledy = [];
    if (!dane.produkt) bledy.push("Wybierz szkolenie.");
    if (!dane.imie || dane.imie.trim().length < 3) bledy.push("Podaj imię i nazwisko uczestnika.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(dane.email || "")) bledy.push("Podaj poprawny adres e-mail.");
    if (!zgoda) bledy.push("Zaakceptuj regulamin i potwierdź zapoznanie się z polityką prywatności.");
    return bledy;
  }

  form.addEventListener("submit", async (zdarzenie) => {
    zdarzenie.preventDefault();

    const pola = new FormData(form);
    const dane = {
      produkt: pola.get("produkt") || "",
      imie: (pola.get("imie") || "").toString().trim(),
      email: (pola.get("email") || "").toString().trim(),
      firma: (pola.get("firma") || "").toString().trim(),
      nip: (pola.get("nip") || "").toString().trim(),
      wariant: wariant,
      natychmiast: pola.get("natychmiast") === "on",
      rozpoczecie: pola.get("rozpoczecie") === "on",
      kurs: pola.get("kurs") === "on",
      zgoda: pola.get("zgoda") === "on",
    };

    const bledy = zwaliduj(dane, dane.zgoda);
    if (bledy.length) {
      pokazBledy(bledy);
      return;
    }
    pokazBledy([]);

    const przycisk = form.querySelector('[type="submit"]');
    const etykieta = przycisk ? przycisk.textContent : "";
    if (przycisk) {
      przycisk.disabled = true;
      przycisk.textContent = "Otwieram płatność…";
    }
    if (status) {
      status.textContent = "Łączę się z operatorem płatności. Za chwilę nastąpi przekierowanie.";
      status.hidden = false;
    }

    try {
      const odpowiedz = await fetch("/api/platnosc-start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(dane),
      });
      const wynik = await odpowiedz.json().catch(() => ({}));

      if (!odpowiedz.ok || !wynik.url) {
        throw new Error(KOMUNIKATY[wynik.blad] || "Nie udało się rozpocząć płatności. Spróbuj ponownie.");
      }
      window.location.assign(wynik.url);
    } catch (blad) {
      if (status) status.hidden = true;
      pokazBledy([blad.message]);
      if (przycisk) {
        przycisk.disabled = false;
        przycisk.textContent = etykieta;
      }
    }
  });
})();
