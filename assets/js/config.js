// Configurazione globale del sito. Modifica qui nome, brand e link social.
export const SITE = {
  name: "CarlArcade",
  domain: "carlarcade.com",
  tagline: "Giochi e app fatte a mano.",
  parent: { name: "Carlhost", url: "https://carlhost.com" },
  contactEmail: "info@carlhost.com",
  dataUrl: "data/apps.json",
};

// Etichette leggibili per le piattaforme (usate su card e pagina app).
export const PLATFORM_LABELS = {
  web: "Web",
  android: "Android",
  ios: "iOS",
  windows: "Windows",
  mac: "macOS",
  linux: "Linux",
};

// Testo dei bottoni per ciascun tipo di link in apps.json -> links.
export const LINK_LABELS = {
  play: "Gioca ora",
  site: "Sito ufficiale",
  android: "Scarica per Android",
  ios: "Scarica per iOS",
  windows: "Scarica per Windows",
  mac: "Scarica per macOS",
};
