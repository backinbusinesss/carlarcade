// Pagina dettaglio, tematizzata col brand dell'app: app.html?id=<id-app>
import { loadCatalog, findApp, sortApps } from "../data.js";
import { SITE, LINK_TYPES } from "../config.js";
import {
  renderShell, renderFooter, appCard, statusBadge, platformChips, observeReveal,
  esc, safeUrl, brandStyle, linkButton, linkIcon, appVisual, ICONS,
  primaryCta, bestLink, detectPlatform, outbound, trustRow, faqList, stickyBar, initTracking,
} from "../ui.js";

renderShell("apps");
initTracking();

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
    addStructuredData(app);
    if (bestLink(app)) {
      const bar = `<img class="sticky-cta__icon" src="${safeUrl(app.icon)}" alt="" width="32" height="32"><span class="sticky-cta__label">${esc(app.name)}<small>Gratis</small></span>${primaryCta(app, { size: "btn-sm", where: "sticky" })}`;
      stickyBar(`<span class="sticky-cta__app" style="${brandStyle(app)}">${bar}</span>`);
    }
    observeReveal();
  }
} catch (err) {
  console.error(err);
  renderFooter();
  root.innerHTML = `<div class="container"><p class="empty" style="margin-top:64px">L'app non si è caricata. Ricarica la pagina.</p></div>`;
}

/** Dati strutturati per Google: SoftwareApplication gratuita. */
function addStructuredData(app) {
  const os = { web: "Web", android: "Android", ios: "iOS", windows: "Windows", mac: "macOS", linux: "Linux" };
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.description,
    applicationCategory: app.category === "studio" ? "EducationalApplication" : "GameApplication",
    operatingSystem: (app.platforms ?? []).map((p) => os[p] ?? p).join(", "),
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    url: app.links?.site ?? location.href,
    image: new URL(app.cover ?? app.icon, location.href).href,
    publisher: { "@type": "Organization", name: SITE.parent.name, url: SITE.parent.url },
  };
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

function heroActions(app) {
  const l = app.links ?? {};
  if (!Object.keys(l).length) {
    return `<a class="btn btn-app btn-lg" href="mailto:${SITE.contactEmail}?subject=${encodeURIComponent(`Avvisami quando esce ${app.name}`)}" data-track="Avvisami" data-app="${esc(app.id)}">${esc(app.cta ?? "Avvisami al lancio")}</a>`;
  }
  const best = bestLink(app);
  const out = [primaryCta(app, { where: "hero" })];
  // Secondo bottone: il sito ufficiale, o l'app web se il primo era un download
  if (best.type !== "play" && l.play) out.push(linkButton("play", l.play, "ghost", "btn-lg", { app, where: "hero" }));
  else if (best.type !== "site" && l.site) out.push(linkButton("site", l.site, "ghost", "btn-lg", { app, where: "hero" }));
  return out.join("");
}

function downloads(app) {
  // Ordine: app web, download nativi, sito ufficiale per ultimo
  const rank = (t) => (t === "play" ? 0 : t === "site" ? 2 : 1);
  const entries = Object.entries(app.links ?? {}).sort(([a], [b]) => rank(a) - rank(b));
  if (!entries.length) return "";
  const mine = detectPlatform();
  const best = bestLink(app, mine, { preferNative: true });
  return `
  <section class="section section--tight" id="scarica">
    <div class="container">
      <div class="section__head"><div><p class="eyebrow">Dove trovarla</p><h2 class="section__title">Usala dove vuoi.</h2></div>
        <p class="section__lead">Ti abbiamo evidenziato la versione migliore per il dispositivo che stai usando.</p></div>
      <div class="downloads">
        ${entries.map(([type, url]) => {
          const t = LINK_TYPES[type] ?? { short: type, note: "", kind: "download" };
          const rec = best && best.type === type;
          return `<a class="download ${rec ? "download--rec" : ""} reveal" href="${safeUrl(outbound(url, type, app.id))}" target="_blank" rel="noopener"
              data-track="${t.kind === "download" ? "Download" : "Apri app"}" data-app="${esc(app.id)}" data-link="${esc(type)}" data-where="downloads">
            <span class="download__ico">${linkIcon(type)}</span>
            <span class="download__txt"><strong>${esc(t.short)}</strong><span>${esc(t.note)}</span></span>
            ${rec ? `<span class="download__rec">Consigliato per te</span>` : ""}
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
          ${app.status === "soon" ? "" : trustRow(["Gratis", "Senza registrazione", ...(app.platforms ?? []).length > 2 ? ["Su tutti i dispositivi"] : []])}
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

  ${app.faq?.length ? `
  <section class="section section--tight">
    <div class="container faq-wrap">
      <div><p class="eyebrow">Domande frequenti</p><h2 class="section__title">Su ${esc(app.name)}.</h2></div>
      ${faqList(app.faq)}
    </div>
  </section>` : ""}

  ${bestLink(app) ? `
  <section class="container">
    <div class="cta cta--app reveal">
      <img src="${safeUrl(app.icon)}" alt="" width="72" height="72" class="cta__icon">
      <h2>${esc(app.tagline)}</h2>
      <p>${esc(app.name)} è gratis e parte in pochi secondi.</p>
      <div class="cta__actions">${primaryCta(app, { where: "final" })}</div>
    </div>
  </section>` : ""}

  ${others.length ? `
  <section class="section">
    <div class="container">
      <div class="section__head"><div><p class="eyebrow">CarlArcade</p><h2 class="section__title">Altre app.</h2></div>
        <a class="btn btn-ghost" href="index.html#catalogo">Tutto il catalogo ${ICONS.arrow}</a></div>
      <div class="app-grid">${others.map((a) => appCard(a, catalog)).join("")}</div>
    </div>
  </section>` : ""}`;
}
