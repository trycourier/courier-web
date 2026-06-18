import type { EmbeddedViewRef, TemplateRef, ViewContainerRef } from "@angular/core";

/**
 * Renders an Angular `TemplateRef` into a detached `HTMLElement`.
 *
 * Courier's Angular package renders as follows:
 *
 *   - Angular engine (client application)
 *     - Courier Angular components
 *       - Courier web components
 *         - [Optional] User-provided Angular templates (ex. a list item)
 *
 * The Courier web components request custom content via a `(props) => HTMLElement`
 * factory. We bridge that to Angular by instantiating an embedded view from the
 * caller's `<ng-template>` and handing back its root nodes wrapped in a container.
 *
 * The container uses `display: contents` so it is transparent to CSS layout. The
 * returned `EmbeddedViewRef` must be tracked by the caller and destroyed on
 * component teardown.
 */
export function templateToHTMLElement<C>(
  viewContainerRef: ViewContainerRef,
  templateRef: TemplateRef<C>,
  context: C
): { element: HTMLElement; view: EmbeddedViewRef<C> } {
  const view = viewContainerRef.createEmbeddedView(templateRef, context);
  view.detectChanges();

  const container = document.createElement("div");
  container.style.display = "contents";
  container.setAttribute("data-courier-angular-root", "true");
  for (const node of view.rootNodes) {
    container.appendChild(node as Node);
  }

  return { element: container, view };
}
