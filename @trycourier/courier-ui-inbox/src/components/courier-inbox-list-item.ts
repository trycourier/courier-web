import { InboxMessage } from "@trycourier/courier-js";
import { CourierIcon, CourierIconButton, CourierIconSource, CourierSystemThemeElement } from "@trycourier/courier-ui-core";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { getFallbackTheme } from "../utils/theme";

export class CourierListItem extends CourierSystemThemeElement {
  // State
  private theme: CourierInboxTheme;
  private message: InboxMessage | null = null;
  private feedType: CourierInboxFeedType = 'inbox';

  // DOM Elements
  private titleElement: HTMLParagraphElement;
  private subtitleElement: HTMLParagraphElement;
  private closeButton: CourierIconButton | null = null;

  // Event Handlers
  private onItemClick: ((message: InboxMessage) => void) | null = null;
  private onCloseClick: ((message: InboxMessage) => void) | null = null;

  constructor(theme: CourierInboxTheme) {
    super();
    this.theme = theme;
    const shadow = this.attachShadow({ mode: 'open' });

    this.titleElement = document.createElement('p');
    this.titleElement.setAttribute('part', 'title');

    this.subtitleElement = document.createElement('p');
    this.subtitleElement.setAttribute('part', 'subtitle');

    const style = document.createElement('style');

    const listItem = theme.inbox?.list?.item;
    const fallbackTheme = getFallbackTheme(this.currentSystemTheme);

    style.textContent = `
      :host {
        display: flex;
        align-items: flex-start;
        padding: 16px;
        border-bottom: ${listItem?.divider ?? fallbackTheme.inbox?.list?.item?.divider};
        font-family: inherit;
        cursor: pointer;
        transition: background-color 0.2s ease;
        margin: 0;
        width: 100%;
        box-sizing: border-box;
      }

      :host(:hover) {
        background-color: ${listItem?.hoverColor ?? fallbackTheme.inbox?.list?.item?.hoverColor};
      }

      :host(:active) {
        background-color: ${listItem?.activeColor ?? fallbackTheme.inbox?.list?.item?.activeColor};
      }

      :host(:last-child) {
        border-bottom: none;
      }

      :host(.unread) {
        box-shadow: inset 2px 0 0 ${listItem?.unreadIndicatorColor ?? fallbackTheme.inbox?.list?.item?.unreadIndicatorColor};
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
        font-family: ${listItem?.title?.family ?? fallbackTheme.inbox?.list?.item?.title?.family};
        font-size: ${listItem?.title?.size ?? fallbackTheme.inbox?.list?.item?.title?.size};
        line-height: 1.4;
        color: ${listItem?.title?.color ?? fallbackTheme.inbox?.list?.item?.title?.color};
      }

      p[part="subtitle"] {
        font-family: ${listItem?.subtitle?.family ?? fallbackTheme.inbox?.list?.item?.subtitle?.family};
        font-size: ${listItem?.subtitle?.size ?? fallbackTheme.inbox?.list?.item?.subtitle?.size};
        color: ${listItem?.subtitle?.color ?? fallbackTheme.inbox?.list?.item?.subtitle?.color};
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
      this.feedType = feedTypeAttr as CourierInboxFeedType;
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
      this.feedType = newValue as CourierInboxFeedType;
      this.updateCloseButton();
    }
  }

  setMessage(message: InboxMessage, feedType: CourierInboxFeedType) {
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

    const listItem = this.theme.inbox?.list?.item;

    // Add close button only for inbox feed type
    if (this.feedType === 'inbox') {
      this.closeButton = new CourierIconButton(CourierIconSource.remove, listItem?.archiveIcon?.color);
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
    if (this.message && !this.message.read) {
      this.classList.add('unread');
    } else {
      this.classList.remove('unread');
    }
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
