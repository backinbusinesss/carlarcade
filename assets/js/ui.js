// Componenti condivisi: header, footer, card app, badge, icone.
import { SITE, PLATFORM_LABELS } from "./config.js";

export const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const ICONS = {
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M6 11l6 6 6-6M4 21h16"/></svg>`,
  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
};

/** Header e footer vengono iniettati in <div data-shell="header|footer">. */
export function renderShell(current = "") {
  const nav = [
    { href: "index.html#giochi", label: "Giochi", key: "apps" },
    { href: "chi-siamo.html", label: "Chi siamo", key: "about", cls: "hide-sm" },
    { href: SITE.parent.url, label: SITE.parent.name, key: "parent", ext: true },
  ];

  const header = document.querySelector('[data-shell="header"]');
  if (header) {
    header.outerHTML = `
    <header class="site-header">
      <div class="container">
        <a class="logo" href="index.html" aria-label="${SITE.name} — home">
          <img src="assets/img/logo.svg" alt="" width="34" height="34">
          <span>Carl<em>Arcade</em></span>
        </a>
        <nav class="nav" aria-label="Principale">
          ${nav.map((n) => `<a href="${n.href}" class="${n.cls ?? ""}" ${n.key === current ? 'aria-current="page"' : ""} ${n.ext ? 'target="_blank" rel="noopener"' : ""}>${n.label}</a>`).join("")}
        </nav>
      </div>
    </header>`;
  }

  const footer = document.querySelector('[data-shell="footer"]');
  if (footer) {
    const year = new Date().getFullYear();
    footer.outerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-brand">
          <a class="logo" href="index.html"><img src="assets/img/logo.svg" alt="" width="34" height="34"><span>Carl<em>Arcade</em></span></a>
          <p>${esc(SITE.tagline)} Quiz, giochi e strumenti utili, tutti in un unico posto.</p>
        </div>
        <div>
          <h4>Esplora</h4>
          <ul>
            <li><a href="index.html#giochi">Tutte le app</a></li>
            <li><a href="chi-siamo.html">Chi siamo</a></li>
          </ul>
        </div>
        <div>
          <h4>Contatti</h4>
          <ul>
            <li><a href="mailto:${SITE.contactEmail}">${SITE.contactEmail}</a></li>
            <li><a href="${SITE.parent.url}" target="_blank" rel="noopener">${SITE.parent.name}</a></li>
          </ul>
        </div>
        <div class="footer-bottom">
          <span>© ${year} ${SITE.name}</span>
          <a class="carlhost-mark" href="${SITE.parent.url}" target="_blank" rel="noopener">Un progetto <strong>${SITE.parent.name}</strong></a>
        </div>
      </div>
    </footer>`;
  }
}

export const statusBadge = (status, labels) =>
  `<span class="badge badge--${esc(status)}">${esc(labels[status] ?? status)}</span>`;

export const platformChips = (platforms = []) =>
  platforms.map((p) => `<span class="chip">${esc(PLATFORM_LABELS[p] ?? p)}</span>`).join("");

/** Card di un'app per la griglia. */
export function appCard(app, catalog) {
  const soon = app.status === "soon";
  return `
  <article class="app-card ${soon ? "app-card--soon" : ""} reveal" style="--c:${esc(app.color)}">
    <div class="app-card__top">
      <img class="app-card__icon" src="${esc(app.icon)}" alt="" width="64" height="64" loading="lazy">
      ${statusBadge(app.status, catalog.statuses)}
    </div>
    <div>
      <h3 class="app-card__name">${esc(app.name)}</h3>
      <p class="app-card__tagline">${esc(app.tagline)}</p>
    </div>
    <div class="app-card__meta">
      <span class="chip">${esc(catalog.categories[app.category] ?? app.category)}</span>
      ${platformChips(app.platforms)}
    </div>
    <div class="app-card__cta">${soon ? "Scopri cosa arriva" : "Apri"} ${ICONS.arrow}</div>
    <a class="app-card__link" href="app.html?id=${encodeURIComponent(app.id)}" aria-label="${esc(app.name)}: dettagli"></a>
  </article>`;
}

/** Animazione leggera all'ingresso nello schermo. */
export function observeReveal(root = document) {
  const els = root.querySelectorAll(".reveal:not(.is-in)");
  if (!("IntersectionObserver" in window)) return els.forEach((el) => el.classList.add("is-in"));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
    { rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach((el) => io.observe(el));
}
