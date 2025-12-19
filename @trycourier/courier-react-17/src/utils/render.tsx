import { ReactNode } from "react";
import { render } from "react-dom";

export function reactNodeToHTMLElement(node: ReactNode): HTMLElement {
  const container = document.createElement('div');

  // React 17's `render` typings expect a ReactElement or an array, while our
  // helper intentionally accepts the broader `ReactNode` (matching how we use
  // it throughout the SDK). Cast here to satisfy the overload without changing
  // runtime behavior.
  render(node as any, container);

  /**
   * If React rendered a single root element, return that element directly so we
   * don't introduce an extra wrapper <div> into the caller's DOM structure.
   */
  const onlyChild = container.firstElementChild as HTMLElement | null;
  if (onlyChild && container.childElementCount === 1) {
    return onlyChild;
  }

  return container;
}
