import { ReactNode } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

/**
 * Converts a React node to an HTMLElement.
 * This function uses flushSync to ensure the DOM is updated synchronously.
 * @param node - The React node to convert.
 * @returns The converted HTMLElement.
 */
export function reactNodeToHTMLElement(node: ReactNode): HTMLElement {
  const container = document.createElement('div');

  // Use React 18 root
  const root = createRoot(container);
  flushSync(() => {
    root.render(node);
  });

  // Return the container to preserve React's event handling
  // The container maintains the React root and event delegation
  return container;
}
