// Pagine senza dati (chi siamo, 404): solo header, footer e animazioni.
import { renderShell, observeReveal } from "../ui.js";

renderShell(document.body.dataset.page ?? "");
observeReveal();
