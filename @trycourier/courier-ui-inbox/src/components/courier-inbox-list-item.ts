import { InboxMessage } from "@trycourier/courier-js";
import { CourierIcon, CourierIconSVGs } from "@trycourier/courier-ui-core";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { getMessageTime } from "../utils/extensions";
import { CourierListItemMenu, CourierListItemMenuOption } from "./courier-inbox-list-item-menu";

export class CourierListItem extends HTMLElement {

  // State
  private _theme: CourierInboxTheme;
  private _message: InboxMessage | null = null;
  private _feedType: CourierInboxFeedType = 'inbox';

  // DOM Elements
  private _titleElement: HTMLParagraphElement;
  private _subtitleElement: HTMLParagraphElement;
  private _timeElement: HTMLParagraphElement;
  private _style: HTMLStyleElement;
  private _menu: CourierListItemMenu | null = null;

  // Touch gesture state
  private _touchStartX: number | null = null;
  private _touchStartY: number | null = null;
  private _touchMoved: boolean = false;

  // Event Handlers
  private onItemClick: ((message: InboxMessage) => void) | null = null;

  constructor(theme: CourierInboxTheme) {
    super();
    this._theme = theme;
    const shadow = this.attachShadow({ mode: 'open' });

    // Text Container
    const textContainer = document.createElement('div');
    textContainer.className = 'text-container';

    // Title
    this._titleElement = document.createElement('p');
    this._titleElement.setAttribute('part', 'title');

    // Subtitle
    this._subtitleElement = document.createElement('p');
    this._subtitleElement.setAttribute('part', 'subtitle');

    textContainer.appendChild(this._titleElement);
    textContainer.appendChild(this._subtitleElement);

    // Time
    this._timeElement = document.createElement('p');
    this._timeElement.setAttribute('part', 'time');

    // Style
    this._style = document.createElement('style');
    this.refresh();

    // Menu (hidden by default)
    this._menu = new CourierListItemMenu(this._theme);
    this._menu.setOptions(this.getMenuOptions());

    // Append elements
    shadow.appendChild(this._style);
    shadow.appendChild(textContainer);
    shadow.appendChild(this._timeElement);
    shadow.appendChild(this._menu);

    // Add click event listener
    this.addEventListener('click', (e) => {
      if (this._message && this.onItemClick && !(e.target instanceof CourierIcon)) {
        this.onItemClick(this._message);
      }
    });

    // Mouse hover events for desktop
    this.addEventListener('mouseenter', () => {
      this.showMenu();
    });
    this.addEventListener('mouseleave', () => {
      this.hideMenu();
    });

    // Touch gesture events for mobile
    this.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length === 1) {
        this._touchStartX = e.touches[0].clientX;
        this._touchStartY = e.touches[0].clientY;
        this._touchMoved = false;
      }
    }, { passive: true });

    this.addEventListener('touchmove', (e: TouchEvent) => {
      if (this._touchStartX === null || this._touchStartY === null) return;
      const dx = e.touches[0].clientX - this._touchStartX;
      const dy = e.touches[0].clientY - this._touchStartY;
      if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
        this._touchMoved = true;
        this.showMenu();
      }
    }, { passive: true });

    this.addEventListener('touchend', () => {
      if (this._touchMoved) {
        // Keep menu open for a short time, then hide
        setTimeout(() => this.hideMenu(), 2000);
      }
      this._touchStartX = null;
      this._touchStartY = null;
      this._touchMoved = false;
    });
  }

  private getMenuOptions(): CourierListItemMenuOption[] {
    // You can customize these options as needed
    return [
      {
        id: "mark-read",
        icon: {
          svg: this._message && !this._message.read ? CourierIconSVGs.check : CourierIconSVGs.inbox,
          color: 'red'
        },
        onClick: () => {
          // Example: toggle read state (should be replaced with real logic)
          if (this._message) {
            // this._message.read = !this._message.read;
            this.updateContent();
          }
        }
      },
      {
        id: "delete",
        icon: {
          svg: CourierIconSVGs.archive,
          color: 'red'
        },
        onClick: () => {
          // Example: remove item (should be replaced with real logic)
          this.dispatchEvent(new CustomEvent("delete-message", { detail: { message: this._message } }));
        }
      }
    ];
  }

  private showMenu() {
    if (this._menu) {
      this._menu.setOptions(this.getMenuOptions());
      this._menu.style.display = "block";
      this._menu.show();
    }
  }

  private hideMenu() {
    if (this._menu) {
      this._menu.hide();
      this._menu.style.display = "none";
    }
  }

  private getStyles(): string {
    const listItem = this._theme.inbox?.list?.item;

    return `
      :host {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        border-bottom: ${listItem?.divider ?? `1px solid red`};
        font-family: inherit;
        cursor: pointer;
        transition: background-color 0.2s ease;
        margin: 0;
        width: 100%;
        box-sizing: border-box;
        padding: 12px 20px;
        position: relative;
      }

      :host(:hover) {
        background-color: ${listItem?.hoverBackgroundColor ?? 'red'};
      }

      :host(:active) {
        background-color: ${listItem?.activeBackgroundColor ?? 'red'};
      }

      :host(:last-child) {
        border-bottom: none;
      }

      :host(.unread) {
        box-shadow: inset 2px 0 0 ${listItem?.unreadIndicatorColor ?? 'red'};
      }

      .text-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-right: 12px;
      }

      p {
        margin: 0;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
      }

      p[part="title"] {
        font-family: ${listItem?.title?.family ?? 'inherit'};
        font-size: ${listItem?.title?.size ?? '14px'};
        line-height: 1.4;
        color: ${listItem?.title?.color ?? 'red'};
        margin-bottom: 4px;
      }

      p[part="subtitle"] {
        font-family: ${listItem?.subtitle?.family ?? 'inherit'};
        font-size: ${listItem?.subtitle?.size ?? '14px'};
        color: ${listItem?.subtitle?.color ?? 'red'};
        line-height: 1.4;
      }

      p[part="time"] {
        font-family: ${listItem?.time?.family ?? 'inherit'};
        font-size: ${listItem?.time?.size ?? '14px'};
        color: ${listItem?.time?.color ?? 'red'};
        line-height: 1.4;
        white-space: nowrap;
      }

      courier-list-item-menu {
        z-index: 1;
        position: absolute;
        top: 6px;
        right: 6px;
        display: none;
      }
    `;
  }

  private refresh() {
    this._style.textContent = this.getStyles();
  }

  connectedCallback() {
    const messageAttr = this.getAttribute('message');
    const feedTypeAttr = this.getAttribute('feed-type');

    if (feedTypeAttr) {
      this._feedType = feedTypeAttr as CourierInboxFeedType;
    }

    if (messageAttr) {
      try {
        this._message = JSON.parse(messageAttr) as InboxMessage;
        this.updateContent();
      } catch (e) {
        console.error('Failed to parse message:', e);
      }
    }
  }

  setMessage(message: InboxMessage, feedType: CourierInboxFeedType) {
    this._message = message;
    this._feedType = feedType;
    this.updateContent();
    if (this._menu) {
      this._menu.setOptions(this.getMenuOptions());
    }
  }

  setOnItemClick(callback: (message: InboxMessage) => void) {
    this.onItemClick = callback;
  }

  private updateContent() {
    // Unread
    if (this._message && !this._message.read) {
      this.classList.add('unread');
    } else {
      this.classList.remove('unread');
    }

    // Empty
    if (!this._message) {
      this._titleElement.textContent = '';
      this._subtitleElement.textContent = '';
      return;
    }

    // Title
    this._titleElement.textContent = this._message.title || 'Untitled Message';

    // Subtitle
    this._subtitleElement.textContent = this._message.preview || this._message.body || '';

    // Time
    this._timeElement.textContent = getMessageTime(this._message);

    // Update menu options if menu exists
    if (this._menu) {
      this._menu.setOptions(this.getMenuOptions());
    }
  }
}

if (!customElements.get('courier-list-item')) {
  customElements.define('courier-list-item', CourierListItem);
}
