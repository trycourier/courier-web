export class CourierInteractive extends HTMLElement {
  constructor() {
    super();
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
      }

      :host(.interactive) {
        transition: all 0.2s ease;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }

      :host(.interactive:hover) {
        filter: brightness(0.95);
      }

      :host(.interactive:active) {
        filter: brightness(0.8);
      }

      :host(.interactive:disabled) {
        cursor: not-allowed;
        pointer-events: none;
        opacity: 0.6;
      }
    `;
    this.attachShadow({ mode: 'open' }).appendChild(style);
  }

  connectedCallback() {
    this.classList.add('interactive');
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'disabled') {
      if (this.hasAttribute('disabled')) {
        this.classList.add('disabled');
      } else {
        this.classList.remove('disabled');
      }
    }
  }

  static get observedAttributes() {
    return ['disabled'];
  }
}

if (!customElements.get('courier-interactive')) {
  customElements.define('courier-interactive', CourierInteractive);
}