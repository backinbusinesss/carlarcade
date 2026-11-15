# Aggiungere una nuova app

Tre passi, nessun codice da toccare. La home crea da sola la fascia dell'app con i suoi colori, la card nel catalogo, la pagina di dettaglio e i link nel footer.

## 1. Gli asset

Crea la cartella `assets/img/apps/<id>/` (`<id>` = nome in minuscolo con trattini, es. `memory-match`) e mettici:

| File | Cosa | Da dove prenderlo |
|---|---|---|
| `icon.png` | Icona ufficiale, 512×512 | L'icona PWA/app store dell'app (`icon-512.png`) |
| `cover.png` | Anteprima 1200×630 | L'immagine social del sito dell'app (`og.png`) |
| `*.webp` | Screenshot verticali del telefono (facoltativi) | Catture dall'app |

Con **2 o più screenshot** la home mostra due telefoni; senza, mostra la `cover` in una finestra del browser.
Con **3 o più** la pagina dell'app ha anche la galleria "Dai un'occhiata".

## 2. La voce nel catalogo

Apri `data/apps.json` e aggiungi un oggetto nella lista `apps`:

```json
{
  "id": "memory-match",
  "name": "Memory Match",
  "tagline": "Trova le coppie prima che scada il tempo.",
  "description": "Descrizione di 2-3 frasi, mostrata in home e nella pagina dell'app.",
  "category": "quiz",
  "status": "live",
  "featured": true,
  "color": "#ff8a3d",
  "brand": {
    "bg": "#1f0f05",
    "bg2": "#9a3412",
    "accent": "#fb923c",
    "highlight": "#fde68a",
    "font": "Nunito"
  },
  "icon": "assets/img/apps/memory-match/icon.png",
  "cover": "assets/img/apps/memory-match/cover.png",
  "screens": [
    { "src": "assets/img/apps/memory-match/home.webp", "alt": "Schermata iniziale" }
  ],
  "platforms": ["web", "android"],
  "links": {
    "play": "https://memory.esempio.com/app/",
    "site": "https://memory.esempio.com/"
  },
  "stats": [
    { "label": "Livelli", "value": "30" }
  ],
  "features": [
    { "title": "Classifica settimanale", "text": "Sfida gli amici ogni settimana." }
  ]
}
```

### I campi

| Campo | Obbligatorio | Cosa mettere |
|---|---|---|
| `id` | sì | Minuscolo con trattini. Diventa l'indirizzo `app.html?id=memory-match` |
| `name`, `tagline`, `description` | sì | Usa gli stessi testi del sito ufficiale dell'app |
| `category` | sì | Una chiave di `categories` in cima al file. Per una nuova, aggiungila lì |
| `status` | sì | `live`, `beta`, `soon`. Solo le `live` hanno la fascia grande in home |
| `featured` | no | `false` per tenere un'app `live` solo nel catalogo |
| `color` | sì | Colore principale: bagliori di card e dock |
| `brand` | no | **Lo stile dell'app**, preso dal suo CSS: `bg` e `bg2` (gradiente di sfondo, scuri), `accent` (bottone e numeri), `highlight` (tagline), `font` (font Google del nome) |
| `icon`, `cover`, `screens` | icon sì | Vedi passo 1 |
| `platforms` | sì | Tra `web`, `android`, `ios`, `windows`, `mac`, `linux` |
| `links` | sì | `{}` se in arrivo. Tipi: `play` (apri l'app), `site` (sito ufficiale), `windows`, `android`, `ios`, `mac` |
| `stats` | no | Fino a 4 numeri in evidenza |
| `features` | no | Funzioni, con `title` e `text` |

> **Font del brand**: se usi un font che non è già caricato (oggi: Inter, Inter Tight, Nunito), aggiungilo al link di Google Fonts nell'`<head>` di `index.html` e `app.html`.

## 3. Controlla e pubblica

```bash
npm run validate
npm run dev        # http://localhost:5173
```

Aggiungi l'URL della nuova pagina in `sitemap.xml`, poi commit e push su `main` (o apri una pull request). Il controllo automatico blocca il deploy se manca un file o un campo.
