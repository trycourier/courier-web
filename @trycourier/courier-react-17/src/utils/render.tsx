import { ReactNode } from "react";
import { render } from "react-dom";

/**
 * Converts a React node to an HTMLElement.
 * @param node - The React node to convert.
 * @returns The converted HTMLElement.
 */
export function reactNodeToHTMLElement(node: ReactNode): HTMLElement {
  const container = document.createElement('div');

  render(node, container);

  return container;
}
