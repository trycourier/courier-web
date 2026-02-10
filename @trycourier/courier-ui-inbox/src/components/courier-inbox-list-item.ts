import { InboxAction, InboxMessage } from "@trycourier/courier-js";
import { CourierBaseElement, CourierButton, CourierIcon, CourierIconSVGs, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { getMessageTime } from "../utils/utils";
import { looksLikeHtml, sanitizeHtmlForInbox } from "../utils/sanitize-html";
import { CourierInboxListItemMenu, CourierInboxListItemActionMenuOption } from "./courier-inbox-list-item-menu";
import { CourierInboxDatastore } from "../datastore/inbox-datastore";
import { CourierInboxThemeManager } from "../types/courier-inbox-theme-manager";
import { CourierInboxListItemAction } from "../types/inbox-defaults";
import { CourierInbox } from "./courier-inbox";

export class CourierInboxListItem extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox-list-item';
  }

  // State
  private _themeManager: CourierInboxThemeManager;
  private _theme: CourierInboxTheme;
  private _message: InboxMessage | null = null;
  private _isMobile: boolean = false;
  private _canClick: boolean = false;
  private _listItemActions: CourierInboxListItemAction[] = CourierInbox.defaultListItemActions();
  // private _canLongPress: boolean = false; // Unused for now. But we can use this in the future if needed.

  // Elements
  private _titleElement?: HTMLParagraphElement;
  private _subtitleElement?: HTMLParagraphElement;
  private _timeElement?: HTMLParagraphElement;
  private _menu?: CourierInboxListItemMenu;
  private _unreadIndicator?: HTMLDivElement;
  private _actionsContainer?: HTMLDivElement;

  // Touch gestures
  private _longPressTimeout: number | null = null;
  private _isLongPress: boolean = false;

  // Intersection Observer
  private _observer?: IntersectionObserver;

  // Callbacks
  private onItemClick: ((message: InboxMessage) => void) | null = null;
  private onItemLongPress: ((message: InboxMessage) => void) | null = null;
  private onItemActionClick: ((message: InboxMessage, action: InboxAction) => void) | null = null;
  private onItemVisible: ((message: InboxMessage) => void) | null = null;

  constructor(themeManager: CourierInboxThemeManager, canClick: boolean, _canLongPress: boolean, listItemActions?: CourierInboxListItemAction[]) {
    super();
    this._canClick = canClick;
    // this._canLongPress = canLongPress;
    this._themeManager = themeManager;
    this._theme = themeManager.getTheme();
    this._isMobile = 'ontouchstart' in window;
    if (listItemActions) {
      this._listItemActions = listItemActions;
    }
    this.render();
    this._setupIntersectionObserver();
  }

  private render() {

    const contentContainer = document.createElement('div');
    contentContainer.className = 'content-container';

    // Title
    this._titleElement = document.createElement('p');
    this._titleElement.className = 'title';

    // Subtitle
    this._subtitleElement = document.createElement('p');
    this._subtitleElement.className = 'subtitle';

    // Actions
    this._actionsContainer = document.createElement('div');
    this._actionsContainer.className = 'actions-container';

    contentContainer.appendChild(this._titleElement);
    contentContainer.appendChild(this._subtitleElement);
    contentContainer.appendChild(this._actionsContainer);

    // Time
    this._timeElement = document.createElement('p');
    this._timeElement.className = 'time';

    // Unread indicator
    this._unreadIndicator = document.createElement('div');
    this._unreadIndicator.className = 'unread-indicator';

    // Action menu
    this._menu = new CourierInboxListItemMenu(this._theme);
    this._menu.setOptions(this._getMenuOptions());

    // Append elements into shadow‑DOM
    this.append(this._unreadIndicator, contentContainer, this._timeElement, this._menu);

    const cancelPropagation = (e: Event): void => {
      e.stopPropagation();
      e.preventDefault();
    };

    this._menu.addEventListener('mousedown', cancelPropagation);
    this._menu.addEventListener('pointerdown', cancelPropagation);
    this._menu.addEventListener('click', cancelPropagation);

    this.addEventListener('click', (e) => {
      if (!this._canClick) return;
      if (this._menu && (this._menu.contains(e.target as Node) || e.composedPath().includes(this._menu))) {
        return;
      }
      if (this._message && this.onItemClick && !(e.target instanceof CourierIcon) && !this._isLongPress) {
        this.onItemClick(this._message);
      }
    });

    this._setupHoverBehavior();
    this._setupLongPressBehavior();

    // Enable clickable class if canClick
    if (this._canClick) {
      this.classList.add('clickable');
    }

  }

  private _setupIntersectionObserver(): void {
    // Only set up if running in browser and IntersectionObserver is available
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }

    // Clean up any previous observer
    if (this._observer) {
      this._observer.disconnect();
    }

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio === 1 && this.onItemVisible && this._message) {
          this.onItemVisible(this._message);
        }
      });
    }, { threshold: 1.0 });

    this._observer.observe(this);
  }

  onComponentUnmounted() {
    this._observer?.disconnect();
  }

  static getStyles(theme: CourierInboxTheme): string {

    const list = theme.inbox?.list;

    return `
      ${CourierInboxListItem.id} {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        border-bottom: ${list?.item?.divider ?? '1px solid red'};
        font-family: inherit;
        cursor: default;
        transition: ${list?.item?.transition ?? 'all 0.2s ease'};
        margin: 0;
        width: 100%;
        box-sizing: border-box;
        padding: 12px 20px;
        position: relative;
        background-color: ${list?.item?.backgroundColor ?? 'transparent'};
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        touch-action: manipulation;
      }

      /* Only apply hover/active background if clickable */
      @media (hover: hover) {
        ${CourierInboxListItem.id}.clickable:hover {
          cursor: pointer;
          background-color: ${list?.item?.hoverBackgroundColor ?? 'red'};
        }
      }

      ${CourierInboxListItem.id}.clickable:active {
        cursor: pointer;
        background-color: ${list?.item?.activeBackgroundColor ?? 'red'};
      }

      /* Menu hover / active */
      @media (hover: hover) {
        ${CourierInboxListItem.id}.clickable:hover:has(courier-inbox-list-item-menu:hover, courier-inbox-list-item-menu *:hover, courier-button:hover, courier-button *:hover) {
          background-color: ${list?.item?.backgroundColor ?? 'transparent'};
        }
      }

      ${CourierInboxListItem.id}.clickable:active:has(courier-inbox-list-item-menu:active, courier-inbox-list-item-menu *:active, courier-button:active, courier-button *:active) {
        background-color: ${list?.item?.backgroundColor ?? 'transparent'};
      }

      ${CourierInboxListItem.id}:last-child {
        border-bottom: none;
      }

      ${CourierInboxListItem.id} .unread-indicator {
        position: absolute;
        top: 28px;
        left: 6px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: ${list?.item?.unreadIndicatorColor ?? 'red'};
        display: none;
      }

      ${CourierInboxListItem.id}.unread .unread-indicator {
        display: block;
      }

      ${CourierInboxListItem.id} .content-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-right: 12px;
      }

      ${CourierInboxListItem.id} p {
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

      ${CourierInboxListItem.id} .title {
        font-family: ${list?.item?.title?.family ?? 'inherit'};
        font-size: ${list?.item?.title?.size ?? '14px'};
        color: ${list?.item?.title?.color ?? 'red'};
        margin-bottom: 4px;
      }

      ${CourierInboxListItem.id} .subtitle {
        font-family: ${list?.item?.subtitle?.family ?? 'inherit'};
        font-size: ${list?.item?.subtitle?.size ?? '14px'};
        color: ${list?.item?.subtitle?.color ?? 'red'};
      }

      ${CourierInboxListItem.id} .time {
        font-family: ${list?.item?.time?.family ?? 'inherit'};
        font-size: ${list?.item?.time?.size ?? '14px'};
        color: ${list?.item?.time?.color ?? 'red'};
        text-align: right;
        white-space: nowrap;
      }

      ${CourierInboxListItem.id} courier-inbox-list-item-menu {
        z-index: 1;
        position: absolute;
        top: 8px;
        right: 8px;
        display: none;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      ${CourierInboxListItem.id} courier-inbox-list-item-menu.visible {
        opacity: 1;
      }

      /* Show menu on hover for non-mobile devices - CSS handles this reliably */
      @media (hover: hover) {
        ${CourierInboxListItem.id}.clickable:hover courier-inbox-list-item-menu {
          display: block;
        }
        ${CourierInboxListItem.id}.clickable:hover courier-inbox-list-item-menu.visible {
          display: block;
        }
        ${CourierInboxListItem.id}.clickable:hover .time {
          opacity: 0;
          transition: opacity 0.2s ease;
        }
      }

      ${CourierInboxListItem.id} .actions-container {
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

  private _setupHoverBehavior(): void {
    // CSS handles hover display for non-mobile devices - just update menu options
    if (!this._isMobile) {
      this.addEventListener('mouseenter', () => {
        this._isLongPress = false;
        // Update menu options when hovering
        const menuOptions = this._getMenuOptions();
        if (menuOptions.length > 0 && this._menu) {
          this._menu.setOptions(menuOptions);
          // Trigger show() to add visible class for transitions
          this._menu.show();
          if (this._timeElement) {
            this._timeElement.style.opacity = '0';
          }
        }
      });
      this.addEventListener('mouseleave', () => {
        // Hide menu and restore time opacity
        if (this._menu) {
          this._menu.hide();
        }
        if (this._timeElement) {
          this._timeElement.style.opacity = '1';
        }
      });
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

  // Helpers
  private _getMenuOptions(): CourierInboxListItemActionMenuOption[] {
    const menuTheme = this._theme.inbox?.list?.item?.menu?.item;
    let options: CourierInboxListItemActionMenuOption[] = [];

    const isArchived = !!this._message?.archived;

    // Iterate through list item actions in the order they were specified
    for (const action of this._listItemActions) {
      switch (action.id) {
        case 'read_unread':
          options.push({
            id: this._message?.read ? 'unread' : 'read',
            icon: {
              svg: this._message?.read
                ? (action.unreadIconSVG ?? menuTheme?.unread?.svg ?? CourierIconSVGs.unread)
                : (action.readIconSVG ?? menuTheme?.read?.svg ?? CourierIconSVGs.read),
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
          break;
        case 'archive_unarchive':
          options.push({
            id: isArchived ? 'unarchive' : 'archive',
            icon: {
              svg: isArchived
                ? (action.unarchiveIconSVG ?? menuTheme?.unarchive?.svg ?? CourierIconSVGs.unarchive)
                : (action.archiveIconSVG ?? menuTheme?.archive?.svg ?? CourierIconSVGs.archive),
              color: isArchived ? menuTheme?.unarchive?.color : menuTheme?.archive?.color ?? 'red',
            },
            onClick: () => {
              if (this._message) {
                if (isArchived) {
                  CourierInboxDatastore.shared.unarchiveMessage({ message: this._message });
                } else {
                  CourierInboxDatastore.shared.archiveMessage({ message: this._message });
                }
              }
            },
          });
          break;
      }
    }

    return options;
  }

  // Menu visibility helpers
  private _showMenu(): void {
    const menu = this._theme.inbox?.list?.item?.menu;
    const menuOptions = this._getMenuOptions();

    // Don't show menu if there are no actions enabled
    if (menuOptions.length === 0) {
      return;
    }

    if (menu && menu.enabled && this._menu && this._timeElement) {
      this._menu.setOptions(menuOptions);
      this._menu.show();
      this._timeElement.style.opacity = '0';
    }
  }

  private _hideMenu(): void {
    const menu = this._theme.inbox?.list?.item?.menu;

    if (menu && menu.enabled && this._menu && this._timeElement) {
      this._menu.hide();
      this._timeElement.style.opacity = '1';
    }
  }

  // Public API
  public setMessage(message: InboxMessage): void {
    this._message = message;
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

  public setOnItemVisible(cb: (message: InboxMessage) => void): void {
    this.onItemVisible = cb;
  }

  // Content rendering
  private _updateContent(): void {

    if (!this._message) {
      if (this._titleElement) this._titleElement.textContent = '';
      if (this._subtitleElement) this._subtitleElement.textContent = '';
      return;
    }

    // Unread marker
    this.classList.toggle('unread', !this._message.read);

    if (this._titleElement) {
      this._titleElement.textContent = this._message.title || 'Untitled Message';
    }
    if (this._subtitleElement) {
      const subtitleText = this._message.preview || this._message.body || '';
      if (looksLikeHtml(subtitleText)) {
        this._subtitleElement.innerHTML = sanitizeHtmlForInbox(subtitleText);
      } else {
        this._subtitleElement.textContent = subtitleText;
      }
    }
    if (this._timeElement) {
      this._timeElement.textContent = getMessageTime(this._message);
    }

    // Update menu icons (e.g. read/unread)
    if (this._menu) {
      this._menu.setOptions(this._getMenuOptions());
    }

    // Update actions container
    const hasActions = this._message.actions && this._message.actions.length > 0;
    if (this._actionsContainer) {
      this._actionsContainer.style.display = hasActions ? 'flex' : 'none';
    }

    const actionsTheme = this._theme.inbox?.list?.item?.actions;

    // Add the actions to the actions container
    if (this._actionsContainer && this._message.actions) {
      this._actionsContainer.innerHTML = ""; // Clear previous actions to avoid duplicates
      this._message.actions.forEach(action => {
        // Create the action element
        const actionButton = new CourierButton({
          mode: this._themeManager.mode,
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
        this._actionsContainer?.appendChild(actionButton);
      });
    }
  }
}

registerElement(CourierInboxListItem);
