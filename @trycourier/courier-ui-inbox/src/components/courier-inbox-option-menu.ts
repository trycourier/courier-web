import { CourierBaseElement, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxOptionMenuItem } from "./courier-inbox-option-menu-item";
import { CourierInboxIconTheme } from "../types/courier-inbox-theme";

export type CourierInboxMenuOption = {
  id: string;
  text: string;
  icon: CourierInboxIconTheme;
  onClick: (option: CourierInboxMenuOption) => void;
};

export type CourierInboxOptionMenuType = 'feed' | 'action';

export class CourierInboxOptionMenu extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox-option-menu';
  }

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _selectedIndex: number = 0;
  private _options: CourierInboxMenuOption[];
  private _selectable: boolean;
  private _onMenuOpen?: () => void;
  private _isOpen: boolean = false;
  private _menuType: CourierInboxOptionMenuType;

  // Components
  private _style?: HTMLStyleElement;
  private _shadowRoot?: ShadowRoot;
  private _container?: HTMLElement;

  constructor(themeManager: CourierInboxThemeManager, selectable: boolean, options: CourierInboxMenuOption[], menuType: CourierInboxOptionMenuType, onMenuOpen?: () => void) {
    super();

    this._selectable = selectable;
    this._options = options;
    this._onMenuOpen = onMenuOpen;
    this._menuType = menuType;

    // Handle the theme change
    this._themeSubscription = themeManager.subscribe((_) => {
      this.refreshTheme();
    });
  }

  onComponentMounted() {
    this.attachElements();
    document.addEventListener('click', this.handleOutsideClick.bind(this));
    this.refreshTheme();
  }

  onComponentUnmounted() {
    this._themeSubscription.unsubscribe();
  }

  private attachElements() {
    // Attach shadow DOM
    this._shadowRoot = this.attachShadow({ mode: 'closed' });

    // Create container element
    this._container = document.createElement('div');
    this._container.className = 'menu-container';

    // Create and add style
    this._style = document.createElement('style');
    this._style.textContent = this.getStyles();
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.appendChild(this._container);
  }

  private getStyles(): string {
    const theme = this._themeSubscription.manager.getTheme();
    const transition = this._menuType === 'feed'
      ? theme.inbox?.header?.feeds?.menu?.animation
      : theme.inbox?.header?.actions?.animation;
    const menuTheme = this._menuType === 'feed'
      ? theme.inbox?.header?.feeds?.menu
      : theme.inbox?.header?.actions?.menu ?? theme.inbox?.header?.feeds?.menu;
    const initialTransform = transition?.initialTransform ?? 'translate3d(0, 0, 0)';
    const visibleTransform = transition?.visibleTransform ?? 'translate3d(0, 0, 0)';

    return `
      :host {
        position: absolute;
        top: 42px;
        border-radius: ${menuTheme?.borderRadius ?? '6px'};
        border: ${menuTheme?.border ?? '1px solid red'};
        background: ${menuTheme?.backgroundColor ?? 'red'};
        box-shadow: ${menuTheme?.shadow ?? '0 4px 12px 0 red'};
        z-index: 1000;
        min-width: 200px;
        overflow: hidden;
        padding: 4px 0;
        user-select: none;
        opacity: 0;
        pointer-events: none;
        transition: ${transition?.transition ?? 'all 0.2s ease'};
        transform: ${initialTransform};
        will-change: transform, opacity;
        display: none;
      }

      :host(.visible) {
        display: block;
        opacity: 1;
        pointer-events: auto;
        transform: ${visibleTransform};
      }

      .menu-container {
        display: flex;
        flex-direction: column;
      }

      courier-inbox-option-menu-item {
        border-bottom: ${menuTheme?.list?.divider ?? 'none'};
      }

      courier-inbox-option-menu-item:last-child {
        border-bottom: none;
      }

      ${CourierInboxOptionMenuItem.id} {
        display: flex;
        flex-direction: row;
        padding: 6px 12px;
        cursor: pointer;
      }

      ${CourierInboxOptionMenuItem.id}:hover {
        background-color: ${menuTheme?.list?.hoverBackgroundColor ?? 'red'};
      }

      ${CourierInboxOptionMenuItem.id}:active {
        background-color: ${menuTheme?.list?.activeBackgroundColor ?? 'red'};
      }

      ${CourierInboxOptionMenuItem.id} .menu-item {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 12px;
      }

      ${CourierInboxOptionMenuItem.id} .spacer {
        flex: 1;
      }

      ${CourierInboxOptionMenuItem.id} p {
        margin: 0;
        font-family: ${menuTheme?.list?.font?.family ?? 'inherit'};
        font-weight: ${menuTheme?.list?.font?.weight ?? 'inherit'};
        font-size: ${menuTheme?.list?.font?.size ?? '14px'};
        color: ${menuTheme?.list?.font?.color ?? 'red'};
        white-space: nowrap;
      }

      ${CourierInboxOptionMenuItem.id} .check-icon {
        display: block;
      }
    `;
  }

  public setPosition(position: { right?: string, left?: string, top?: string }) {
    this.style.left = position.left ?? 'auto';
    this.style.right = position.right ?? 'auto';
    this.style.top = position.top ?? 'auto';
  }

  private refreshTheme() {
    // Update styles
    if (this._style) {
      this._style.textContent = this.getStyles();
    }

    // Reload menu items
    this.refreshMenuItems();
  }

  public setOptions(options: CourierInboxMenuOption[]) {
    this._options = options;
    this.refreshMenuItems();
  }

  private refreshMenuItems() {
    if (!this._container) return;

    const container = this._container;

    // Clear existing items
    container.innerHTML = '';

    this._options.forEach((option, index) => {
      const menuItem = new CourierInboxOptionMenuItem({
        option: option,
        selectable: this._selectable,
        isSelected: this._selectedIndex === index,
        themeManager: this._themeSubscription.manager
      });

      menuItem.addEventListener('click', () => {

        // Select if possible
        if (this._selectable) {
          this.selectionItemAtIndex(index);
        }

        // Handle the click
        option.onClick(option);
        this.closeMenu();

      });

      container.appendChild(menuItem);
    });
  }

  public toggleMenu() {
    this._isOpen = !this._isOpen;
    if (this._isOpen) {
      this.showMenu();
      this._onMenuOpen?.();
    } else {
      this.hideMenu();
    }
  }

  private showMenu() {
    // Set display first
    this.classList.remove('visible');

    // Trigger transition on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.classList.add('visible');
      });
    });
  }

  private hideMenu() {
    // Remove visible class to trigger transition
    this.classList.remove('visible');

    // Wait for transition to complete, then set display none
    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.target !== this) return;
      if (!this.classList.contains('visible')) {
        this.style.display = 'none';
        this.removeEventListener('transitionend', handleTransitionEnd);
      }
    };

    this.addEventListener('transitionend', handleTransitionEnd);
  }

  public closeMenu() {
    this._isOpen = false;
    this.hideMenu();
  }

  private handleOutsideClick(event: MouseEvent) {
    const target = event.target as Node;
    // contains() checks the entire tree including shadow DOM
    if (!this.contains(target)) {
      this.closeMenu();
    }
  }

  public selectionItemAtIndex(index: number) {
    if (!this._selectable || !this._container) {
      return;
    }

    this._selectedIndex = index;

    // Update all menu items to reflect the new selection
    this._options.forEach((_, idx) => {
      const item = this._container?.children[idx] as CourierInboxOptionMenuItem;
      if (item && item.setSelected) {
        item.setSelected(idx === index);
      }
    });
  }

}

registerElement(CourierInboxOptionMenu);
