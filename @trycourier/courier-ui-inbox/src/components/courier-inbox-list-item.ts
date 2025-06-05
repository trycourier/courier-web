import { Courier, InboxAction, InboxMessage } from "@trycourier/courier-js";
import { BaseElement, CourierButton, CourierIcon, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { getMessageTime } from "../utils/utils";
import { CourierListItemActionMenu, CourierListItemActionMenuOption } from "./courier-inbox-list-item-menu";
import { CourierInboxDatastore } from "../datastore/datastore";

export class CourierListItem extends BaseElement {

  // State
  private _theme: CourierInboxTheme;
  private _message: InboxMessage | null = null;
  private _feedType: CourierInboxFeedType = 'inbox';
  private _isMobile: boolean = false;

  // Elements
  private _titleElement: HTMLParagraphElement;
  private _subtitleElement: HTMLParagraphElement;
  private _timeElement: HTMLParagraphElement;
  private _style: HTMLStyleElement;
  private _menu: CourierListItemActionMenu;
  private _unreadIndicator: HTMLDivElement;
  private _actionsContainer: HTMLDivElement;

  // Touch gestures
  private _longPressTimeout: number | null = null;
  private _isLongPress: boolean = false;

  // Callbacks
  private onItemClick: ((message: InboxMessage) => void) | null = null;
  private onItemLongPress: ((message: InboxMessage) => void) | null = null;
  private onItemActionClick: ((message: InboxMessage, action: InboxAction) => void) | null = null;

  constructor(theme: CourierInboxTheme) {
    super();
    this._theme = theme;
    this._isMobile = 'ontouchstart' in window;
    const shadow = this.attachShadow({ mode: 'open' });

    const contentContainer = document.createElement('div');
    contentContainer.className = 'content-container';

    // Title
    this._titleElement = document.createElement('p');
    this._titleElement.setAttribute('part', 'title');

    // Subtitle
    this._subtitleElement = document.createElement('p');
    this._subtitleElement.setAttribute('part', 'subtitle');

    // Actions
    this._actionsContainer = document.createElement('div');
    this._actionsContainer.className = 'actions-container';

    contentContainer.appendChild(this._titleElement);
    contentContainer.appendChild(this._subtitleElement);
    contentContainer.appendChild(this._actionsContainer);

    // Time
    this._timeElement = document.createElement('p');
    this._timeElement.setAttribute('part', 'time');

    // Unread indicator
    this._unreadIndicator = document.createElement('div');
    this._unreadIndicator.className = 'unread-indicator';

    // Style element
    this._style = document.createElement('style');
    this._refreshStyles();

    // Action menu
    this._menu = new CourierListItemActionMenu(this._theme);
    this._menu.setOptions(this._getMenuOptions());

    // Append elements into shadow‑DOM
    shadow.append(this._style, this._unreadIndicator, contentContainer, this._timeElement, this._menu);

    const cancelPropagation = (e: Event): void => {
      e.stopPropagation();
      e.preventDefault();
    };

    this._menu.addEventListener('mousedown', cancelPropagation);
    this._menu.addEventListener('pointerdown', cancelPropagation);
    this._menu.addEventListener('click', cancelPropagation);

    this.addEventListener('click', (e) => {
      if (this._menu.contains(e.target as Node) || e.composedPath().includes(this._menu)) {
        return;
      }
      if (this._message && this.onItemClick && !(e.target instanceof CourierIcon) && !this._isLongPress) {
        this.onItemClick(this._message);
      }
    });

    this._setupHoverBehavior();
    this._setupLongPressBehavior();
  }

  private _setupHoverBehavior(): void {
    // Only show menu on hover for non-mobile devices
    if (!this._isMobile) {
      this.addEventListener('mouseenter', () => {
        this._isLongPress = false;
        this._showMenu();
      });
      this.addEventListener('mouseleave', () => this._hideMenu());
    }
  }

  private _setupLongPressBehavior(): void {
    const menu = this._theme.inbox?.list?.item?.menu

    if (!menu?.enabled) {
      return;
    }

    const longPress = menu.longPress;

    this.addEventListener(
      'touchstart',
      () => {
        // Start long press timer
        this._longPressTimeout = window.setTimeout(() => {
          this._isLongPress = true;
          this._showMenu();
          if (this._message && this.onItemLongPress) {
            this.onItemLongPress(this._message);
            // Vibrate device if supported
            if (navigator.vibrate) {
              navigator.vibrate(longPress?.vibrationDuration ?? 50);
            }
          }
          // Keep the menu visible for 2 s, then hide again
          setTimeout(() => {
            this._hideMenu();
            this._isLongPress = false;
          }, longPress?.displayDuration ?? 2000);
        }, 650);
      },
      { passive: true },
    );

    this.addEventListener('touchend', () => {
      // Clear long press timeout
      if (this._longPressTimeout) {
        window.clearTimeout(this._longPressTimeout);
        this._longPressTimeout = null;
      }
    });
  }

  setOnLongPress(cb: (message: InboxMessage) => void): void {
    this.onItemLongPress = cb;
  }

  // Helpers
  private _getMenuOptions(): CourierListItemActionMenuOption[] {
    const menuTheme = this._theme.inbox?.list?.item?.menu?.item;
    let options: CourierListItemActionMenuOption[] = [];

    const isArchiveFeed = this._feedType === 'archive';

    // Only add read/unread option if not in archive feed
    if (!isArchiveFeed) {
      options.push({
        id: this._message?.read ? 'unread' : 'read',
        icon: {
          svg: this._message?.read ? menuTheme?.unread?.svg : menuTheme?.read?.svg,
          color: this._message?.read ? menuTheme?.unread?.color : menuTheme?.read?.color ?? 'red',
        },
        onClick: () => {
          if (this._message) {
            if (this._message.read) {
              CourierInboxDatastore.shared.unreadMessage({ message: this._message });
            } else {
              CourierInboxDatastore.shared.readMessage({ message: this._message });
            }
          }
        },
      });
    }

    options.push({
      id: isArchiveFeed ? 'unarchive' : 'archive',
      icon: {
        svg: isArchiveFeed ? menuTheme?.unarchive?.svg : menuTheme?.archive?.svg,
        color: isArchiveFeed ? menuTheme?.unarchive?.color : menuTheme?.archive?.color ?? 'red',
      },
      onClick: () => {
        if (this._message) {
          if (isArchiveFeed) {
            CourierInboxDatastore.shared.unarchiveMessage({ message: this._message });
          } else {
            CourierInboxDatastore.shared.archiveMessage({ message: this._message });
          }
        }
      },
    });

    return options;
  }

  // Menu visibility helpers
  private _showMenu(): void {
    const menu = this._theme.inbox?.list?.item?.menu;

    if (menu && menu.enabled) {
      this._menu.setOptions(this._getMenuOptions());
      this._menu.style.display = 'block';
      this._menu.show();
      this._timeElement.style.opacity = '0';
    }
  }

  private _hideMenu(): void {
    const menu = this._theme.inbox?.list?.item?.menu;

    if (menu && menu.enabled) {
      this._menu.hide();
      this._menu.style.display = 'none';
      this._timeElement.style.opacity = '1';
    }
  }

  private _getStyles(): string {
    const listItem = this._theme.inbox?.list?.item;

    return `
      :host {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        border-bottom: ${listItem?.divider ?? '1px solid red'};
        font-family: inherit;
        cursor: pointer;
        transition: background-color 0.2s ease;
        margin: 0;
        width: 100%;
        box-sizing: border-box;
        padding: 12px 20px;
        position: relative;
        background-color: ${listItem?.backgroundColor ?? 'transparent'};
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        touch-action: manipulation;
      }

      /* ───────────────────────── Base hover / active ────────────────── */
      @media (hover: hover) {
        :host(:hover) {
          background-color: ${listItem?.hoverBackgroundColor ?? 'red'};
        }
      }
      :host(:active) {
        background-color: ${listItem?.activeBackgroundColor ?? 'red'};
      }

      /* ───────────────────────── Menu hover / active ────────────────── */
      @media (hover: hover) {
        :host(:hover):has(courier-list-item-menu:hover, courier-list-item-menu *:hover, courier-button:hover, courier-button *:hover) {
          background-color: ${listItem?.backgroundColor ?? 'transparent'};
        }
      }
      :host(:active):has(courier-list-item-menu:active, courier-list-item-menu *:active, courier-button:active, courier-button *:active) {
        background-color: ${listItem?.backgroundColor ?? 'transparent'};
      }

      :host(:last-child) {
        border-bottom: none;
      }

      .unread-indicator {
        position: absolute;
        top: 28px;
        left: 6px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: ${listItem?.unreadIndicatorColor ?? 'red'};
        display: none;
      }

      :host(.unread) .unread-indicator {
        display: block;
      }

      .content-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-right: 12px;
      }

      p {
        margin: 0;
        overflow-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
        line-height: 1.4;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        text-align: left;
      }

      p[part='title'] {
        font-family: ${listItem?.title?.family ?? 'inherit'};
        font-size: ${listItem?.title?.size ?? '14px'};
        color: ${listItem?.title?.color ?? 'red'};
        margin-bottom: 4px;
      }

      p[part='subtitle'] {
        font-family: ${listItem?.subtitle?.family ?? 'inherit'};
        font-size: ${listItem?.subtitle?.size ?? '14px'};
        color: ${listItem?.subtitle?.color ?? 'red'};
      }

      p[part='time'] {
        font-family: ${listItem?.time?.family ?? 'inherit'};
        font-size: ${listItem?.time?.size ?? '14px'};
        color: ${listItem?.time?.color ?? 'red'};
        text-align: right;
        white-space: nowrap;
      }

      courier-list-item-menu {
        z-index: 1;
        position: absolute;
        top: 8px;
        right: 8px;
        display: none; /* becomes block while visible */
      }

      .actions-container {
        display: flex;
        margin-top: 10px;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        display: none;
      }

    `;
  }

  private _refreshStyles(): void {
    this._style.textContent = this._getStyles();
  }

  // Lifecycle hooks
  connectedCallback(): void {
    const messageAttr = this.getAttribute('message');
    const feedTypeAttr = this.getAttribute('feed-type');

    if (feedTypeAttr) {
      this._feedType = feedTypeAttr as CourierInboxFeedType;
    }

    if (messageAttr) {
      try {
        this._message = JSON.parse(messageAttr) as InboxMessage;
        this._updateContent();
      } catch (err) {
        Courier.shared.client?.options.logger?.error('CourierListItem – failed to parse message:', err);
      }
    }
  }

  // Public API
  public setMessage(message: InboxMessage, feedType: CourierInboxFeedType): void {
    this._message = message;
    this._feedType = feedType;
    this._updateContent();
  }

  public setOnItemClick(cb: (message: InboxMessage) => void): void {
    this.onItemClick = cb;
  }

  public setOnItemActionClick(cb: (message: InboxMessage, action: InboxAction) => void): void {
    this.onItemActionClick = cb;
  }

  public setOnItemLongPress(cb: (message: InboxMessage) => void): void {
    this.onItemLongPress = cb;
  }

  // Content rendering
  private _updateContent(): void {
    if (!this._message) {
      this._titleElement.textContent = '';
      this._subtitleElement.textContent = '';
      return;
    }

    // Unread marker
    this.classList.toggle('unread', !this._message.read && this._feedType !== 'archive');

    this._titleElement.textContent = this._message.title || 'Untitled Message';
    this._subtitleElement.textContent = this._message.preview || this._message.body || '';
    this._timeElement.textContent = getMessageTime(this._message);

    // Update menu icons (e.g. read/unread)
    this._menu.setOptions(this._getMenuOptions());

    // Update actions container
    const hasActions = this._message?.actions && this._message.actions.length > 0;
    this._actionsContainer.style.display = hasActions ? 'flex' : 'none';

    const actionsTheme = this._theme.inbox?.list?.item?.actions;

    // Add the actions to the actions container
    this._message?.actions?.forEach(action => {

      // Create the action element
      const actionButton = new CourierButton({
        text: action.content,
        variant: 'secondary',
        backgroundColor: actionsTheme?.backgroundColor,
        hoverBackgroundColor: actionsTheme?.hoverBackgroundColor,
        activeBackgroundColor: actionsTheme?.activeBackgroundColor,
        border: actionsTheme?.border,
        borderRadius: actionsTheme?.borderRadius,
        shadow: actionsTheme?.shadow,
        fontFamily: actionsTheme?.font?.family,
        fontSize: actionsTheme?.font?.size,
        fontWeight: actionsTheme?.font?.weight,
        textColor: actionsTheme?.font?.color,
        onClick: () => {
          if (this._message && this.onItemActionClick) {
            this.onItemActionClick(this._message, action);
          }
        },
      });

      // Add the action element to the actions container
      this._actionsContainer.appendChild(actionButton);
    });
  }
}

registerElement('courier-inbox-list-item', CourierListItem);