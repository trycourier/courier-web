import { CourierInbox } from "./courier-inbox";
import { CourierInboxDatastoreEvents } from "../datastore/datatore-events";
import { CourierInboxDataStoreListener } from "../datastore/datastore-listener";
import { CourierInboxDatastore } from "../datastore/inbox-datastore";
import { CourierInboxHeaderFactoryProps, CourierInboxListItemActionFactoryProps, CourierInboxListItemFactoryProps, CourierInboxMenuButtonFactoryProps, CourierInboxPaginationItemFactoryProps, CourierInboxStateEmptyFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxStateLoadingFactoryProps } from "../types/factories";
import { CourierInboxFeed } from "../types/inbox-data-set";
import { CourierInboxMenuButton } from "./courier-inbox-menu-button";
import { defaultLightTheme } from "../types/courier-inbox-theme";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxThemeManager } from "../types/courier-inbox-theme-manager";
import { CourierComponentThemeMode, injectGlobalStyle } from "@trycourier/courier-ui-core";
import { Courier } from "@trycourier/courier-js";
import { CourierBaseElement, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxHeaderAction, CourierInboxListItemAction } from "../types/inbox-defaults";

export type CourierInboxPopupAlignment = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center-right' | 'center-left' | 'center-center';

export class CourierInboxPopupMenu extends CourierBaseElement implements CourierInboxDatastoreEvents {

  static get id(): string {
    return 'courier-inbox-popup-menu';
  }

  // State
  private _width: string = '440px';
  private _height: string = '440px';
  private _popupAlignment: CourierInboxPopupAlignment = 'top-left';
  private _top?: string = undefined;
  private _right?: string = undefined;
  private _bottom?: string = undefined;
  private _left?: string = undefined;

  // Theming
  private _themeManager = new CourierInboxThemeManager(defaultLightTheme);

  /** Returns the current theme object. */
  get theme() {
    return this._themeManager.getTheme();
  }

  /**
   * Set the light theme for the popup menu.
   * @param theme The light theme object to set.
   */
  public setLightTheme(theme: CourierInboxTheme) {
    this._themeManager.setLightTheme(theme);
  }

  /**
   * Set the dark theme for the popup menu.
   * @param theme The dark theme object to set.
   */
  public setDarkTheme(theme: CourierInboxTheme) {
    this._themeManager.setDarkTheme(theme);
  }

  /**
   * Set the theme mode (light/dark/system).
   * @param mode The theme mode to set.
   */
  public setMode(mode: CourierComponentThemeMode) {
    this._themeManager.setMode(mode);
  }

  // Components
  private _triggerButton?: CourierInboxMenuButton;
  private _popup?: HTMLDivElement;
  private _inbox?: CourierInbox;
  private _style?: HTMLStyleElement;

  // Listeners
  private _datastoreListener?: CourierInboxDataStoreListener;

  // Factories
  private _popupMenuButtonFactory?: (props: CourierInboxMenuButtonFactoryProps | undefined | null) => HTMLElement;

  static get observedAttributes() {
    return ['popup-alignment', 'message-click', 'message-action-click', 'message-long-press', 'popup-width', 'popup-height', 'top', 'right', 'bottom', 'left', 'light-theme', 'dark-theme', 'mode'];
  }

  constructor() {
    super();

    // Refresh the theme on change
    this._themeManager.subscribe((_) => {
      this.refreshTheme();
    });

  }

  onComponentMounted() {
    // Read initial theme attributes
    this.readInitialThemeAttributes();

    // Inject the styles to the head
    this._style = injectGlobalStyle(CourierInboxPopupMenu.id, CourierInboxPopupMenu.getStyles(this.theme, this._width, this._height));

    // Create trigger button
    this._triggerButton = new CourierInboxMenuButton(this._themeManager);

    // Create popup container
    this._popup = document.createElement('div');
    this._popup.className = 'popup';

    // Create content container
    this._inbox = new CourierInbox(this._themeManager);
    this._inbox.setAttribute('height', '100%');

    this.refreshTheme();

    this.appendChild(this._triggerButton);
    this.appendChild(this._popup);
    this._popup.appendChild(this._inbox);

    // Add event listeners
    this._triggerButton.addEventListener('click', this.togglePopup.bind(this));
    document.addEventListener('click', this.handleOutsideClick.bind(this));

    // Initialize popup position
    this.updatePopupPosition();

    // Attach the datastore listener
    this._datastoreListener = new CourierInboxDataStoreListener(this);
    CourierInboxDatastore.shared.addDataStoreListener(this._datastoreListener);

    // Initial render so any pre-configured factories (like setMenuButton) are applied
    this.render();
  }

  onComponentUnmounted() {
    this._style?.remove();
    this._datastoreListener?.remove();
    this._themeManager.cleanup();
  }

  private readInitialThemeAttributes() {
    const lightTheme = this.getAttribute('light-theme');
    if (lightTheme) {
      try {
        this.setLightTheme(JSON.parse(lightTheme));
      } catch (error) {
        Courier.shared.client?.options.logger?.error('Failed to parse light-theme attribute:', error);
      }
    }

    const darkTheme = this.getAttribute('dark-theme');
    if (darkTheme) {
      try {
        this.setDarkTheme(JSON.parse(darkTheme));
      } catch (error) {
        Courier.shared.client?.options.logger?.error('Failed to parse dark-theme attribute:', error);
      }
    }

    const mode = this.getAttribute('mode');
    if (mode) {
      this._themeManager.setMode(mode as CourierComponentThemeMode);
    }
  }

  private refreshTheme() {
    if (this._style) {
      this._style.textContent = CourierInboxPopupMenu.getStyles(this.theme, this._width, this._height);
    }
  }

  static getStyles(theme: CourierInboxTheme, width: string, height: string): string {
    const transition = theme.popup?.window?.animation;
    const initialTransform = transition?.initialTransform ?? 'translate3d(-10px, -10px, 0) scale(0.9)';
    const visibleTransform = transition?.visibleTransform ?? 'translate3d(0, 0, 0) scale(1)';

    return `
      ${CourierInboxPopupMenu.id} {
        display: inline-block;
        position: relative;
      }

      ${CourierInboxPopupMenu.id} .popup {
        display: none;
        position: absolute;
        background: ${theme.popup?.window?.backgroundColor ?? 'red'};
        border-radius: ${theme.popup?.window?.borderRadius ?? '8px'};
        border: ${theme.popup?.window?.border ?? `1px solid red`};
        box-shadow: ${theme.popup?.window?.shadow ?? `0px 8px 16px -4px red`};
        z-index: 1000;
        width: ${width};
        height: ${height};
        overflow: hidden;
        transform: ${initialTransform};
        will-change: transform, opacity;
        transition: ${transition?.transition ?? 'all 0.2s ease'};
        opacity: 0;
      }

      ${CourierInboxPopupMenu.id} .popup.displayed {
        display: block;
      }

      ${CourierInboxPopupMenu.id} .popup.visible {
        opacity: 1;
        transform: ${visibleTransform};
      }

      ${CourierInboxPopupMenu.id} courier-inbox {
        height: 100%;
      }
    `;
  }

  attributeChangedCallback(name: string, _: string, newValue: string) {
    switch (name) {
      case 'popup-alignment':
        if (this.isValidPosition(newValue)) {
          this._popupAlignment = newValue as CourierInboxPopupAlignment;
          this.updatePopupPosition();
        }
        break;
      case 'popup-width':
        this._width = newValue;
        this.setSize(newValue, this._height);
        break;
      case 'popup-height':
        this._height = newValue;
        this.setSize(this._width, newValue);
        break;
      case 'top':
        this._top = newValue;
        this.updatePopupPosition();
        break;
      case 'right':
        this._right = newValue;
        this.updatePopupPosition();
        break;
      case 'bottom':
        this._bottom = newValue;
        this.updatePopupPosition();
        break;
      case 'left':
        this._left = newValue;
        this.updatePopupPosition();
        break;
      case 'light-theme':
        if (newValue) {
          this.setLightTheme(JSON.parse(newValue));
        }
        break;
      case 'dark-theme':
        if (newValue) {
          this.setDarkTheme(JSON.parse(newValue));
        }
        break;
      case 'mode':
        this._themeManager.setMode(newValue as CourierComponentThemeMode);
        break;
    }
  }

  /**
   * Called when the unread count changes.
   * @param _ The new unread count (unused).
   */
  public onUnreadCountChange(_: number): void {
    this.render();
  }

  /**
   * Set a handler for message click events.
   * @param handler The function to call when a message is clicked.
   */
  public onMessageClick(handler?: (props: CourierInboxListItemFactoryProps) => void) {
    this._inbox?.onMessageClick((props) => {
      if (handler) {
        handler(props);
      }
      this.closePopup();
    });
  }

  /**
   * Set a handler for message action click events.
   * @param handler The function to call when a message action is clicked.
   */
  public onMessageActionClick(handler?: (props: CourierInboxListItemActionFactoryProps) => void) {
    this._inbox?.onMessageActionClick((props) => {
      if (handler) {
        handler(props);
      }
      this.closePopup();
    });
  }

  /**
   * Set a handler for message long press events.
   * @param handler The function to call when a message is long pressed.
   */
  public onMessageLongPress(handler?: (props: CourierInboxListItemFactoryProps) => void) {
    this._inbox?.onMessageLongPress((props) => {
      if (handler) {
        handler(props);
      }
      this.closePopup();
    });
  }

  private isValidPosition(value: string): value is CourierInboxPopupAlignment {
    const validPositions: CourierInboxPopupAlignment[] = [
      'top-right', 'top-left', 'top-center',
      'bottom-right', 'bottom-left', 'bottom-center',
      'center-right', 'center-left', 'center-center'
    ];
    return validPositions.includes(value as CourierInboxPopupAlignment);
  }

  private updatePopupPosition() {
    if (!this._popup) return;

    // Reset all positions
    this._popup.style.top = '';
    this._popup.style.bottom = '';
    this._popup.style.left = '';
    this._popup.style.right = '';
    this._popup.style.margin = '';
    this._popup.style.transform = '';

    switch (this._popupAlignment) {
      case 'top-right':
        this._popup.style.top = this._top ?? '40px';
        this._popup.style.right = this._right ?? '0px';
        break;
      case 'top-left':
        this._popup.style.top = this._top ?? '40px';
        this._popup.style.left = this._left ?? '0px';
        break;
      case 'top-center':
        this._popup.style.top = this._top ?? '40px';
        this._popup.style.left = '50%';
        this._popup.style.transform = 'translateX(-50%)';
        break;
      case 'bottom-right':
        this._popup.style.bottom = this._bottom ?? '40px';
        this._popup.style.right = this._right ?? '0px';
        break;
      case 'bottom-left':
        this._popup.style.bottom = this._bottom ?? '40px';
        this._popup.style.left = this._left ?? '0px';
        break;
      case 'bottom-center':
        this._popup.style.bottom = this._bottom ?? '40px';
        this._popup.style.left = '50%';
        this._popup.style.transform = 'translateX(-50%)';
        break;
      case 'center-right':
        this._popup.style.top = '50%';
        this._popup.style.right = this._right ?? '40px';
        this._popup.style.transform = 'translateY(-50%)';
        break;
      case 'center-left':
        this._popup.style.top = '50%';
        this._popup.style.left = this._left ?? '40px';
        this._popup.style.transform = 'translateY(-50%)';
        break;
      case 'center-center':
        this._popup.style.top = '50%';
        this._popup.style.left = '50%';
        this._popup.style.transform = 'translate(-50%, -50%)';
        break;
    }
  }

  /**
   * Toggle the popup menu open/closed.
   * @param event The click event that triggered the toggle.
   */
  private togglePopup(event: Event) {
    event.stopPropagation();
    if (!this._popup) return;

    const isVisible = this._popup.classList.contains('visible');
    if (isVisible) {
      this.hidePopup();
    } else {
      this.showPopup();
    }
  }

  /**
   * Show the popup menu with transition.
   */
  private showPopup() {
    if (!this._popup) return;

    // Remove visible class first to reset state
    this._popup.classList.remove('visible');
    
    // Add displayed class to set display: block (but keep opacity 0 and initial transform)
    this._popup.classList.add('displayed');

    // Trigger transition on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (this._popup) {
          this._popup.classList.add('visible');
        }
      });
    });
  }

  /**
   * Hide the popup menu with transition.
   */
  private hidePopup() {
    if (!this._popup) return;

    // Remove visible class to trigger transition
    this._popup.classList.remove('visible');

    // If there is no transition, remove the displayed class immediately
    const style = window.getComputedStyle(this._popup);
    const durations = style.transitionDuration.split(',').map(d => parseFloat(d) || 0);
    const hasTransition = durations.some(d => d > 0);
    if (!hasTransition) {
      this._popup.classList.remove('displayed');
      return;
    }

    // Wait for transition to complete, then remove displayed class
    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.target !== this._popup) return;
      if (e.propertyName !== 'opacity') return;
      if (this._popup && !this._popup.classList.contains('visible')) {
        this._popup.classList.remove('displayed');
        this._popup.removeEventListener('transitionend', handleTransitionEnd);
      }
    };

    this._popup.addEventListener('transitionend', handleTransitionEnd);
  }

  /**
   * Close the popup menu.
   */
  public closePopup() {
    this.hidePopup();
  }

  private handleOutsideClick = (event: MouseEvent) => {
    if (!this._popup) return;

    // Nodes the click may legally occur inside without closing the popup
    const SAFE_SELECTORS = [
      'courier-inbox-option-menu',
    ];

    // composedPath() gives us every node (even inside shadow DOMs)
    const clickIsInsideAllowedArea = event
      .composedPath()
      .some(node => {
        if (!(node instanceof HTMLElement)) return false;
        if (node === this._popup || this._popup!.contains(node)) return true;
        return SAFE_SELECTORS.some(sel => node.matches(sel));
      });

    if (clickIsInsideAllowedArea) return;

    // Otherwise, it really was an outside click – hide the popup
    this.hidePopup();
  };

  /**
   * Set the content of the popup inbox.
   * @param element The HTMLElement to set as the content.
   */
  public setContent(element: HTMLElement) {
    if (!this._inbox) return;
    this._inbox.innerHTML = '';
    this._inbox.appendChild(element);
  }

  /**
   * Set the size of the popup menu.
   * @param width The width to set.
   * @param height The height to set.
   */
  public setSize(width: string, height: string) {
    this._width = width;
    this._height = height;
    if (!this._popup) return;
    this._popup.style.width = width;
    this._popup.style.height = height;
  }

  /**
   * Set the popup alignment/position.
   * @param position The alignment/position to set.
   */
  public setPosition(position: CourierInboxPopupAlignment) {
    if (this.isValidPosition(position)) {
      this._popupAlignment = position;
      this.updatePopupPosition();
    } else {
      Courier.shared.client?.options.logger?.error(`Invalid position: ${position}`);
    }
  }

  // Factory methods
  /**
   * Set a custom header factory for the inbox.
   * @param factory The factory function for the header.
   */
  public setHeader(factory: (props: CourierInboxHeaderFactoryProps | undefined | null) => HTMLElement) {
    this._inbox?.setHeader(factory);
  }

  /**
   * Remove the custom header from the inbox.
   */
  public removeHeader() {
    this._inbox?.removeHeader();
  }

  /**
   * Set a custom loading state factory for the inbox.
   * @param factory The factory function for the loading state.
   */
  public setLoadingState(factory: (props: CourierInboxStateLoadingFactoryProps | undefined | null) => HTMLElement) {
    this._inbox?.setLoadingState(factory);
  }

  /**
   * Set a custom empty state factory for the inbox.
   * @param factory The factory function for the empty state.
   */
  public setEmptyState(factory: (props: CourierInboxStateEmptyFactoryProps | undefined | null) => HTMLElement) {
    this._inbox?.setEmptyState(factory);
  }

  /**
   * Set a custom error state factory for the inbox.
   * @param factory The factory function for the error state.
   */
  public setErrorState(factory: (props: CourierInboxStateErrorFactoryProps | undefined | null) => HTMLElement) {
    this._inbox?.setErrorState(factory);
  }

  /**
   * Set a custom list item factory for the inbox.
   * @param factory The factory function for the list item.
   */
  public setListItem(factory: (props: CourierInboxListItemFactoryProps | undefined | null) => HTMLElement) {
    this._inbox?.setListItem(factory);
  }

  /**
   * Set a custom pagination item factory for the inbox.
   * @param factory The factory function for the pagination item.
   */
  public setPaginationItem(factory: (props: CourierInboxPaginationItemFactoryProps | undefined | null) => HTMLElement) {
    this._inbox?.setPaginationItem(factory);
  }

  /**
   * Set a custom menu button factory for the popup trigger.
   * @param factory The factory function for the menu button.
   */
  public setMenuButton(factory: (props: CourierInboxMenuButtonFactoryProps | undefined | null) => HTMLElement) {
    this._popupMenuButtonFactory = factory;
    this.render();
  }

  /**
   * Sets the active feed for the inbox.
   * @param feedId The feed ID to display.
   */
  public selectFeed(feedId: string) {
    this._inbox?.selectFeed(feedId);
  }

  /**
   * Switches to a tab by updating components and loading data.
   * @param tabId The tab ID to switch to.
   */
  public selectTab(tabId: string) {
    this._inbox?.selectTab(tabId);
  }

  /**
   * Set the feeds for this Inbox, replacing any existing feeds.
   * @param feeds The list of feeds to set for the Inbox.
   */
  public setFeeds(feeds: CourierInboxFeed[]) {
    this._inbox?.setFeeds(feeds);
  }

  /**
   * Get the current set of feeds.
   */
  public getFeeds() {
    return this._inbox?.getFeeds() ?? [];
  }

  /**
   * Sets the enabled header actions for the inbox.
   * @param actions - The header actions to enable (e.g., [{ id: 'readAll', iconSVG: '...', text: '...' }]).
   */
  public setActions(actions: CourierInboxHeaderAction[]) {
    this._inbox?.setActions(actions);
  }

  /**
   * Sets the enabled list item actions for the inbox.
   * @param actions - The list item actions to enable (e.g., [{ id: 'read_unread', readIconSVG: '...', unreadIconSVG: '...' }]).
   */
  public setListItemActions(actions: CourierInboxListItemAction[]) {
    this._inbox?.setListItemActions(actions);
  }

  /**
   * Returns the current feed type.
   */
  get currentFeedId(): string {
    return this._inbox?.currentFeedId ?? '';
  }

  /**
   * Forces a reload of the inbox data, bypassing the cache.
   */
  public async refresh() {
    return this._inbox?.refresh();
  }

  private render() {
    const unreadCount = CourierInboxDatastore.shared.unreadCount;
    if (!this._triggerButton) return;

    switch (this._popupMenuButtonFactory) {
      case undefined:
      case null:
        this._triggerButton.build(undefined);
        this._triggerButton.onUnreadCountChange(unreadCount);
        break;
      default:
        const customButton = this._popupMenuButtonFactory({ unreadCount });
        this._triggerButton.build(customButton);
        break;
    }
  }

}

registerElement(CourierInboxPopupMenu);