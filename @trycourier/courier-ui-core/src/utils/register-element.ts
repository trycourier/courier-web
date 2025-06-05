export function registerElement(name: string, element: CustomElementConstructor) {
  if (typeof window !== 'undefined' && !customElements.get(name)) {
    customElements.define(name, element);
  }
}