export class CourierInfoState extends HTMLElement {
  private container: HTMLElement;
  private titleElement: HTMLElement;
  private button: HTMLElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    this.container = document.createElement('div');
    this.titleElement = document.createElement('h2');
    this.button = document.createElement('courier-button');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        width: 100%;
      }

      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        text-align: center;
      }

      h2 {
        margin: 0;
        color: var(--courier-text-primary, #111827);
        font-size: 16px;
        font-weight: 500;
      }
    `;

    this.container.className = 'container';
    shadow.appendChild(style);
    shadow.appendChild(this.container);
    this.container.appendChild(this.titleElement);
    this.container.appendChild(this.button);
  }

  static get observedAttributes() {
    return ['title', 'button-text', 'button-variant', 'button-size'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'title':
        this.titleElement.textContent = newValue || '';
        break;
      case 'button-text':
        this.button.textContent = newValue || '';
        break;
      case 'button-variant':
        this.button.setAttribute('variant', newValue || 'primary');
        break;
      case 'button-size':
        this.button.setAttribute('size', newValue || 'medium');
        break;
    }
  }
}

// Register the custom element
if (!customElements.get('courier-info-state')) {
  customElements.define('courier-info-state', CourierInfoState);
}
