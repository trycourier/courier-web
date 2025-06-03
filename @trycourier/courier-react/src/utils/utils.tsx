import { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";

/**
 * Converts a React node to an HTMLElement.
 * This function uses flushSync to ensure the DOM is updated synchronously.
 * @param node - The React node to convert.
 * @returns The converted HTMLElement.
 */
export function reactNodeToHTMLElement(node: ReactNode): HTMLElement {
  const container = document.createElement('div');

  // Use flushSync to ensure the DOM is updated synchronously
  flushSync(() => {
    render(node, container);
  });

  return container;
}

/**
 * Render a React node using createRoot.
 * @param node - The React node to render.
 * @param container - The container to render the node into.
 * @returns The rendered node.
 */
function render(node: ReactNode, container: HTMLElement) {
  const root = createRoot(container);
  return root.render(node);
}