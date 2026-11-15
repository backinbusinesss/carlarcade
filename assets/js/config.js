// Configurazione globale del sito. Modifica qui nome, brand e contatti.
export const SITE = {
  name: "CarlArcade",
  domain: "carlarcade.com",
  tagline: "Le app di Carlhost, in un unico posto.",
  parent: { name: "Carlhost", url: "https://carlhost.com" },
  contactEmail: "info@carlhost.com",
  dataUrl: "data/apps.json",
};

// Misurazione delle conversioni.
// - utm: aggiunto ai link "play" e "site" verso le app, così nelle statistiche
//   di ogni app si vede quante visite arrivano da CarlArcade.
// - I click sui bottoni (data-track) vengono inviati a Plausible, GA4 (gtag)
//   o Google Tag Manager (dataLayer) se uno di questi è installato nella pagina.
export const TRACKING = {
  utm: { utm_source: "carlarcade", utm_medium: "referral" },
};

// Etichette leggibili per le piattaforme.
export const PLATFORM_LABELS = {
  web: "Browser",
  android: "Android",
  ios: "iPhone",
  windows: "Windows",
  mac: "Mac",
  linux: "Linux",
};

// Come mostrare ciascun tipo di link in apps.json -> links.
// "kind" decide lo stile: play = bottone principale, site = sito ufficiale, download = scaricabile.
export const LINK_TYPES = {
  play:    { label: "Apri l'app",          short: "Gioca nel browser", kind: "play",     note: "Nessuna installazione" },
  site:    { label: "Sito ufficiale",      short: "Sito ufficiale",    kind: "site",     note: "Tutte le info sull'app" },
  windows: { label: "Scarica per Windows", short: "Windows",           kind: "download", note: "Windows 10 e 11" },
  android: { label: "Scarica per Android", short: "Android",           kind: "download", note: "File APK" },
  ios:     { label: "Scarica per iPhone",  short: "iPhone",            kind: "download", note: "App Store" },
  mac:     { label: "Scarica per Mac",     short: "Mac",               kind: "download", note: "macOS" },
};
