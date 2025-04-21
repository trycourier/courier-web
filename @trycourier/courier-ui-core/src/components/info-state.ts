import { CourierElement } from "./courier-element";

export class CourierInfoState extends CourierElement {
  private _title?: HTMLElement;
  private _button?: HTMLElement;
  private _buttonClickCallback: (() => void) | null = null;

  defaultElement(): HTMLElement {
    const container = document.createElement('div');
    this._title = document.createElement('h2');
    this._button = document.createElement('courier-button');

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
        justify-content: center;
        gap: 16px;
        text-align: center;
      }

      .container h2 {
        margin: 0;
        color: var(--courier-text-primary, #111827);
        font-size: 16px;
        font-weight: 500;
      }
    `;

    container.className = 'container';
    container.appendChild(style);
    container.appendChild(this._title);
    container.appendChild(this._button);
    this.shadow.appendChild(container);

    this._button?.addEventListener('click', () => {
      if (this._buttonClickCallback) {
        this._buttonClickCallback();
      }
    });

    return container;
  }

  setTitle(title: string) {
    if (this._title) {
      this._title.textContent = title;
    }
  }

  setButtonText(text: string) {
    if (this._button) {
      this._button.textContent = text;
    }
  }

  setButtonVariant(variant: string) {
    if (this._button) {
      this._button.setAttribute('variant', variant || 'primary');
    }
  }

  setButtonClickCallback(callback: () => void) {
    this._buttonClickCallback = callback;
  }
}

if (!customElements.get('courier-info-state')) {
  customElements.define('courier-info-state', CourierInfoState);
}
