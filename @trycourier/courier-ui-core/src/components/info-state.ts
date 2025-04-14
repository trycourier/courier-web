export class CourierInfoState extends HTMLElement {
  private container: HTMLElement;
  private titleElement: HTMLElement;
  private button: HTMLElement;
  private buttonClickCallback: (() => void) | null = null;

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
        height: 100%;
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

    this.button.addEventListener('click', () => {
      if (this.buttonClickCallback) {
        this.buttonClickCallback();
      }
    });
  }

  static get observedAttributes() {
    return ['title', 'button-text', 'button-variant', 'button-size'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'title':
        this.setTitle(newValue);
        break;
      case 'button-text':
        this.setButtonText(newValue);
        break;
      case 'button-variant':
        this.setButtonVariant(newValue);
        break;
      case 'button-size':
        this.setButtonSize(newValue);
        break;
    }
  }

  setTitle(title: string) {
    this.titleElement.textContent = title || '';
  }

  setButtonText(text: string) {
    this.button.textContent = text || '';
  }

  setButtonVariant(variant: string) {
    this.button.setAttribute('variant', variant || 'primary');
  }

  setButtonSize(size: string) {
    this.button.setAttribute('size', size || 'medium');
  }

  setButtonClickCallback(callback: () => void) {
    this.buttonClickCallback = callback;
  }
}

if (!customElements.get('courier-info-state')) {
  customElements.define('courier-info-state', CourierInfoState);
}
