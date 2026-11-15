# Lavorare insieme

## Flusso consigliato

1. Aggiorna: `git pull`
2. Crea un branch: `git checkout -b nuova-app-memory`
3. Fai le modifiche e controlla: `npm run validate` e `npm run dev`
4. Commit e push del branch, poi apri una **pull request** su GitHub
5. L'altro dà un'occhiata e fa merge su `main` → il sito si aggiorna da solo

Per piccole correzioni (un testo, un link) va bene anche lavorare direttamente su `main`.

## Convenzioni

- **Lingua del sito:** italiano. Frasi brevi, tono diretto.
- **Colori e font** solo in `assets/css/tokens.css`, mai valori sparsi nei componenti.
- **Testi dei componenti condivisi** (header, footer) in `assets/js/ui.js`; dati del sito in `assets/js/config.js`.
- **Un'app = una voce in `data/apps.json` + un'icona.** Nessuna pagina HTML nuova per singola app.
- **Niente dipendenze npm** se non indispensabili: il sito deve restare apribile e modificabile senza build.
- Nomi file in minuscolo con trattini.

## Messaggi di commit

Brevi, al presente: `Aggiunge Memory Match`, `Corregge link PatenteQuest Android`.
