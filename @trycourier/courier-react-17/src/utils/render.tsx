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

  const element = container.firstElementChild;
  if (!(element instanceof HTMLElement)) {
    throw new Error(
      'reactNodeToHTMLElement must return a single JSX element that renders to an HTMLElement (e.g., <div>)'
    );
  }

  return element;
}
