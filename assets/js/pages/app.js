// Pagina dettaglio, tematizzata col brand dell'app: app.html?id=<id-app>
import { loadCatalog, findApp, sortApps } from "../data.js";
import { SITE, LINK_TYPES } from "../config.js";
import {
  renderShell, renderFooter, appCard, statusBadge, platformChips, observeReveal,
  esc, safeUrl, brandStyle, linkButton, linkIcon, appVisual, ICONS,
} from "../ui.js";

renderShell("apps");

const root = document.getElementById("app-root");
const id = new URLSearchParams(location.search).get("id");

try {
  const catalog = await loadCatalog();
  renderFooter(sortApps(catalog.apps));
  const app = id && findApp(catalog, id);
  if (!app) {
    location.replace("404.html");
  } else {
    document.title = `${app.name}: ${app.tagline} | ${SITE.name}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", app.description);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", app.brand?.bg ?? "#09090b");
    root.className = "app-page";
    root.setAttribute("style", brandStyle(app));
    root.innerHTML = view(app, catalog);
    observeReveal();
  }
} catch (err) {
  console.error(err);
  renderFooter();
  root.innerHTML = `<div class="container"><p class="empty" style="margin-top:64px">L'app non si è caricata. Ricarica la pagina.</p></div>`;
}

function heroActions(app) {
  const l = app.links ?? {};
  if (!Object.keys(l).length) return `<span class="btn btn-app btn-lg" aria-disabled="true">In arrivo</span>`;
  const out = [];
  if (l.play) out.push(linkButton("play", l.play, "app", "btn-lg"));
  if (l.site) out.push(linkButton("site", l.site, out.length ? "ghost" : "app", "btn-lg"));
  if (!out.length) {
    const [t, u] = Object.entries(l)[0];
    out.push(linkButton(t, u, "app", "btn-lg"));
  }
  return out.join("");
}

function downloads(app) {
  const entries = Object.entries(app.links ?? {});
  if (!entries.length) return "";
  return `
  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="section__head"><div><p class="eyebrow">Dove trovarla</p><h2 class="section__title">Usala dove vuoi.</h2></div></div>
      <div class="downloads">
        ${entries.map(([type, url]) => {
          const t = LINK_TYPES[type] ?? { short: type, note: "" };
          return `<a class="download reveal" href="${safeUrl(url)}" target="_blank" rel="noopener">
            <span class="download__ico">${linkIcon(type)}</span>
            <span><strong>${esc(t.short)}</strong><span>${esc(t.note)}</span></span>
          </a>`;
        }).join("")}
      </div>
    </div>
  </section>`;
}

function view(app, catalog) {
  const others = sortApps(catalog.apps).filter((a) => a.id !== app.id).slice(0, 3);
  const stats = app.stats ?? [];
  const features = app.features ?? [];
  const screens = app.screens ?? [];
  return `
  <section class="app-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Percorso"><a href="index.html#catalogo">App</a><span>/</span><span>${esc(app.name)}</span></nav>
      <div class="app-hero__grid">
        <div>
          <img class="app-hero__icon" src="${safeUrl(app.icon)}" alt="" width="88" height="88">
          ${statusBadge(app.status, catalog.statuses)}
          <h1>${esc(app.name)}</h1>
          <p class="app-hero__tagline">${esc(app.tagline)}</p>
          <p class="app-hero__desc">${esc(app.description)}</p>
          <div class="app-hero__actions">${heroActions(app)}</div>
          <div class="app-hero__platforms">${platformChips(app.platforms)}</div>
        </div>
        <div class="showcase__visual">${appVisual(app)}</div>
      </div>
    </div>
  </section>

  ${stats.length ? `
  <section class="container" style="margin-top:clamp(32px,5vw,56px)">
    <div class="stat-row reveal">${stats.slice(0, 4).map((s) => `<div><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join("")}</div>
  </section>` : ""}

  ${features.length ? `
  <section class="section">
    <div class="container">
      <div class="section__head"><div><p class="eyebrow">Funzioni</p><h2 class="section__title">Cosa trovi dentro.</h2></div></div>
      <div class="features">
        ${features.map((f, i) => {
          const title = typeof f === "string" ? f : f.title;
          const text = typeof f === "string" ? "" : f.text;
          return `<div class="feature reveal"><span class="feature__dot">${String(i + 1).padStart(2, "0")}</span><h3>${esc(title)}</h3>${text ? `<p>${esc(text)}</p>` : ""}</div>`;
        }).join("")}
      </div>
    </div>
  </section>` : ""}

  ${screens.length > 2 ? `
  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="section__head"><div><p class="eyebrow">Schermate</p><h2 class="section__title">Dai un'occhiata.</h2></div></div>
      <div class="gallery">${screens.map((s) => `<div class="phone"><img src="${safeUrl(s.src)}" alt="${esc(s.alt ?? "")}" loading="lazy"></div>`).join("")}</div>
    </div>
  </section>` : ""}

  ${downloads(app)}

  ${others.length ? `
  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="section__head"><div><p class="eyebrow">CarlArcade</p><h2 class="section__title">Altre app.</h2></div>
        <a class="btn btn-ghost" href="index.html#catalogo">Tutto il catalogo ${ICONS.arrow}</a></div>
      <div class="app-grid">${others.map((a) => appCard(a, catalog)).join("")}</div>
    </div>
  </section>` : ""}`;
}
