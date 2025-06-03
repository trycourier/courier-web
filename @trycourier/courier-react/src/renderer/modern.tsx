import { ReactNode } from "react";
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';

export default class ModernRenderer {

  public static render(node: ReactNode, container: HTMLElement) {
    flushSync(() => {
      const root = createRoot(container);
      root.render(node);
    });
  }

}