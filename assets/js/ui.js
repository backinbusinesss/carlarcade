// Componenti condivisi: header, footer, card, showcase, mockup, icone.
import { SITE, PLATFORM_LABELS, LINK_TYPES, TRACKING } from "./config.js";

/* ---------------- Conversioni ---------------- */

/** Aggiunge i parametri UTM ai link verso i siti/app (non ai file da scaricare). */
export function outbound(url, type, appId) {
  if (!/^https:\/\//.test(url) || !["play", "site"].includes(type)) return url;
  try {
    const u = new URL(url);
    for (const [k, v] of Object.entries(TRACKING.utm)) if (!u.searchParams.has(k)) u.searchParams.set(k, v);
    if (!u.searchParams.has("utm_campaign")) u.searchParams.set("utm_campaign", appId);
    return u.toString();
  } catch { return url; }
}

/** Invia un evento all'analytics installato (Plausible, GA4, GTM). Silenzioso se assente. */
export function track(name, props = {}) {
  try {
    window.plausible?.(name, { props });
    window.gtag?.("event", name, props);
    window.dataLayer?.push({ event: name, ...props });
  } catch { /* nessun analytics */ }
}

/** Un listener unico per tutti gli elementi con data-track="evento" data-app="id" data-link="tipo". */
export function initTracking() {
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-track]");
    if (el) track(el.dataset.track, { app: el.dataset.app ?? "", link: el.dataset.link ?? "", where: el.dataset.where ?? "" });
  });
}

/** Piattaforma del visitatore, per consigliare il download giusto. */
export function detectPlatform() {
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Windows/i.test(ua)) return "windows";
  if (/Macintosh/i.test(ua)) return "mac";
  return "web";
}

/**
 * Il link migliore per questo visitatore.
 * Di default vince l'app web (parte subito, zero attrito); con preferNative
 * vince il download per il suo sistema, se esiste (usato per "Consigliato per te").
 */
export function bestLink(app, platform = detectPlatform(), { preferNative = false } = {}) {
  const l = app.links ?? {};
  if (preferNative && l[platform]) return { type: platform, url: l[platform] };
  if (l.play) return { type: "play", url: l.play };
  if (l[platform]) return { type: platform, url: l[platform] };
  if (l.site) return { type: "site", url: l.site };
  const first = Object.entries(l)[0];
  return first ? { type: first[0], url: first[1] } : null;
}

/** Escape per testo inserito in HTML. Tutti i dati di apps.json passano da qui. */
export const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/** Accetta solo link https o percorsi relativi (niente javascript:). */
export const safeUrl = (u = "") => (/^(https:\/\/|[a-z0-9./_-]+$)/i.test(u) ? esc(u) : "#");

const svg = (d, extra = "") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;

export const ICONS = {
  arrow: svg(`<path d="M5 12h14M13 6l6 6-6 6"/>`),
  play: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z"/></svg>`,
  download: svg(`<path d="M12 3v12M6 11l6 6 6-6M4 21h16"/>`),
  external: svg(`<path d="M7 17 17 7M8 7h9v9"/>`),
  globe: svg(`<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>`),
  windows: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5.5 10.5 4.5v7H3zM11.5 4.3 21 3v8.5h-9.5zM3 12.5h7.5v7L3 18.5zM11.5 12.5H21V21l-9.5-1.3z"/></svg>`,
  android: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 9.48 19.44 6.3a.5.5 0 0 0-.87-.5l-1.87 3.23A11.4 11.4 0 0 0 12 8c-1.7 0-3.3.37-4.7 1.03L5.43 5.8a.5.5 0 0 0-.87.5L6.4 9.48A10.8 10.8 0 0 0 1 18h22a10.8 10.8 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/></svg>`,
  apple: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46a4.2 4.2 0 0 0-3.32-1.8c-1.4-.14-2.75.83-3.46.83-.72 0-1.81-.81-2.98-.79a4.4 4.4 0 0 0-3.72 2.27c-1.6 2.77-.41 6.86 1.14 9.1.76 1.1 1.66 2.33 2.84 2.29 1.14-.05 1.57-.74 2.95-.74s1.77.74 2.97.71c1.23-.02 2-1.11 2.75-2.22a9.6 9.6 0 0 0 1.25-2.57 3.97 3.97 0 0 1-2.38-3.62zM14.1 5.86A3.95 3.95 0 0 0 15.03 3a4 4 0 0 0-2.6 1.35 3.76 3.76 0 0 0-.95 2.77 3.3 3.3 0 0 0 2.62-1.26z"/></svg>`,
  search: svg(`<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>`),
  check: svg(`<path d="M20 6 9 17l-5-5"/>`, 'class="i-check"'),
  code: svg(`<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>`),
  server: svg(`<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>`),
  spark: svg(`<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>`),
};

const LINK_ICON = { play: ICONS.play, site: ICONS.globe, windows: ICONS.windows, android: ICONS.android, ios: ICONS.apple, mac: ICONS.apple };
export const linkIcon = (type) => LINK_ICON[type] ?? ICONS.download;

/** Variabili CSS col brand dell'app, da mettere in style="". */
export function brandStyle(app) {
  const b = app.brand ?? {};
  const v = {
    "--c": app.color,
    "--app-bg": b.bg ?? "#111",
    "--app-bg2": b.bg2 ?? app.color,
    "--app-accent": b.accent ?? app.color,
    "--app-hl": b.highlight ?? "#fff",
    "--app-font": b.font ? `"${b.font}"` : "var(--font-display)",
  };
  return esc(Object.entries(v).map(([k, val]) => `${k}:${val}`).join(";"));
}

/* ---------------- Shell: header + footer ---------------- */
// Il footer si disegna a parte (renderFooter) dopo aver caricato il catalogo,
// perché elenca le app e i loro siti ufficiali.
export function renderShell(current = "") {
  const header = document.querySelector('[data-shell="header"]');
  if (header) {
    header.outerHTML = `
    <header class="site-header">
      <div class="container">
        <a class="logo" href="index.html" aria-label="${SITE.name}, home">
          <img src="assets/img/logo.svg" alt="" width="28" height="28">
          <span>${SITE.name}</span>
          <span class="logo__sub">by ${SITE.parent.name}</span>
        </a>
        <nav class="nav" aria-label="Principale">
          <a href="index.html#app" ${current === "apps" ? 'aria-current="page"' : ""}>App</a>
          <a href="index.html#catalogo" class="hide-md">Catalogo</a>
          <a href="chi-siamo.html" ${current === "about" ? 'aria-current="page"' : ""}>Chi siamo</a>
        </nav>
        <a class="btn btn-primary btn-sm header-cta" href="index.html#catalogo">Esplora</a>
      </div>
    </header>`;
    const h = document.querySelector(".site-header");
    const onScroll = () => h.classList.toggle("is-scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
}

export function renderFooter(apps = []) {
  const footer = document.querySelector('[data-shell="footer"]');
  if (!footer) return;
  const appLinks = apps.length
    ? apps.map((a) => `<li><a href="app.html?id=${encodeURIComponent(a.id)}">${esc(a.name)}</a></li>`).join("")
    : `<li><a href="index.html#catalogo">Tutte le app</a></li>`;
  const siteLinks = apps
    .filter((a) => a.links?.site)
    .map((a) => `<li><a href="${safeUrl(outbound(a.links.site, "site", a.id))}" target="_blank" rel="noopener" data-track="Apri app" data-app="${esc(a.id)}" data-link="site" data-where="footer">Sito ${esc(a.name)}</a></li>`)
    .join("");
  footer.outerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-brand">
        <a class="logo" href="index.html"><img src="assets/img/logo.svg" alt="" width="28" height="28"><span>${SITE.name}</span></a>
        <p>Quiz, giochi e strumenti utili. Progettati, sviluppati e ospitati da ${SITE.parent.name}.</p>
      </div>
      <div><h4>App</h4><ul>${appLinks}</ul></div>
      <div><h4>Siti ufficiali</h4><ul>${siteLinks || "<li>—</li>"}</ul></div>
      <div><h4>${SITE.name}</h4><ul>
        <li><a href="chi-siamo.html">Chi siamo</a></li>
        <li><a href="mailto:${SITE.contactEmail}">Contatti</a></li>
        <li><a href="${SITE.parent.url}" target="_blank" rel="noopener">${SITE.parent.name}</a></li>
      </ul></div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} CarlHost di Ulivi Nicolò · P.IVA IT14943820960</span>
        <nav class="footer-legal" aria-label="Note legali"><a href="privacy.html">Privacy</a><a href="cookie.html">Cookie</a><a href="termini.html">Termini d'uso</a></nav>
        <a class="carlhost-mark" href="${SITE.parent.url}" target="_blank" rel="noopener">Un progetto <strong>${SITE.parent.name}</strong></a>
      </div>
    </div>
  </footer>`;
}

/* ---------------- Pezzi riutilizzabili ---------------- */
export const statusBadge = (status, labels) =>
  `<span class="badge badge--${esc(status)}">${esc(labels[status] ?? status)}</span>`;

export const platformChips = (platforms = []) =>
  platforms.map((p) => `<span class="chip">${esc(PLATFORM_LABELS[p] ?? p)}</span>`).join("");

export const appUrl = (app) => `app.html?id=${encodeURIComponent(app.id)}`;

/** Bottone per un link dell'app, con UTM e tracking. variant: "app" (colore brand) | "ghost" | "primary". */
export function linkButton(type, url, variant = "ghost", size = "", { app, label, where = "" } = {}) {
  const t = LINK_TYPES[type] ?? { label: type };
  const href = app ? outbound(url, type, app.id) : url;
  return `<a class="btn btn-${variant} ${size}" href="${safeUrl(href)}" target="_blank" rel="noopener"
    data-track="${t.kind === "download" ? "Download" : "Apri app"}" data-app="${esc(app?.id ?? "")}" data-link="${esc(type)}" data-where="${esc(where)}">${linkIcon(type)}${esc(label ?? t.label)}</a>`;
}

/** Bottone principale "intelligente": per l'app, sul dispositivo del visitatore. */
export function primaryCta(app, { variant = "app", size = "btn-lg", where = "", label: forced } = {}) {
  const best = bestLink(app);
  if (!best) return `<span class="btn btn-${variant} ${size}" aria-disabled="true">${esc(app.cta ?? "In arrivo")}</span>`;
  const isDownload = LINK_TYPES[best.type]?.kind === "download";
  const label = isDownload ? LINK_TYPES[best.type].label : app.cta ?? LINK_TYPES[best.type]?.label;
  return linkButton(best.type, best.url, variant, size, { app, label: forced ?? label, where });
}

/** Righe di rassicurazione sotto le CTA. */
export const trustRow = (items) =>
  `<ul class="trust">${items.map((t) => `<li>${ICONS.check}${esc(t)}</li>`).join("")}</ul>`;

/** FAQ accessibile con <details>. */
export const faqList = (faq = []) =>
  `<div class="faq">${faq.map((f) => `<details class="faq__item"><summary>${esc(f.q)}<span aria-hidden="true">+</span></summary><p>${esc(f.a)}</p></details>`).join("")}</div>`;

/** Barra fissa in basso su mobile con le CTA principali. */
export function stickyBar(html) {
  const bar = document.createElement("div");
  bar.className = "sticky-cta";
  bar.innerHTML = html;
  document.body.appendChild(bar);
  const toggle = () => bar.classList.toggle("is-visible", scrollY > innerHeight * 0.6 && innerHeight + scrollY < document.body.scrollHeight - 200);
  addEventListener("scroll", toggle, { passive: true });
  toggle();
}

/** Mockup: telefoni se ci sono screenshot, altrimenti finestra browser con la cover. */
export function appVisual(app, { phones = 2 } = {}) {
  if (app.screens?.length) {
    return `<div class="phones">${app.screens.slice(0, phones).map((s) =>
      `<div class="phone"><img src="${safeUrl(s.src)}" alt="${esc(s.alt ?? "")}" loading="lazy"></div>`).join("")}</div>`;
  }
  if (app.cover) {
    const host = (app.links?.site ?? "").replace(/^https:\/\//, "").replace(/\/$/, "") || SITE.domain;
    return `<div class="browser"><div class="browser__bar"><i></i><i></i><i></i><span class="browser__url">${esc(host)}</span></div>
      <img src="${safeUrl(app.cover)}" alt="${esc(app.name)}: anteprima" loading="lazy"></div>`;
  }
  return "";
}

/** Card per la griglia del catalogo. */
export function appCard(app, catalog) {
  const soon = app.status === "soon";
  return `
  <article class="app-card ${soon ? "app-card--soon" : ""} reveal" style="${brandStyle(app)}">
    <div class="app-card__top">
      <img class="app-icon" src="${safeUrl(app.icon)}" alt="" width="56" height="56" loading="lazy">
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
    <div class="app-card__foot">
      <span>${soon ? "Scopri cosa arriva" : "Dettagli"} ${ICONS.arrow}</span>
      ${!soon && bestLink(app) ? `<span class="app-card__quick">${primaryCta(app, { variant: "app", size: "btn-sm", where: "card" })}</span>` : ""}
    </div>
    <a class="app-card__link" href="${appUrl(app)}" aria-label="${esc(app.name)}: dettagli"></a>
  </article>`;
}

/** Fascia grande con lo stile dell'app (usata in home). */
export function showcase(app, i) {
  const links = app.links ?? {};
  const site = links.site ? linkButton("site", links.site, "ghost", "btn-lg", { app, where: "showcase" }) : "";
  const stats = (app.stats ?? []).slice(0, 4)
    .map((s) => `<div><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join("");
  const perks = (app.features ?? []).slice(0, 3).map((f) => (typeof f === "string" ? f : f.title));
  return `
  <article class="showcase ${i % 2 ? "showcase--flip" : ""} reveal" style="${brandStyle(app)}" id="app-${esc(app.id)}">
    <div class="showcase__grid">
      <div class="showcase__copy">
        ${app.audience ? `<p class="showcase__audience">${esc(app.audience)}</p>` : ""}
        <div class="showcase__head">
          <img src="${safeUrl(app.icon)}" alt="" width="64" height="64">
          <h3 class="showcase__name">${esc(app.name)}</h3>
        </div>
        <p class="showcase__tagline">${esc(app.tagline)}</p>
        <p class="showcase__desc">${esc(app.description)}</p>
        ${stats ? `<div class="showcase__stats">${stats}</div>` : ""}
        <div class="showcase__actions">
          ${primaryCta(app, { where: "showcase" })}${site}
        </div>
        ${perks.length ? `<div class="showcase__perks">${trustRow(perks)}</div>` : ""}
        <a class="showcase__more" href="${appUrl(app)}">Scopri tutto su ${esc(app.name)} ${ICONS.arrow}</a>
      </div>
      <div class="showcase__visual">${appVisual(app)}</div>
    </div>
  </article>`;
}

/** Animazione leggera all'ingresso nello schermo. */
export function observeReveal(root = document) {
  const els = root.querySelectorAll(".reveal:not(.is-in)");
  if (!("IntersectionObserver" in window)) return els.forEach((el) => el.classList.add("is-in"));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
    { rootMargin: "0px 0px -6% 0px" }
  );
  els.forEach((el) => io.observe(el));
}
