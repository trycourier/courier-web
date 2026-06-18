import { createApp, type App, type VNodeChild } from "vue";

// Tracks the Vue app instance mounted into each container so it can be torn down.
const mountedApps = new WeakMap<HTMLElement, App>();

/**
 * Renders a Vue node into a detached `HTMLElement`.
 *
 * Courier's Vue package renders as follows:
 *
 *   - Vue engine (client application)
 *     - Courier Vue components
 *       - Courier web components
 *         - [Optional] User-provided Vue nodes (ex. a list item)
 *
 * By default, Vue will not render the user-provided nodes inside Courier's web
 * components. We instead mount a standalone Vue app per node and hand the
 * resulting element to the web component's render factory.
 *
 * The container uses `display: contents` so it is transparent to CSS layout —
 * it doesn't introduce a visual wrapper while still hosting the Vue app.
 */
export function vNodeToHTMLElement(node: VNodeChild): HTMLElement {
  const container = document.createElement("div");

  const app = createApp({ render: () => node });
  app.mount(container);

  container.style.display = "contents";
  container.setAttribute("data-courier-vue-root", "true");
  mountedApps.set(container, app);

  return container;
}

/**
 * Unmounts a Vue app previously mounted by {@link vNodeToHTMLElement}.
 *
 * The web components own the lifecycle of the elements they request from a
 * render factory, so this is exposed for advanced cleanup but is not required
 * in typical usage.
 */
export function unmountHTMLElement(container: HTMLElement): void {
  const app = mountedApps.get(container);
  if (app) {
    app.unmount();
    mountedApps.delete(container);
  }
}
