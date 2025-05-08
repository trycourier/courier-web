import { CourierInbox } from "./courier-inbox";
import { CourierInboxDataStoreEvents } from "../datastore/datatore-events";
import { CourierInboxDataStoreListener } from "../datastore/datastore-listener";
import { CourierInboxDatastore } from "../datastore/datastore";
import { CourierInboxHeaderFactoryProps, CourierInboxListItemFactoryProps, CourierInboxMenuButtonFactoryProps, CourierInboxPaginationItemFactoryProps, CourierInboxStateEmptyFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxStateLoadingFactoryProps } from "../types/factories";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxMenuButton } from "./courier-inbox-menu-button";
import { defaultLightTheme } from "../types/courier-inbox-theme";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { SystemThemeMode } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager } from "../types/courier-inbox-theme-bus";

export type CourierInboxPopupAlignment = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center-right' | 'center-left' | 'center-center';

export class CourierInboxMenu extends HTMLElement implements CourierInboxDataStoreEvents {

  // State
  private _width: string = '440px';
  private _height: string = '440px';
  private _popupAlignment: CourierInboxPopupAlignment = 'top-right';
  private _top: string = '40px';
  private _right: string = '0';
  private _bottom: string = '40px';
  private _left: string = '0';

  // Theming
  private _themeBus = new CourierInboxThemeManager(defaultLightTheme);
  get theme() {
    return this._themeBus.getTheme();
  }

  public setLightTheme(theme: CourierInboxTheme) {
    this._themeBus.setLightTheme(theme);
  }

  public setDarkTheme(theme: CourierInboxTheme) {
    this._themeBus.setDarkTheme(theme);
  }

  private updateTheme() {
    // console.log('updateTheme', theme, this.theme);
    // // mergeTheme(theme, themeConfig)
    // this._themeBus.setTheme(this.theme);
    this._style.textContent = this.getStyles();
  }

  // Components
  private _triggerButton: CourierInboxMenuButton;
  private _popup: HTMLDivElement;
  private _inbox: CourierInbox;
  private _style: HTMLStyleElement;

  // Callbacks
  private _onMessageClick?: (props: CourierInboxListItemFactoryProps) => void;

  // Listeners
  private _datastoreListener?: CourierInboxDataStoreListener;

  // Factories
  private _popupMenuButtonFactory?: (props: CourierInboxMenuButtonFactoryProps | undefined | null) => HTMLElement;

  static get observedAttributes() {
    return ['popup-alignment', 'message-click', 'popup-width', 'popup-height', 'top', 'right', 'bottom', 'left', 'light-theme', 'dark-theme'];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    // Create trigger button
    this._triggerButton = new CourierInboxMenuButton({
      themeBus: this._themeBus,
    });
    this._triggerButton.build(undefined);

    // Create popup container
    this._popup = document.createElement('div');
    this._popup.className = 'popup';

    // Create content container
    this._inbox = new CourierInbox(this._themeBus);
    this._inbox.setAttribute('height', '100%');

    this._style = document.createElement('style');
    this._style.textContent = this.getStyles();

    shadow.appendChild(this._style);
    shadow.appendChild(this._triggerButton);
    shadow.appendChild(this._popup);
    this._popup.appendChild(this._inbox);
    this._inbox.setMessageClick(this._onMessageClick);

    // Add event listeners
    this._triggerButton.addEventListener('click', this.togglePopup.bind(this));
    document.addEventListener('click', this.handleOutsideClick.bind(this));

    // Initialize popup position
    this.updatePopupPosition();

    // Attach the datastore listener
    this._datastoreListener = new CourierInboxDataStoreListener(this);
    CourierInboxDatastore.shared.addDataStoreListener(this._datastoreListener);

    // Refresh the theme
    this.updateTheme();

    this._themeBus.subscribe(theme => {
      this.updateTheme();
    });

  }

  private getStyles(): string {
    return `
      :host {
        display: inline-block;
        position: relative;
      }

      .menu-button-container {
        position: relative;
        display: inline-block;
      }

      .popup {
        display: none;
        position: absolute;
        background: ${this.theme.popup?.window?.backgroundColor ?? 'red'};
        border-radius: ${this.theme.popup?.window?.borderRadius ?? '8px'};
        border: ${this.theme.popup?.window?.border ?? `1px solid red`};
        box-shadow: ${this.theme.popup?.window?.shadow ?? `0px 8px 16px -4px red`};
        z-index: 1000;
        width: ${this._width};
        height: ${this._height};
        overflow: hidden;
        transform: translateZ(0);
        will-change: transform;
      }
        
      #unread-badge {
        position: absolute;
        top: -8px;
        left: 50%;
        pointer-events: none;
      }

      courier-inbox {
        height: 100%;
      }
    `;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
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
    }
  }

  public onUnreadCountChange(_: number): void {
    this.render();
  }

  public onMessageClick(props: CourierInboxListItemFactoryProps): void {
    this._onMessageClick?.(props);
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
    const isVisible = this._popup.style.display === 'block';

    if (!isVisible) {
      this._popup.style.display = 'block';
    } else {
      this._popup.style.display = 'none';
    }
  }

  private handleOutsideClick(event: MouseEvent) {
    if (!this.contains(event.target as Node)) {
      this._popup.style.display = 'none';
    }
  }

  public setContent(element: HTMLElement) {
    this._inbox.innerHTML = '';
    this._inbox.appendChild(element);
  }

  public setSize(width: string, height: string) {
    this._width = width;
    this._height = height;
    this._popup.style.width = width;
    this._popup.style.height = height;
  }

  public setPosition(position: CourierInboxPopupAlignment) {
    if (this.isValidPosition(position)) {
      this._popupAlignment = position;
      this.updatePopupPosition();
    } else {
      console.error(`Invalid position: ${position}`);
    }
  }

  public setFeedType(feedType: CourierInboxFeedType) {
    this._inbox.setFeedType(feedType);
  }

  // Factory methods
  public setPopupHeader(factory: (props: CourierInboxHeaderFactoryProps | undefined | null) => HTMLElement) {
    this._inbox.setHeader(factory);
  }

  public removePopupHeader() {
    this._inbox.removeHeader();
  }

  public setPopupLoadingState(factory: (props: CourierInboxStateLoadingFactoryProps | undefined | null) => HTMLElement) {
    this._inbox.setLoadingState(factory);
  }

  public setPopupEmptyState(factory: (props: CourierInboxStateEmptyFactoryProps | undefined | null) => HTMLElement) {
    this._inbox.setEmptyState(factory);
  }

  public setPopupErrorState(factory: (props: CourierInboxStateErrorFactoryProps | undefined | null) => HTMLElement) {
    this._inbox.setErrorState(factory);
  }

  public setPopupListItem(factory: (props: CourierInboxListItemFactoryProps | undefined | null) => HTMLElement) {
    this._inbox.setListItem(factory);
  }

  public setPopupPaginationItem(factory: (props: CourierInboxPaginationItemFactoryProps | undefined | null) => HTMLElement) {
    this._inbox.setPaginationItem(factory);
  }

  public setPopupMenuButton(factory: (props: CourierInboxMenuButtonFactoryProps | undefined | null) => HTMLElement) {
    this._popupMenuButtonFactory = factory;
    this.render();
  }

  private render() {
    const unreadCount = CourierInboxDatastore.shared.unreadCount;
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

  disconnectedCallback() {
    this._datastoreListener?.remove();
    this._themeBus.cleanup();
  }
}

if (!customElements.get('courier-inbox-menu')) {
  customElements.define('courier-inbox-menu', CourierInboxMenu);
}
