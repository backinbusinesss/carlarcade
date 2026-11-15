// Home: dock icone, showcase delle app live, catalogo con filtri e ricerca.
import { loadCatalog, sortApps, filterApps } from "../data.js";
import { renderShell, renderFooter, appCard, showcase, appUrl, safeUrl, observeReveal, esc } from "../ui.js";

renderShell("apps");

const $ = (id) => document.getElementById(id);
const state = { filter: "all", query: "" };

try {
  const catalog = await loadCatalog();
  const apps = sortApps(catalog.apps);
  renderFooter(apps);

  // Dock con le icone vere delle app
  $("dock").innerHTML = apps
    .map((a) => `<a href="${appUrl(a)}" class="${a.status === "soon" ? "is-soon" : ""}" style="--c:${esc(a.color)}">
      <img src="${safeUrl(a.icon)}" alt="" width="84" height="84"><span>${esc(a.name)}</span></a>`)
    .join("");

  // Pill in alto
  const live = apps.filter((a) => a.status === "live").length;
  const soon = apps.length - live;
  $("hero-pill").innerHTML = `<span class="pill__tag">Nuovo</span><span><b>${live} app online</b>${soon ? `, ${soon} in arrivo` : ""}</span>`;

  // Showcase: tutte le app live (in evidenza se "featured")
  const showcased = apps.filter((a) => a.status === "live" && a.featured !== false);
  $("showcases").innerHTML = showcased.map(showcase).join("");

  // Catalogo: filtri
  const usedCats = [...new Set(apps.map((a) => a.category))];
  const filters = [["all", "Tutte"], ...usedCats.map((c) => [c, catalog.categories[c] ?? c]), ["soon", catalog.statuses.soon]];
  const filtersEl = $("filters");
  filtersEl.innerHTML = filters
    .map(([k, l]) => `<button type="button" data-filter="${esc(k)}" aria-pressed="${k === "all"}">${esc(l)}</button>`)
    .join("");
  filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    state.filter = btn.dataset.filter;
    filtersEl.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    renderGrid();
  });
  $("search").addEventListener("input", (e) => { state.query = e.target.value; renderGrid(); });

  function renderGrid() {
    const list = filterApps(apps, state);
    $("app-grid").innerHTML = list.length
      ? list.map((a) => appCard(a, catalog)).join("")
      : `<p class="empty">Nessuna app trovata. Prova un'altra ricerca.</p>`;
    observeReveal($("app-grid"));
  }
  renderGrid();
} catch (err) {
  console.error(err);
  renderFooter();
  $("app-grid").innerHTML = `<p class="empty">Il catalogo non si è caricato. Ricarica la pagina.</p>`;
}

observeReveal();
