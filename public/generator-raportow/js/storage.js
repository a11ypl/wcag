// Rejestr audytów w IndexedDB przeglądarki — mieści wiele audytów ze zrzutami ekranu
// (localStorage ma ok. 5 MB). Dane nie opuszczają komputera. Gdy IndexedDB jest niedostępne
// (np. tryb prywatny w niektórych przeglądarkach), audyty żyją tylko do zamknięcia karty.

const DB_NAME = "a11yfirst-raport";
const STORE = "audits";
const CURRENT_KEY = "a11yfirst-raport.biezacy-audyt";
export const LEGACY_KEY = "a11yfirst-raport.projekt.v1";

let dbPromise = null;
const memory = new Map();
let persistent = true;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: "id" });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => { persistent = false; resolve(null); };
    } catch {
      persistent = false;
      resolve(null);
    }
  });
  return dbPromise;
}

function tx(db, mode, run) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const result = run(transaction.objectStore(STORE));
    transaction.oncomplete = () => resolve(result?.result);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

export function isPersistent() {
  return persistent;
}

export async function listAudits() {
  const db = await openDb();
  if (!db) return [...memory.values()];
  return (await tx(db, "readonly", (store) => store.getAll())) || [];
}

export async function saveAudit(record) {
  const db = await openDb();
  if (!db) { memory.set(record.id, structuredClone(record)); return; }
  await tx(db, "readwrite", (store) => store.put(record));
}

export async function deleteAudit(id) {
  const db = await openDb();
  if (!db) { memory.delete(id); return; }
  await tx(db, "readwrite", (store) => store.delete(id));
}

export function currentAuditId() {
  try { return localStorage.getItem(CURRENT_KEY); } catch { return null; }
}

export function setCurrentAuditId(id) {
  try { localStorage.setItem(CURRENT_KEY, id); } catch { /* bez pamięci przeglądarki */ }
}

export function takeLegacyProject() {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function dropLegacyProject() {
  try { localStorage.removeItem(LEGACY_KEY); } catch { /* nic */ }
}

// Awaryjna kopia przy zamykaniu karty: zapis do localStorage jest synchroniczny, więc kończy się,
// zanim przeglądarka zamknie stronę. Przy następnym otwarciu kopia wraca do IndexedDB.
const PENDING_KEY = "a11yfirst-raport.niezapisany-audyt";

export function savePending(record) {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(record)); return true; } catch { return false; }
}

export function takePending() {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    localStorage.removeItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
