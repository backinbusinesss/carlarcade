# CarlArcade

Il portale di giochi e app di **[Carlhost](https://carlhost.com)**, per **carlarcade.com**.
Raccoglie in un unico posto tutte le app, ognuna presentata col proprio stile e collegata al suo sito ufficiale:

- **PatenteQuest**: quiz patente per gioco. [Sito](https://patentequest-acdf10.web.app/)
- **Indovina Tutto**: il quiz su tutto. [Sito](https://backinbusinesss.github.io/indovina-tutto/)
- **Baratto Skill**: scambio di competenze, in anteprima. [Sito](https://backinbusinesss.github.io/baratto-skill/)

Sito statico: HTML, CSS e JavaScript puro. **Niente build, niente framework, niente database.**
Per aggiungere un'app basta modificare un file JSON.

---

## Avvio in locale

Serve solo [Node.js](https://nodejs.org) (20 o più recente).

```bash
npm run dev        # apre il sito su http://localhost:5173
npm run validate   # controlla data/apps.json
```

> Aprire `index.html` con doppio clic **non funziona**: il catalogo si carica con `fetch`, che richiede un server.

## Struttura

```
carlarcade/
├── index.html              Home: hero, catalogo con filtri e ricerca
├── app.html                Pagina di una singola app  →  app.html?id=<id>
├── chi-siamo.html          Chi siamo
├── 404.html                Pagina "Game over"
│
├── data/
│   ├── apps.json           ★ IL CATALOGO: qui si aggiungono/modificano le app
│   └── apps.schema.json    Lo schema (l'editor ti suggerisce i campi)
│
├── assets/
│   ├── css/
│   │   ├── main.css        Importa tutti gli altri, nell'ordine giusto
│   │   ├── tokens.css      ★ Colori, font, misure del brand
│   │   ├── base.css        Reset e stili generali
│   │   ├── components.css  Header, footer, bottoni, badge, card, filtri
│   │   └── pages.css       Stili specifici di home, pagina app, pagine testo
│   ├── js/
│   │   ├── config.js       ★ Nome sito, brand, email, etichette
│   │   ├── data.js         Caricamento e filtri del catalogo
│   │   ├── ui.js           Header, footer, card: componenti condivisi
│   │   └── pages/          Uno script per pagina (home, app, static)
│   └── img/
│       ├── logo.svg
│       └── apps/<id>/      Icona, cover e screenshot ufficiali di ogni app
│
├── scripts/validate-apps.mjs   Controllo automatico del catalogo
├── .github/workflows/deploy.yml  Valida e pubblica su GitHub Pages a ogni push su main
├── docs/                   Guide: aggiungere un'app, dominio, convenzioni
├── CNAME                   carlarcade.com
├── robots.txt, sitemap.xml
└── package.json            Solo comandi di comodo, nessuna dipendenza
```

I file con ★ sono quelli che si modificano più spesso.

## Guide

- [Aggiungere una nuova app](docs/AGGIUNGERE-UNA-APP.md)
- [Pubblicazione e dominio carlarcade.com](docs/DEPLOY.md)
- [Come lavorare insieme sul repository](CONTRIBUTING.md)

## Pubblicazione

Ogni push su `main` passa dal controllo di `data/apps.json` e, se è tutto ok, va online da solo su GitHub Pages.
Le pull request vengono solo controllate, non pubblicate.

---

Un progetto **Carlhost**.

## Conversioni e statistiche

- **Bottoni principali**: aprono l'app web (parte subito); nella pagina dell'app il download per il dispositivo del visitatore è evidenziato come "Consigliato per te".
- **UTM**: i link verso app e siti ufficiali hanno `utm_source=carlarcade&utm_medium=referral&utm_campaign=<id-app>`, così nelle statistiche di ogni app si vede il traffico che arriva da qui. Si configura in `assets/js/config.js`.
- **Eventi di click** (`Apri app`, `Download`, `Avvisami`, con app, tipo di link e posizione): partono da soli verso Plausible, GA4 o Google Tag Manager appena uno dei loro script viene aggiunto nell'`<head>` delle pagine. Senza analytics installato non succede nulla.
