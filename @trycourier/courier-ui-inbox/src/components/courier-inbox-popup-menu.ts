import { CourierInbox } from "./courier-inbox";
import { CourierInboxDatastoreEvents } from "../datastore/datatore-events";
import { CourierInboxDataStoreListener } from "../datastore/datastore-listener";
import { CourierInboxDatastore } from "../datastore/datastore";
import { CourierInboxHeaderFactoryProps, CourierInboxListItemActionFactoryProps, CourierInboxListItemFactoryProps, CourierInboxMenuButtonFactoryProps, CourierInboxPaginationItemFactoryProps, CourierInboxStateEmptyFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxStateLoadingFactoryProps } from "../types/factories";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxMenuButton } from "./courier-inbox-menu-button";
import { defaultLightTheme } from "../types/courier-inbox-theme";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxThemeManager } from "../types/courier-inbox-theme-manager";
import { CourierComponentThemeMode, injectGlobalStyle } from "@trycourier/courier-ui-core";
import { Courier } from "@trycourier/courier-js";
import { CourierBaseElement, registerElement } from "@trycourier/courier-ui-core";

export type CourierInboxPopupAlignment = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center-right' | 'center-left' | 'center-center';

export class CourierInboxPopupMenu extends CourierBaseElement implements CourierInboxDatastoreEvents {

  static get id(): string {
    return 'courier-inbox-popup-menu';
  }

  // State
  private _width: string = '440px';
  private _height: string = '440px';
  private _popupAlignment: CourierInboxPopupAlignment = 'top-right';
  private _top: string = '40px';
  private _right: string = '0';
  private _bottom: string = '40px';
  private _left: string = '0';

  // Theming
  private _themeManager = new CourierInboxThemeManager(defaultLightTheme);
  get theme() {
    return this._themeManager.getTheme();
  }

  public setLightTheme(theme: CourierInboxTheme) {
    this._themeManager.setLightTheme(theme);
  }

  public setDarkTheme(theme: CourierInboxTheme) {
    this._themeManager.setDarkTheme(theme);
  }

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

    // Inject the styles to the head
    this._style = injectGlobalStyle(CourierInboxPopupMenu.id, CourierInboxPopupMenu.getStyles(this.theme, this._width, this._height));

    // Create trigger button
    this._triggerButton = new CourierInboxMenuButton(this._themeManager);
    this._triggerButton.build(undefined);

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

  }

  onComponentUnmounted() {
    this._style?.remove();
    this._datastoreListener?.remove();
    this._themeManager.cleanup();
  }

  private refreshTheme() {
    if (this._style) {
      this._style.textContent = CourierInboxPopupMenu.getStyles(this.theme, this._width, this._height);
    }
  }

  static getStyles(theme: CourierInboxTheme, width: string, height: string): string {
    return `
      ${CourierInboxPopupMenu.id} {
        display: inline-block;
        position: relative;
      }

      ${CourierInboxPopupMenu.id} .menu-button-container {
        position: relative;
        display: inline-block;
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
        transform: translateZ(0);
        will-change: transform;
      }
        
      ${CourierInboxPopupMenu.id} #unread-badge {
        position: absolute;
        top: -8px;
        left: 50%;
        pointer-events: none;
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

  public onUnreadCountChange(_: number): void {
    this.render();
  }

  public onMessageClick(handler?: (props: CourierInboxListItemFactoryProps) => void) {
    this._inbox?.onMessageClick(handler);
  }

  public onMessageActionClick(handler?: (props: CourierInboxListItemActionFactoryProps) => void) {
    this._inbox?.onMessageActionClick(handler);
  }

  public onMessageLongPress(handler?: (props: CourierInboxListItemFactoryProps) => void) {
    this._inbox?.onMessageLongPress(handler);
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
        this._popup.style.top = this._top;
        this._popup.style.right = this._right;
        break;
      case 'top-left':
        this._popup.style.top = this._top;
        this._popup.style.left = this._left;
        break;
      case 'top-center':
        this._popup.style.top = this._top;
        this._popup.style.left = '50%';
        this._popup.style.transform = 'translateX(-50%)';
        break;
      case 'bottom-right':
        this._popup.style.bottom = this._bottom;
        this._popup.style.right = this._right;
        break;
      case 'bottom-left':
        this._popup.style.bottom = this._bottom;
        this._popup.style.left = this._left;
        break;
      case 'bottom-center':
        this._popup.style.bottom = this._bottom;
        this._popup.style.left = '50%';
        this._popup.style.transform = 'translateX(-50%)';
        break;
      case 'center-right':
        this._popup.style.top = '50%';
        this._popup.style.right = this._right;
        this._popup.style.transform = 'translateY(-50%)';
        break;
      case 'center-left':
        this._popup.style.top = '50%';
        this._popup.style.left = this._left;
        this._popup.style.transform = 'translateY(-50%)';
        break;
      case 'center-center':
        this._popup.style.top = '50%';
        this._popup.style.left = '50%';
        this._popup.style.transform = 'translate(-50%, -50%)';
        break;
    }
  }

  private togglePopup(event: Event) {
    event.stopPropagation();
    if (!this._popup) return;

    const isVisible = this._popup.style.display === 'block';
    this._popup.style.display = isVisible ? 'none' : 'block';
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
    this._popup.style.display = 'none';
  };

  public setContent(element: HTMLElement) {
    if (!this._inbox) return;
    this._inbox.innerHTML = '';
    this._inbox.appendChild(element);
  }

  public setSize(width: string, height: string) {
    this._width = width;
    this._height = height;
    if (!this._popup) return;
    this._popup.style.width = width;
    this._popup.style.height = height;
  }

  public setPosition(position: CourierInboxPopupAlignment) {
    if (this.isValidPosition(position)) {
      this._popupAlignment = position;
      this.updatePopupPosition();
    } else {
      Courier.shared.client?.options.logger?.error(`Invalid position: ${position}`);
    }
  }

  public setFeedType(feedType: CourierInboxFeedType) {
    this._inbox?.setFeedType(feedType);
  }

  // Factory methods
  public setHeader(factory: (props: CourierInboxHeaderFactoryProps | undefined | null) => HTMLElement) {
    this._inbox?.setHeader(factory);
  }

  public removeHeader() {
    this._inbox?.removeHeader();
  }

  public setLoadingState(factory: (props: CourierInboxStateLoadingFactoryProps | undefined | null) => HTMLElement) {
    this._inbox?.setLoadingState(factory);
  }

  public setEmptyState(factory: (props: CourierInboxStateEmptyFactoryProps | undefined | null) => HTMLElement) {
    this._inbox?.setEmptyState(factory);
  }

  public setErrorState(factory: (props: CourierInboxStateErrorFactoryProps | undefined | null) => HTMLElement) {
    this._inbox?.setErrorState(factory);
  }

  public setListItem(factory: (props: CourierInboxListItemFactoryProps | undefined | null) => HTMLElement) {
    this._inbox?.setListItem(factory);
  }

  public setPaginationItem(factory: (props: CourierInboxPaginationItemFactoryProps | undefined | null) => HTMLElement) {
    this._inbox?.setPaginationItem(factory);
  }

  public setMenuButton(factory: (props: CourierInboxMenuButtonFactoryProps | undefined | null) => HTMLElement) {
    this._popupMenuButtonFactory = factory;
    this.render();
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
