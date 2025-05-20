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

  // Use flushSync to ensure the DOM is updated synchronously
  flushSync(() => {
    const root = createRoot(container);
    root.render(<>{node}</>);
  });

  return container;
}