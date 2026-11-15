# Pubblicazione e dominio

## Come va online

Il sito è pubblicato con **GitHub Pages** tramite GitHub Actions (`.github/workflows/deploy.yml`):

1. push su `main`
2. parte il controllo `scripts/validate-apps.mjs`
3. se passa, il sito viene caricato su Pages

Lo stato si vede nella tab **Actions** del repository.

Finché il dominio non è collegato, il sito è su `https://<utente>.github.io/carlarcade/`.
Tutti i percorsi sono relativi, quindi funziona sia lì sia su `carlarcade.com`.

## Collegare carlarcade.com

### 1. DNS (dal pannello del registrar del dominio)

Per il dominio principale `carlarcade.com`, quattro record **A**:

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
```

Per `www.carlarcade.com`, un record **CNAME**:

```
CNAME www  <utente>.github.io
```

### 2. GitHub

Repository → **Settings → Pages → Custom domain** → scrivi `carlarcade.com` → Save.
Quando il controllo DNS è verde, spunta **Enforce HTTPS**.

> Imposta il dominio su GitHub **dopo** aver configurato i DNS: altrimenti l'indirizzo github.io rimanda a un dominio che ancora non risponde.

Il file `CNAME` nella root serve come promemoria del dominio; con il deploy via Actions conta l'impostazione in Settings → Pages.

## Ospitarlo altrove

Essendo statico, va bene qualsiasi hosting (Netlify, Vercel, Cloudflare Pages, un server Apache/Nginx di Carlhost).
Carica questi file e cartelle: `index.html app.html chi-siamo.html 404.html robots.txt sitemap.xml assets/ data/`.
