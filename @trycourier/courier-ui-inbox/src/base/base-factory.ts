export class CourierElementFactory {
  protected shadowRoot?: ShadowRoot;
  private factory?: () => HTMLElement;

  constructor() {
    this.shadowRoot = this.createShadowRoot();
  }

  private createShadowRoot(): ShadowRoot {
    const root = document.createElement('div').attachShadow({ mode: 'open' });
    return root;
  }

  // Build the element with a factory function
  public build(id?: string, factory?: () => HTMLElement): HTMLElement {
    this.factory = factory;
    const element = factory?.() ?? this.defaultElement();
    if (id) {
      element.id = id;
    }
    this.replaceElement(element);
    return element;
  }

  // Default element to be used if no factory is provided
  public defaultElement(): HTMLElement {
    const element = document.createElement('div');
    element.textContent = 'Default Element Factory';
    element.style.cssText = `
      background-color: red;
      text-align: center;
      padding: 12px;
    `;
    return element;
  }

  protected replaceElement(element: HTMLElement) {
    this.shadowRoot?.replaceChildren(element);
  }
}

export class ExampleElementFactory extends CourierElementFactory {
  defaultElement(): HTMLElement {
    const element = document.createElement('div');
    element.textContent = 'Example Item';
    element.style.cssText = `
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      background-color: blue;
      color: white;
    `;
    return element;
  }
}
