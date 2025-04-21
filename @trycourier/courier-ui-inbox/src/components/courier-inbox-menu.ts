import { CourierIconButton } from "@trycourier/courier-ui-core";
import { CourierInbox } from "./courier-inbox";
import { CourierUnreadCountBadge } from "./courier-unread-count-badge";
import { CourierInboxDataStoreEvents } from "../datastore/datatore-events";
import { CourierInboxDataStoreListener } from "../datastore/datastore-listener";
import { CourierInboxDatastore } from "../datastore/datastore";
import { CourierInboxHeaderFactory, CourierInboxListItemFactory, CourierInboxListItemFactoryProps, CourierInboxPaginationItemFactoryProps, CourierInboxStateEmptyFactoryProps, CourierInboxStateErrorFactoryProps, CourierInboxStateLoadingFactoryProps } from "../types/factories";
import { CourierInboxFeedType } from "../types/feed-type";
export type CourierInboxPopupAlignment = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center-right' | 'center-left' | 'center-center';

export class CourierInboxMenu extends HTMLElement implements CourierInboxDataStoreEvents {

  // State
  private _width: string = '440px';
  private _height: string = '440px';
  private _popupAlignment: CourierInboxPopupAlignment = 'top-right';

  // Components
  private _menuButtonContainer: HTMLDivElement;
  private _triggerButton: CourierIconButton;
  private _popup: HTMLDivElement;
  private _inbox: CourierInbox;
  private _unreadCountBadge: CourierUnreadCountBadge;

  // Callbacks
  private _onMessageClick?: (props: CourierInboxListItemFactoryProps) => void;

  // Listeners
  private _datastoreListener?: CourierInboxDataStoreListener;

  static get observedAttributes() {
    return ['popup-alignment', 'message-click', 'popup-width', 'popup-height'];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    // Create trigger button container
    this._menuButtonContainer = document.createElement('div');
    this._menuButtonContainer.className = 'menu-button-container';

    // Create trigger button
    this._triggerButton = new CourierIconButton('inbox');

    // Create unread count badge
    this._unreadCountBadge = new CourierUnreadCountBadge();
    this._unreadCountBadge.id = 'unread-badge';

    // Create popup container
    this._popup = document.createElement('div');
    this._popup.className = 'popup';

    // Create content container
    this._inbox = new CourierInbox();
    this._inbox.setAttribute('height', '100%');

    const style = document.createElement('style');
    style.textContent = `
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
        background: var(--Background-Default-Primary, #FFF);
        border-radius: 8px;
        border: 1px solid var(--Stroke-Subtle-Primary, #E5E5E5);
        box-shadow: 0px 8px 16px -4px rgba(0, 0, 0, 0.12), 0px 4px 6px -2px rgba(0, 0, 0, 0.06);
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

    shadow.appendChild(style);
    this._menuButtonContainer.appendChild(this._triggerButton);
    this._menuButtonContainer.appendChild(this._unreadCountBadge);
    shadow.appendChild(this._menuButtonContainer);
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
    }
  }

  public onUnreadCountChange(unreadCount: number): void {
    this._unreadCountBadge.setCount(unreadCount);
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
        this._popup.style.top = '40px';
        this._popup.style.right = '0';
        break;
      case 'top-left':
        this._popup.style.top = '40px';
        this._popup.style.left = '0';
        break;
      case 'top-center':
        this._popup.style.top = '40px';
        this._popup.style.left = '50%';
        this._popup.style.transform = 'translateX(-50%)';
        break;
      case 'bottom-right':
        this._popup.style.bottom = '40px';
        this._popup.style.right = '0';
        break;
      case 'bottom-left':
        this._popup.style.bottom = '40px';
        this._popup.style.left = '0';
        break;
      case 'bottom-center':
        this._popup.style.bottom = '40px';
        this._popup.style.left = '50%';
        this._popup.style.transform = 'translateX(-50%)';
        break;
      case 'center-right':
        this._popup.style.top = '50%';
        this._popup.style.right = '40px';
        this._popup.style.transform = 'translateY(-50%)';
        break;
      case 'center-left':
        this._popup.style.top = '50%';
        this._popup.style.left = '40px';
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
  public setPopupHeader(factory: CourierInboxHeaderFactory | undefined | null) {
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

  disconnectedCallback() {
    this._datastoreListener?.remove();
  }
}

if (!customElements.get('courier-inbox-menu')) {
  customElements.define('courier-inbox-menu', CourierInboxMenu);
}
