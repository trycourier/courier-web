import { ReactNode } from "react";
import * as ReactDOM from "react-dom";

let client: any | null = null;
const { flushSync } = ReactDOM as any;

/**
 * Converts React node to HTMLElement with synchronous updates
 */
export function reactNodeToHTMLElement(node: ReactNode): HTMLElement {
  const container = document.createElement("div");
  flushSync(() => renderCompat(node, container));
  return container;
}

export async function renderCompat(
  node: ReactNode,
  container: HTMLElement
): Promise<void> {
  let createRoot = (ReactDOM as any).createRoot;

  if (!createRoot) {
    try {
      if (client === null) {
        client = await import("react-dom/client");
      }
      createRoot = client.createRoot;
    } catch {
      /* React 18+ only */
    }
  }

  if (typeof createRoot === "function") {
    createRoot(container).render(node);
  } else if (typeof (ReactDOM as any).render === "function") {
    (ReactDOM as any).render(node, container);
  } else {
    throw new Error(
      "Neither ReactDOM.createRoot nor ReactDOM.render is available - " +
      "check your react-dom version."
    );
  }
}