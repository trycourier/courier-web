import { ReactNode } from "react";
import Renderer from "../renderer/renderer";

/**
 * Converts React node to HTMLElement with synchronous updates
 */
export function reactNodeToHTMLElement(node: ReactNode): HTMLElement {
  const container = document.createElement('div');
  Renderer.render(node, container);
  return container;
}