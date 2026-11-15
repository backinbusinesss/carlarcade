// Pagina dettaglio: app.html?id=<id-app>
import { loadCatalog, findApp, sortApps } from "../data.js";
import { SITE, LINK_LABELS } from "../config.js";
import { renderShell, appCard, statusBadge, platformChips, observeReveal, esc, ICONS } from "../ui.js";

renderShell("apps");

const root = document.getElementById("app-root");
const id = new URLSearchParams(location.search).get("id");

try {
  const catalog = await loadCatalog();
  const app = id && findApp(catalog, id);
  if (!app) {
    location.replace("404.html");
  } else {
    document.title = `${app.name} — ${SITE.name}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", app.tagline);
    root.innerHTML = view(app, catalog);
    observeReveal();
  }
} catch (err) {
  console.error(err);
  root.innerHTML = `<div class="container"><p class="empty" style="margin-top:64px">L'app non si è caricata. Ricarica la pagina.</p></div>`;
}

function actions(app) {
  const entries = Object.entries(app.links ?? {});
  if (!entries.length) {
    return `<span class="btn btn-primary" aria-disabled="true">In arrivo</span>`;
  }
  return entries
    .map(([type, url], i) => {
      const icon = type === "play" ? ICONS.play : type === "site" ? ICONS.external : ICONS.download;
      const cls = i === 0 ? "btn-primary" : "btn-ghost";
      return `<a class="btn ${cls}" href="${esc(url)}" target="_blank" rel="noopener">${icon}${esc(LINK_LABELS[type] ?? type)}</a>`;
    })
    .join("");
}

function view(app, catalog) {
  const others = sortApps(catalog.apps).filter((a) => a.id !== app.id).slice(0, 3);
  return `
  <section class="app-hero" style="--c:${esc(app.color)}">
    <div class="container">
      <nav class="breadcrumb" aria-label="Percorso"><a href="index.html#giochi">Tutte le app</a> / ${esc(app.name)}</nav>
      <div class="app-hero__grid">
        <img class="app-hero__icon" src="${esc(app.icon)}" alt="" width="148" height="148">
        <div>
          ${statusBadge(app.status, catalog.statuses)}
          <h1>${esc(app.name)}</h1>
          <p class="app-hero__tagline">${esc(app.tagline)}</p>
        </div>
      </div>
      <div class="app-hero__actions">${actions(app)}</div>
    </div>
  </section>

  <section class="container" style="--c:${esc(app.color)}">
    <div class="app-body">
      <div class="panel reveal">
        <h2>Di cosa si tratta</h2>
        <p>${esc(app.description)}</p>
        ${app.stats?.length ? `<div class="stats" style="margin-top:24px">${app.stats.map((s) => `<div class="stat"><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join("")}</div>` : ""}
      </div>
      <div style="display:grid;gap:24px;align-content:start">
        ${app.features?.length ? `<div class="panel reveal"><h2>Cosa trovi</h2><ul class="feature-list">${app.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></div>` : ""}
        <div class="panel reveal">
          <h2>Dove funziona</h2>
          <div class="platforms">${platformChips(app.platforms)}</div>
          <p style="margin-top:14px;font-size:14px">Categoria: ${esc(catalog.categories[app.category] ?? app.category)}</p>
        </div>
      </div>
    </div>

    ${others.length ? `
    <div class="more-apps">
      <div class="section__head"><h2 class="section__title" style="font-size:32px">Altre app</h2></div>
      <div class="app-grid">${others.map((a) => appCard(a, catalog)).join("")}</div>
    </div>` : ""}
  </section>`;
}
