// Home: scelta rapida, showcase delle app live, catalogo, CTA finale e barra mobile.
import { loadCatalog, sortApps, filterApps } from "../data.js";
import {
  renderShell, renderFooter, appCard, showcase, primaryCta, bestLink, outbound, appUrl, safeUrl,
  observeReveal, initTracking, stickyBar, brandStyle, esc,
} from "../ui.js";

renderShell("apps");
initTracking();

const $ = (id) => document.getElementById(id);
const state = { filter: "all", query: "" };

try {
  const catalog = await loadCatalog();
  const apps = sortApps(catalog.apps);
  const live = apps.filter((a) => a.status === "live" || a.status === "beta");
  const soon = apps.length - live.length;
  renderFooter(apps);

  $("hero-pill").innerHTML = `<span class="pill__tag">Gratis</span><span><b>${live.length} app online</b>${soon ? `, ${soon} in arrivo` : ""}</span>`;

  // Hero: una riga per app live, con il bottone giusto per il dispositivo
  $("hero-picks").innerHTML = live
    .map((a) => `
    <div class="pick" style="${brandStyle(a)}">
      <a class="pick__info" href="${appUrl(a)}">
        <img src="${safeUrl(a.icon)}" alt="" width="48" height="48">
        <span><strong>${esc(a.name)}</strong><span>${esc(a.audience ?? a.tagline)}</span></span>
      </a>
      ${primaryCta(a, { size: "", where: "hero" })}
    </div>`)
    .join("");

  // Showcase col brand di ogni app
  $("showcases").innerHTML = live.filter((a) => a.featured !== false).map(showcase).join("");

  // CTA finale
  $("final-ctas").innerHTML = live
    .map((a) => `<span style="${brandStyle(a)}">${primaryCta(a, { size: "btn-lg", where: "final" })}</span>`)
    .join("");

  // Barra fissa su mobile
  // Barra fissa su mobile: un'icona per app, così ci stanno anche 3-4 app
  stickyBar(`<span class="sticky-cta__label">Inizia gratis<small>Scegli un'app</small></span><span class="sticky-cta__apps">` + live
    .map((a) => {
      const best = bestLink(a);
      return best ? `<a class="sticky-cta__app-btn" href="${safeUrl(outbound(best.url, best.type, a.id))}" target="_blank" rel="noopener"
        data-track="Apri app" data-app="${esc(a.id)}" data-link="${esc(best.type)}" data-where="sticky" aria-label="Apri ${esc(a.name)}">
        <img src="${safeUrl(a.icon)}" alt="" width="40" height="40"></a>` : "";
    })
    .join("") + `</span>`);

  // Catalogo
  const usedCats = [...new Set(apps.map((a) => a.category))];
  const filters = [["all", "Tutte"], ...usedCats.map((c) => [c, catalog.categories[c] ?? c]), ...(apps.some((a) => a.status === "soon") ? [["soon", catalog.statuses.soon]] : [])];
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
