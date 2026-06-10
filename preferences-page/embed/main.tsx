import { createRoot } from "react-dom/client";
import { PreferencesUI } from "../app/p/[encodedId]/preferences-ui";

/**
 * Embed entry point. Built into a single self-contained IIFE
 * (`dist/hosted-preferences.js`, see `scripts/build-embed.mjs`) that the backend
 * inlines into the hosted-preferences HTML. The backend mints the JWT and writes
 * `window.courierConfig` before this runs; we just read it and mount the page
 * into `<div id="courier-preferences">`.
 */
function mount() {
  const config = window.courierConfig;
  const target = document.getElementById("courier-preferences");

  if (!target) {
    console.error("[hosted-preferences] missing #courier-preferences mount node");
    return;
  }
  if (!config?.authorization || !config.userId) {
    target.textContent =
      "Internal Server Error, please contact your administrator.";
    console.error("[hosted-preferences] missing or invalid window.courierConfig");
    return;
  }

  createRoot(target).render(<PreferencesUI config={config} />);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
