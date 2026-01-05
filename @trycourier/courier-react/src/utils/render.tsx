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
   * Always return the container to preserve React's event delegation system.
   * React uses event delegation at the root level, so the React root container
   * must stay in the DOM for event handlers to work.
   * 
   * We use `display: contents` to make the container transparent to CSS layout,
   * so it doesn't introduce a visual wrapper while still preserving React's
   * event system.
   */
  container.style.display = 'contents';
  container.setAttribute('data-react-root', 'true');
  return container;
}
