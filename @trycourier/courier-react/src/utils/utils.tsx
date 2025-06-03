import { ReactNode, version } from "react";
import ReactDOM, { flushSync } from "react-dom";

const reactVersion = parseInt(version.split('.')[0]);

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
 * Render a React node with compatibility for React 17 and 18+ (createRoot).
 * See https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
 * for compatibility details
 *
 * @param node - The React node to render.
 * @param container - The container to render the node into.
 * @returns The rendered node.
 */
function render(node: ReactNode, container: HTMLElement) {
  // Check if createRoot is a function (React 18+)
  if (reactVersion >= 18) {
    // Lazy load createRoot from react-dom/client
    import('react-dom/client').then(({ createRoot }) => {
      if (createRoot instanceof Function) {
        const root = createRoot(container);
        return root.render(node);
      }
    });
  }

  // Fallback to render (React 17)
  const render = (ReactDOM as any)["render"];
  return render(node, container);
}