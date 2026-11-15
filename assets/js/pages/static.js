// Pagine senza dati propri (chi siamo, 404): header, footer con le app, animazioni.
import { loadCatalog, sortApps } from "../data.js";
import { renderShell, renderFooter, observeReveal } from "../ui.js";

renderShell(document.body.dataset.page ?? "");
try {
  renderFooter(sortApps((await loadCatalog()).apps));
} catch {
  renderFooter();
}
observeReveal();
