export class CourierElement extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  // Build the element with a factory function
  public build(newElement: HTMLElement | undefined | null) {
    if (newElement === null) {
      this.shadow.replaceChildren();
      return;
    }
    const element = newElement ?? this.defaultElement();
    this.shadow.replaceChildren(element);
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

}
