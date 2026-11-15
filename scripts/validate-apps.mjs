#!/usr/bin/env node
// Controlla data/apps.json prima del deploy: campi obbligatori, id unici,
// icone esistenti, link https. Uso: node scripts/validate-apps.mjs
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "data", "apps.json");
const errors = [];

let data;
try {
  data = JSON.parse(readFileSync(file, "utf8"));
} catch (e) {
  console.error(`✗ data/apps.json non è JSON valido: ${e.message}`);
  process.exit(1);
}

const REQUIRED = ["id", "name", "tagline", "description", "category", "status", "color", "icon", "platforms", "links"];
const STATUSES = Object.keys(data.statuses ?? {});
const CATEGORIES = Object.keys(data.categories ?? {});
const PLATFORMS = ["web", "android", "ios", "windows", "mac", "linux"];
const LINK_TYPES = ["play", "site", "android", "ios", "windows", "mac"];
const seen = new Set();

for (const [i, app] of (data.apps ?? []).entries()) {
  const at = `apps[${i}]${app.id ? ` (${app.id})` : ""}`;
  for (const k of REQUIRED) if (app[k] === undefined || app[k] === "") errors.push(`${at}: manca "${k}"`);
  if (app.id && !/^[a-z0-9-]+$/.test(app.id)) errors.push(`${at}: id deve essere minuscolo con trattini`);
  if (seen.has(app.id)) errors.push(`${at}: id duplicato`);
  seen.add(app.id);
  if (app.status && !STATUSES.includes(app.status)) errors.push(`${at}: status "${app.status}" non è tra ${STATUSES.join(", ")}`);
  if (app.category && !CATEGORIES.includes(app.category)) errors.push(`${at}: categoria "${app.category}" non esiste in "categories"`);
  if (app.color && !/^#[0-9a-fA-F]{6}$/.test(app.color)) errors.push(`${at}: color deve essere tipo #ff4d8d`);
  if (app.icon && !existsSync(join(root, app.icon))) errors.push(`${at}: icona non trovata: ${app.icon}`);
  for (const p of app.platforms ?? []) if (!PLATFORMS.includes(p)) errors.push(`${at}: piattaforma sconosciuta "${p}"`);
  for (const [type, url] of Object.entries(app.links ?? {})) {
    if (!LINK_TYPES.includes(type)) errors.push(`${at}: tipo di link sconosciuto "${type}"`);
    if (!/^https:\/\//.test(url)) errors.push(`${at}: il link "${type}" deve iniziare con https://`);
  }
  if (app.status === "live" && !Object.keys(app.links ?? {}).length) errors.push(`${at}: un'app "live" deve avere almeno un link`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} errori in data/apps.json:\n` + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✓ data/apps.json ok — ${data.apps.length} app`);
