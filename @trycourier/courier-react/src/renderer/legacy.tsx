import { ReactNode } from "react";
import * as ReactDOM from "react-dom";
import { flushSync } from 'react-dom';

export default class LegacyRenderer {

  public static render(node: ReactNode, container: HTMLElement) {
    // Use the render method from ReactDOM if available, otherwise fallback to createRoot
    if ('render' in ReactDOM) {
      (ReactDOM as any).render(node, container);
    } else {
      const root = (ReactDOM as any).createRoot(container);
      flushSync(() => {
        root.render(node);
      });
    }
  }

}