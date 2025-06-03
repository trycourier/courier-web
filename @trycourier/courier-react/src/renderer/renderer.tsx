import { ReactNode, version } from 'react';
import ModernRenderer from './modern';

export default class Renderer {
  private static reactVersion = parseInt(version.split('.')[0]);

  public static async render(node: ReactNode, container: HTMLElement) {
    if (Renderer.reactVersion >= 18) {
      ModernRenderer.render(node, container);
    } else {
      // TODO: Solve bugs with React 17
      const { default: LegacyRenderer } = await import('./legacy');
      LegacyRenderer.render(node, container);
    }
  }
}