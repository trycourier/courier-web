import { InboxMessage } from "@trycourier/courier-js";
import { CourierIcon, CourierIconButton } from "@trycourier/courier-ui-core";
import { FeedType } from "../types/feed-type";

export class CourierListItem extends HTMLElement {
  private titleElement: HTMLParagraphElement;
  private subtitleElement: HTMLParagraphElement;
  private closeButton: CourierIconButton | null = null;
  private message: InboxMessage | null = null;
  private feedType: FeedType = 'inbox';
  private onItemClick: ((message: InboxMessage) => void) | null = null;
  private onCloseClick: ((message: InboxMessage) => void) | null = null;

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
        display: flex;
        align-items: flex-start;
        padding: 16px;
        border-bottom: 1px solid var(--courier-list-border-color, #e5e7eb);
        font-family: inherit;
        cursor: pointer;
        transition: background-color 0.2s ease;
        margin: 0;
        width: 100%;
        box-sizing: border-box;
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

      .content {
        flex: 1;
        min-width: 0;
      }

      p {
        margin: 0;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
      }

      p[part="title"] {
        font-size: 14px;
        line-height: 1.4;
      }

      p[part="subtitle"] {
        font-size: 14px;
        color: var(--courier-text-secondary, #6b7280);
        padding-top: 4px;
        line-height: 1.4;
      }

      courier-icon {
        margin-left: 16px;
        cursor: pointer;
        flex-shrink: 0;
      }
    `;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';
    contentDiv.appendChild(this.titleElement);
    contentDiv.appendChild(this.subtitleElement);

    shadow.appendChild(style);
    shadow.appendChild(contentDiv);

    // Add click event listener
    this.addEventListener('click', (e) => {
      if (this.message && this.onItemClick && !(e.target instanceof CourierIcon)) {
        this.onItemClick(this.message);
      }
    });
  }

  static get observedAttributes() {
    return ['message', 'feed-type'];
  }

  connectedCallback() {
    const messageAttr = this.getAttribute('message');
    const feedTypeAttr = this.getAttribute('feed-type');

    if (feedTypeAttr) {
      this.feedType = feedTypeAttr as FeedType;
    }

    if (messageAttr) {
      try {
        this.message = JSON.parse(messageAttr) as InboxMessage;
        this.updateContent();
      } catch (e) {
        console.error('Failed to parse message:', e);
      }
    }

    this.updateCloseButton();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'message' && oldValue !== newValue) {
      try {
        this.message = JSON.parse(newValue) as InboxMessage;
        this.updateContent();
      } catch (e) {
        console.error('Failed to parse message:', e);
      }
    } else if (name === 'feed-type' && oldValue !== newValue) {
      this.feedType = newValue as FeedType;
      this.updateCloseButton();
    }
  }

  setMessage(message: InboxMessage, feedType: FeedType) {
    this.message = message;
    this.feedType = feedType;
    this.updateContent();
  }

  setOnItemClick(callback: (message: InboxMessage) => void) {
    this.onItemClick = callback;
  }

  setOnCloseClick(callback: (message: InboxMessage) => void) {
    this.onCloseClick = callback;
  }

  private updateCloseButton() {
    const shadow = this.shadowRoot;
    if (!shadow) return;

    // Remove existing close button if any
    if (this.closeButton) {
      shadow.removeChild(this.closeButton);
      this.closeButton = null;
    }

    // Add close button only for inbox feed type
    if (this.feedType === 'inbox') {
      this.closeButton = new CourierIconButton('remove');
      // Add click handler for close button
      this.closeButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        if (this.message && this.onCloseClick) {
          this.onCloseClick(this.message);
        }
      });

      shadow.appendChild(this.closeButton);
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
