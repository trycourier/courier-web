import { CourierIconButton } from "@trycourier/courier-ui-core";
import { CourierInbox } from "./courier-inbox";
import { InboxMessage } from "@trycourier/courier-js";

export type CourierInboxPopupAlignment = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center-right' | 'center-left' | 'center-center';

export class CourierInboxMenu extends HTMLElement {
  private triggerButton: CourierIconButton;
  private popup: HTMLDivElement;
  private inbox: CourierInbox;
  private width: string = '440px';
  private height: string = '440px';
  private popupAlignment: CourierInboxPopupAlignment = 'top-right';
  private onMessageClick?: (message: InboxMessage, index: number) => void;

  static get observedAttributes() {
    return ['popup-alignment', 'message-click'];
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
        border-radius: 8px;
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
    this.inbox.setMessageClick(this.onMessageClick);

    // Add event listeners
    this.triggerButton.addEventListener('click', this.togglePopup.bind(this));
    document.addEventListener('click', this.handleOutsideClick.bind(this));

    // Initialize popup position
    this.updatePopupPosition();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    if (name === 'popup-alignment' && this.isValidPosition(newValue)) {
      this.popupAlignment = newValue as CourierInboxPopupAlignment;
      this.updatePopupPosition();
    } else if (name === 'message-click') {
      if (newValue) {
        try {
          this.onMessageClick = new Function('message', 'index', newValue) as (message: InboxMessage, index: number) => void;
        } catch (error) {
          console.error('Failed to parse message-click handler:', error);
        }
      } else {
        this.onMessageClick = undefined;
      }
    }
  }

  private isValidPosition(value: string): value is CourierInboxPopupAlignment {
    return ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center', 'center-right', 'center-left', 'center-center'].includes(value);
  }

  private updatePopupPosition() {

    // Reset all positions
    this.popup.style.top = '';
    this.popup.style.bottom = '';
    this.popup.style.left = '';
    this.popup.style.right = '';
    this.popup.style.margin = '';
    this.popup.style.transform = '';

    switch (this.popupAlignment) {
      case 'top-right':
        this.popup.style.top = '40px';
        this.popup.style.right = '0';
        break;
      case 'top-left':
        this.popup.style.top = '40px';
        this.popup.style.left = '0';
        break;
      case 'top-center':
        this.popup.style.top = '40px';
        this.popup.style.left = '50%';
        this.popup.style.transform = 'translateX(-50%)';
        break;
      case 'bottom-right':
        this.popup.style.bottom = '40px';
        this.popup.style.right = '0';
        break;
      case 'bottom-left':
        this.popup.style.bottom = '40px';
        this.popup.style.left = '0';
        break;
      case 'bottom-center':
        this.popup.style.bottom = '40px';
        this.popup.style.left = '50%';
        this.popup.style.transform = 'translateX(-50%)';
        break;
      case 'center-right':
        this.popup.style.top = '50%';
        this.popup.style.right = '40px';
        this.popup.style.transform = 'translateY(-50%)';
        break;
      case 'center-left':
        this.popup.style.top = '50%';
        this.popup.style.left = '40px';
        this.popup.style.transform = 'translateY(-50%)';
        break;
      case 'center-center':
        this.popup.style.top = '50%';
        this.popup.style.left = '50%';
        this.popup.style.transform = 'translate(-50%, -50%)';
        break;
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

  public setPosition(position: CourierInboxPopupAlignment) {
    this.setAttribute('popup-alignment', position);
  }
}

if (!customElements.get('courier-inbox-menu')) {
  customElements.define('courier-inbox-menu', CourierInboxMenu);
}
