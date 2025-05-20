import { ReactNode } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

// A tiny global registry for web-component -> React callbacks
let cbSeed = 0;

/**
 * Turns a real function into a string the custom element can execute.
 * The function itself is stored on `window` so it still has access to
 * React-side variables that were in scope when it was created.
 */
export const serializeHandler = <T extends Function>(
  fn?: T
): string | undefined => {
  if (!fn) return undefined;

  const key = `__courier_cb_${++cbSeed}`;
  (window as any)[key] = fn;          // keep the closure alive
  return `window['${key}'](props)`;   // what the attribute will execute
};

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