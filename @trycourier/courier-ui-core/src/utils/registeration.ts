export function registerElement(element: CustomElementConstructor & { id: string }) {
  if (typeof window !== 'undefined' && !customElements.get(element.id)) {
    customElements.define(element.id, element);
  }
}

export function injectGlobalStyle(styleId: string, styles: string): HTMLStyleElement {
  // Inject component-scoped styles just once per document
  const selector = `style[data-${styleId}]`;
  const existingStyle = document.querySelector(selector) as HTMLStyleElement;

  if (!existingStyle) {
    const style = document.createElement('style');
    style.setAttribute(`data-${styleId}`, '');
    style.textContent = styles;
    document.head.appendChild(style);
    return style;
  }

  return existingStyle;
}