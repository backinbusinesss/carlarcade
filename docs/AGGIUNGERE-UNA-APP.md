# Aggiungere una nuova app

Tre passi, nessun codice da toccare.

## 1. L'icona

Metti un'icona quadrata in `assets/img/apps/<id>.svg` (va bene anche `.png`, almeno 256×256).
`<id>` è il nome dell'app in minuscolo con i trattini, per esempio `memory-match`.

## 2. La voce nel catalogo

Apri `data/apps.json` e aggiungi un oggetto nella lista `apps`:

```json
{
  "id": "memory-match",
  "name": "Memory Match",
  "tagline": "Trova le coppie prima che scada il tempo.",
  "description": "Descrizione più lunga, 2-3 frasi, mostrata nella pagina dell'app.",
  "category": "quiz",
  "status": "beta",
  "featured": false,
  "color": "#ff8a3d",
  "icon": "assets/img/apps/memory-match.svg",
  "platforms": ["web"],
  "links": {
    "play": "https://esempio.com/memory/"
  },
  "stats": [
    { "label": "Livelli", "value": "30" }
  ],
  "features": [
    "Classifica settimanale",
    "Modalità a due giocatori"
  ]
}
```

### I campi

| Campo | Obbligatorio | Cosa mettere |
|---|---|---|
| `id` | sì | Minuscolo con trattini. Diventa l'indirizzo: `app.html?id=memory-match` |
| `name` | sì | Nome dell'app |
| `tagline` | sì | Una frase breve, appare sulla card |
| `description` | sì | 2-3 frasi per la pagina dell'app |
| `category` | sì | Una chiave di `categories` in cima al file (`quiz`, `studio`, `community`). Per una categoria nuova, aggiungila lì |
| `status` | sì | `live` (disponibile), `beta`, `soon` (in arrivo) |
| `color` | sì | Colore dell'app in esadecimale, usato per bagliori e accenti |
| `icon` | sì | Percorso dell'icona |
| `platforms` | sì | Tra `web`, `android`, `ios`, `windows`, `mac`, `linux` |
| `links` | sì | Può essere vuoto `{}` se l'app è in arrivo. Tipi: `play`, `site`, `android`, `ios`, `windows`, `mac`. Il **primo** link diventa il bottone principale |
| `stats` | no | Numeri da mettere in evidenza |
| `features` | no | Punti di forza, uno per riga |
| `featured` | no | Per un uso futuro (app in vetrina) |

## 3. Controlla e pubblica

```bash
npm run validate
npm run dev        # guarda il risultato su http://localhost:5173
```

Aggiungi anche l'URL della nuova pagina in `sitemap.xml`. Poi commit e push su `main` (o apri una pull request).

## Passare un'app da "in arrivo" a "disponibile"

Cambia `"status": "soon"` in `"live"` e aggiungi almeno un link in `links`. Il controllo automatico blocca un'app `live` senza link.
