import { ReactNode } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

export function reactNodeToHTMLElement(node: ReactNode): HTMLElement {
  const container = document.createElement('div');

  // Use React 18 root
  const root = createRoot(container);
  flushSync(() => {
    root.render(node);
  });

  /**
   * If React rendered a single root element, return that element directly so we
   * don't introduce an extra wrapper <div> into the caller's DOM structure.
   *
   * The React root stays attached to `container`, but since these rendered
   * nodes are treated as static content by our web components (we don't call
   * `render` again), it's safe to move the child into its final parent.
   */
  const onlyChild = container.firstElementChild as HTMLElement | null;
  if (onlyChild && container.childElementCount === 1) {
    return onlyChild;
  }

  // Fallback: if there are multiple children, preserve the container wrapper
  // to maintain React's event handling and DOM structure.
  return container;
}
