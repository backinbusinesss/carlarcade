// Home: statistiche hero + catalogo con filtri e ricerca.
import { loadCatalog, sortApps, filterApps } from "../data.js";
import { renderShell, appCard, observeReveal, esc } from "../ui.js";

renderShell("apps");

const grid = document.getElementById("app-grid");
const filtersEl = document.getElementById("filters");
const searchEl = document.getElementById("search");
const state = { filter: "all", query: "" };

try {
  const catalog = await loadCatalog();
  const apps = sortApps(catalog.apps);

  // Statistiche hero
  setStat("stat-apps", apps.length);
  setStat("stat-live", apps.filter((a) => a.status === "live").length);
  setStat("stat-soon", apps.filter((a) => a.status !== "live").length);

  // Bottoni filtro: Tutte + categorie presenti + "In arrivo"
  const usedCats = [...new Set(apps.map((a) => a.category))];
  const filters = [
    ["all", "Tutte"],
    ...usedCats.map((c) => [c, catalog.categories[c] ?? c]),
    ["soon", catalog.statuses.soon],
  ];
  filtersEl.innerHTML = filters
    .map(([key, label]) => `<button class="filter-btn" type="button" data-filter="${esc(key)}" aria-pressed="${key === "all"}">${esc(label)}</button>`)
    .join("");

  filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    state.filter = btn.dataset.filter;
    filtersEl.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    render();
  });
  searchEl.addEventListener("input", () => { state.query = searchEl.value; render(); });

  function render() {
    const list = filterApps(apps, state);
    grid.innerHTML = list.length
      ? list.map((a) => appCard(a, catalog)).join("")
      : `<p class="empty">Nessuna app trovata. Prova un'altra ricerca.</p>`;
    observeReveal(grid);
  }
  render();
} catch (err) {
  console.error(err);
  grid.innerHTML = `<p class="empty">Il catalogo non si è caricato. Ricarica la pagina.</p>`;
}

observeReveal();

function setStat(id, n) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(n);
}
