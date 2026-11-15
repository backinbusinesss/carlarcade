// Caricamento e interrogazione del catalogo app (data/apps.json).
import { SITE } from "./config.js";

let cache = null;

/** Carica il catalogo una sola volta per pagina. */
export async function loadCatalog() {
  if (cache) return cache;
  const res = await fetch(SITE.dataUrl, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Impossibile caricare ${SITE.dataUrl} (${res.status})`);
  cache = await res.json();
  return cache;
}

/** Ordine: prima le live, poi beta, poi in arrivo. */
const STATUS_ORDER = { live: 0, beta: 1, soon: 2 };
export function sortApps(apps) {
  return [...apps].sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));
}

export function findApp(catalog, id) {
  return catalog.apps.find((a) => a.id === id) ?? null;
}

/** Filtra per categoria/stato e testo libero. */
export function filterApps(apps, { filter = "all", query = "" } = {}) {
  const q = query.trim().toLowerCase();
  return apps.filter((app) => {
    const passFilter =
      filter === "all" || app.category === filter || app.status === filter;
    const passQuery =
      !q ||
      [app.name, app.tagline, app.description, ...(app.features ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(q);
    return passFilter && passQuery;
  });
}
