// Bramka hasła dla biblioteki materiałów trenerskich Accessibility First.
// Hasło i sekret sesji TYLKO w zmiennych środowiskowych Vercela:
//   TRENER_PASSWORD        hasło Damiana
//   TRENER_SESSION_SECRET  losowy sekret (np. openssl rand -hex 32)
// Brak zmiennych = 503 (bez zapasowego hasła w kodzie).
const crypto = require("crypto");
const STRONA = require("./_strona-trenera.js");

const CIASTKO = "af_trener";
const WAZNOSC_S = 30 * 24 * 3600;

function podpis(dane, sekret) {
  return crypto.createHmac("sha256", sekret).update(dane).digest("hex");
}
function rowne(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function ciastka(req) {
  const out = {};
  String(req.headers.cookie || "").split(";").forEach((c) => {
    const i = c.indexOf("=");
    if (i > 0) out[c.slice(0, i).trim()] = decodeURIComponent(c.slice(i + 1).trim());
  });
  return out;
}
function sesjaWazna(req, haslo, sekret) {
  const v = ciastka(req)[CIASTKO];
  if (!v) return false;
  const [wygasa, sig] = v.split(".");
  if (!wygasa || !sig || Date.now() / 1000 > Number(wygasa)) return false;
  // podpis zależy też od hasła: zmiana hasła unieważnia stare sesje
  return rowne(sig, podpis(wygasa + ":" + podpis(haslo, sekret), sekret));
}
function formularz(blad) {
  return `<!DOCTYPE html>
<html lang="pl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Materiały trenerskie: logowanie - Accessibility First</title>
<style>
body{margin:0;font-family:Inter,"Helvetica Neue",Arial,system-ui,sans-serif;color:#14191d;background:#E2F4FF;display:grid;min-height:100vh;place-items:center}
main{background:#fff;border-top:8px solid #5F338A;border-radius:8px;padding:2rem;max-width:26rem;width:calc(100% - 2rem);box-sizing:border-box}
h1{color:#5F338A;margin:0 0 1rem;font-size:1.6rem}
label{display:block;font-weight:700;margin-bottom:.4rem}
input{font:inherit;width:100%;box-sizing:border-box;padding:.6rem .75rem;border:2px solid #555;border-radius:.35rem}
button{font:inherit;font-weight:700;margin-top:1rem;min-height:44px;padding:.6rem 1.4rem;background:#5F338A;color:#fff;border:2px solid #5F338A;border-radius:.35rem;cursor:pointer}
button:hover{background:#fff;color:#5F338A;text-decoration:underline}
:focus-visible{outline:4px solid #14191d;outline-offset:3px;box-shadow:0 0 0 8px #FEDB16}
.blad{color:#a31414;font-weight:700;border-left:6px solid #a31414;padding-left:.6rem}
</style></head><body><main>
<h1>Materiały trenerskie</h1>
${blad ? '<p class="blad" role="alert" id="blad">Nieprawidłowe hasło. Spróbuj jeszcze raz.</p>' : ""}
<form method="post" action="/api/materialy-trenera">
<label for="haslo">Hasło</label>
<input id="haslo" name="haslo" type="password" autocomplete="current-password" required${blad ? ' aria-invalid="true" aria-describedby="blad"' : ""}>
<button type="submit">Zaloguj</button>
</form></main></body></html>`;
}
function wyslij(res, kod, tresc, naglowki) {
  res.statusCode = kod;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Cache-Control", "no-store");
  Object.entries(naglowki || {}).forEach(([k, v]) => res.setHeader(k, v));
  res.end(tresc);
}
function cialo(req) {
  return new Promise((ok) => {
    if (req.body !== undefined) return ok(typeof req.body === "string" ? req.body : new URLSearchParams(req.body).toString());
    let d = ""; req.on("data", (c) => { d += c; if (d.length > 10000) req.destroy(); }); req.on("end", () => ok(d));
  });
}

module.exports = async function handler(req, res) {
  const haslo = process.env.TRENER_PASSWORD, sekret = process.env.TRENER_SESSION_SECRET;
  if (!haslo || !sekret || sekret.length < 32) return wyslij(res, 503, "Materiały trenerskie są chwilowo niedostępne.");
  const url = new URL(req.url, "https://www.a11yfirst.pl");
  if (url.searchParams.get("wyloguj")) {
    return wyslij(res, 303, "", { Location: "/materialy/trener", "Set-Cookie": `${CIASTKO}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` });
  }
  if (req.method === "POST") {
    const origin = req.headers.origin;
    if (origin && !/^https:\/\/(www\.)?a11yfirst\.pl$|\.vercel\.app$/.test(origin)) return wyslij(res, 403, "Niedozwolone źródło żądania.");
    const dane = new URLSearchParams(await cialo(req));
    if (!rowne(dane.get("haslo") || "", haslo)) return wyslij(res, 401, formularz(true));
    const wygasa = String(Math.floor(Date.now() / 1000) + WAZNOSC_S);
    const wartosc = wygasa + "." + podpis(wygasa + ":" + podpis(haslo, sekret), sekret);
    return wyslij(res, 303, "", { Location: "/materialy/trener", "Set-Cookie": `${CIASTKO}=${wartosc}; Path=/; Max-Age=${WAZNOSC_S}; HttpOnly; Secure; SameSite=Lax` });
  }
  if (!sesjaWazna(req, haslo, sekret)) return wyslij(res, 401, formularz(false));
  return wyslij(res, 200, STRONA);
};
