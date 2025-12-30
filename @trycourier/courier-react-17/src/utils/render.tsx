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
