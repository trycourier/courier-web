import { InboxMessage } from "@trycourier/courier-js";

export class CourierListItem extends HTMLElement {
  private titleElement: HTMLParagraphElement;
  private subtitleElement: HTMLParagraphElement;
  private message: InboxMessage | null = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    this.titleElement = document.createElement('p');
    this.titleElement.setAttribute('part', 'title');

    this.subtitleElement = document.createElement('p');
    this.subtitleElement.setAttribute('part', 'subtitle');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        padding: 16px;
        border-bottom: 1px solid var(--courier-list-border-color, #e5e7eb);
        font-family: inherit;
        cursor: pointer;
        transition: background-color 0.2s ease;
        margin: 0;
        display: block;
        width: 100%;
      }

      :host(:hover) {
        background-color: var(--courier-list-hover-color, #f3f4f6);
      }

      :host(:active) {
        background-color: var(--courier-list-active-color, #e5e7eb);
      }

      :host(:last-child) {
        border-bottom: none;
      }

      p {
        margin: 0;
      }

      p[part="title"] {
        font-size: 16px;
      }

      p[part="subtitle"] {
        font-size: 14px;
        color: var(--courier-text-secondary, #6b7280);
        padding-top: 0;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.titleElement);
    shadow.appendChild(this.subtitleElement);

    // Add click event listener
    this.titleElement.addEventListener('click', () => {
      if (this.message) {
        this.dispatchEvent(new CustomEvent('messageClick', {
          detail: { message: this.message },
          bubbles: true,
          composed: true
        }));
      }
    });
  }

  static get observedAttributes() {
    return ['message'];
  }

  connectedCallback() {
    const messageAttr = this.getAttribute('message');
    if (messageAttr) {
      try {
        this.message = JSON.parse(messageAttr) as InboxMessage;
        this.updateContent();
      } catch (e) {
        console.error('Failed to parse message:', e);
      }
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'message' && oldValue !== newValue) {
      try {
        this.message = JSON.parse(newValue) as InboxMessage;
        this.updateContent();
      } catch (e) {
        console.error('Failed to parse message:', e);
      }
    }
  }

  private updateContent() {
    if (!this.message) {
      this.titleElement.textContent = '';
      this.subtitleElement.textContent = '';
      return;
    }
    this.titleElement.textContent = this.message.title || 'Untitled Message';
    this.subtitleElement.textContent = this.message.preview || this.message.body || '';
  }
}

if (!customElements.get('courier-list-item')) {
  customElements.define('courier-list-item', CourierListItem);
}
