import { CourierIconButton } from "@trycourier/courier-ui-core";
import { CourierInbox } from "./courier-inbox";

export type CourierInboxMenuPosition = 'top' | 'bottom' | 'left' | 'right' | 'center';

export class CourierInboxMenu extends HTMLElement {
  private triggerButton: CourierIconButton;
  private popup: HTMLDivElement;
  private inbox: CourierInbox;
  private width: string = '400px';
  private height: string = '400px';
  private top: CourierInboxMenuPosition = 'bottom';
  private left: CourierInboxMenuPosition = 'right';

  static get observedAttributes() {
    return ['top', 'left'];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    // Create trigger button
    this.triggerButton = new CourierIconButton('inbox');

    // Create popup container
    this.popup = document.createElement('div');
    this.popup.className = 'popup';

    // Create content container
    this.inbox = new CourierInbox();
    this.inbox.setAttribute('height', '100%');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
        position: relative;
      }

      .popup {
        display: none;
        position: absolute;
        background: var(--Background-Default-Primary, #FFF);
        border-radius: var(--Radius-md, 6px);
        border: 1px solid var(--Stroke-Subtle-Primary, #E5E5E5);
        box-shadow: 0px 8px 16px -4px rgba(0, 0, 0, 0.12), 0px 4px 6px -2px rgba(0, 0, 0, 0.06);
        z-index: 1000;
        width: ${this.width};
        height: ${this.height};
        overflow: hidden;
        transform: translateZ(0);
        will-change: transform;
      }

      courier-inbox {
        height: 100%;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.triggerButton);
    shadow.appendChild(this.popup);
    this.popup.appendChild(this.inbox);

    // Add event listeners
    this.triggerButton.addEventListener('click', this.togglePopup.bind(this));
    document.addEventListener('click', this.handleOutsideClick.bind(this));

    // Initialize popup position
    this.updatePopupPosition();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    if (name === 'top' && this.isValidPosition(newValue)) {
      this.top = newValue as CourierInboxMenuPosition;
      this.updatePopupPosition();
    } else if (name === 'left' && this.isValidPosition(newValue)) {
      this.left = newValue as CourierInboxMenuPosition;
      this.updatePopupPosition();
    }
  }

  private isValidPosition(value: string): value is CourierInboxMenuPosition {
    return ['top', 'bottom', 'left', 'right', 'center'].includes(value);
  }

  private updatePopupPosition() {
    const margin = '8px';

    // Reset all positions
    this.popup.style.top = '';
    this.popup.style.bottom = '';
    this.popup.style.left = '';
    this.popup.style.right = '';
    this.popup.style.margin = '';

    // Set vertical position
    if (this.top === 'top') {
      this.popup.style.bottom = '100%';
      this.popup.style.marginBottom = margin;
    } else if (this.top === 'bottom') {
      this.popup.style.top = '100%';
      this.popup.style.marginTop = margin;
    } else if (this.top === 'center') {
      this.popup.style.top = '50%';
      this.popup.style.transform = 'translateY(-50%)';
    }

    // Set horizontal position
    if (this.left === 'left') {
      this.popup.style.left = '0';
    } else if (this.left === 'right') {
      this.popup.style.right = '0';
    } else if (this.left === 'center') {
      this.popup.style.left = '50%';
      this.popup.style.transform = this.popup.style.transform
        ? `${this.popup.style.transform} translateX(-50%)`
        : 'translateX(-50%)';
    }
  }

  private togglePopup(event: Event) {
    event.stopPropagation();
    const isVisible = this.popup.style.display === 'block';

    if (!isVisible) {
      this.popup.style.display = 'block';
    } else {
      this.popup.style.display = 'none';
    }
  }

  private handleOutsideClick(event: MouseEvent) {
    if (!this.contains(event.target as Node)) {
      this.popup.style.display = 'none';
    }
  }

  public setContent(element: HTMLElement) {
    this.inbox.innerHTML = '';
    this.inbox.appendChild(element);
  }

  public setSize(width: string, height: string) {
    this.width = width;
    this.height = height;
    this.popup.style.width = width;
    this.popup.style.height = height;
  }

  public setPosition(top: CourierInboxMenuPosition, left: CourierInboxMenuPosition) {
    this.setAttribute('top', top);
    this.setAttribute('left', left);
  }
}

if (!customElements.get('courier-inbox-menu')) {
  customElements.define('courier-inbox-menu', CourierInboxMenu);
}
