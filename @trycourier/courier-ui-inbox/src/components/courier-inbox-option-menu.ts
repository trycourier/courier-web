import { CourierBaseElement, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxOptionMenuItem } from "./courier-inbox-option-menu-item";
import { CourierInboxIconTheme } from "../types/courier-inbox-theme";

export type CourierInboxMenuOption = {
  id: string;
  text: string;
  icon: CourierInboxIconTheme;
  onClick: (option: CourierInboxMenuOption) => void;
};

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

  // Components
  private _style?: HTMLStyleElement;

  constructor(themeManager: CourierInboxThemeManager, selectable: boolean, options: CourierInboxMenuOption[], onMenuOpen?: () => void) {
    super();

    this._selectable = selectable;
    this._options = options;
    this._onMenuOpen = onMenuOpen;

    // Handle the theme change
    this._themeSubscription = themeManager.subscribe((_) => {
      this.refreshTheme();
    });

    // Initial class: closed (not open by default)
    this.classList.add('closed');
  }

  onComponentMounted() {
    this._style = injectGlobalStyle(CourierInboxOptionMenu.id, this.getStyles());
    document.addEventListener('click', this.handleOutsideClick.bind(this));
    this.refreshTheme();
  }

  onComponentUnmounted() {
    this._themeSubscription.unsubscribe();
    this._style?.remove();
  }

  private getStyles(): string {
    const theme = this._themeSubscription.manager.getTheme();

    return `
      ${CourierInboxOptionMenu.id} {
        position: absolute;
        top: 42px;
        border-radius: ${theme.inbox?.header?.menus?.popup?.borderRadius ?? '6px'};
        border: ${theme.inbox?.header?.menus?.popup?.border ?? '1px solid red'};
        background: ${theme.inbox?.header?.menus?.popup?.backgroundColor ?? 'red'};
        box-shadow: ${theme.inbox?.header?.menus?.popup?.shadow ?? '0 4px 12px 0 red'};
        z-index: 1000;
        min-width: 200px;
        overflow: hidden;
        padding: 4px 0;
      }

      ${CourierInboxOptionMenu.id}.open {
        display: block;
      }

      ${CourierInboxOptionMenu.id}.closed {
        display: none;
      }

      ${CourierInboxOptionMenu.id} courier-inbox-filter-menu-item {
        border-bottom: ${theme.inbox?.header?.menus?.popup?.list?.divider ?? 'none'};
      }

      ${CourierInboxOptionMenu.id} courier-inbox-filter-menu-item:last-child {
        border-bottom: none;
      }

      ${CourierInboxOptionMenuItem.id} {
        display: flex;
        flex-direction: row;
        padding: 6px 12px;
        cursor: pointer;
      }

      ${CourierInboxOptionMenuItem.id}:hover {
        background-color: ${theme.inbox?.header?.menus?.popup?.list?.hoverBackgroundColor ?? 'red'};
      }

      ${CourierInboxOptionMenuItem.id}:active {
        background-color: ${theme.inbox?.header?.menus?.popup?.list?.activeBackgroundColor ?? 'red'};
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
        font-family: ${theme.inbox?.header?.menus?.popup?.list?.font?.family ?? 'inherit'};
        font-weight: ${theme.inbox?.header?.menus?.popup?.list?.font?.weight ?? 'inherit'};
        font-size: ${theme.inbox?.header?.menus?.popup?.list?.font?.size ?? '14px'};
        color: ${theme.inbox?.header?.menus?.popup?.list?.font?.color ?? 'red'};
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
    this.innerHTML = '';

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

      this.appendChild(menuItem);
    });
  }

  public toggleMenu() {
    this._isOpen = !this._isOpen;
    this.classList.toggle('open', this._isOpen);
    this.classList.toggle('closed', !this._isOpen);
    if (this._isOpen) {
      this._onMenuOpen?.();
    }
  }

  public closeMenu() {
    this._isOpen = false;
    this.classList.remove('open');
    this.classList.add('closed');
  }

  private handleOutsideClick(event: MouseEvent) {
    if (!this.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  public selectionItemAtIndex(index: number) {
    if (!this._selectable) {
      return;
    }

    this._selectedIndex = index;

    // Update all menu items to reflect the new selection
    this._options.forEach((_, idx) => {
      const item = this.children[idx] as CourierInboxOptionMenuItem;
      if (item && item.setSelected) {
        item.setSelected(idx === index);
      }
    });
  }

  public setVisible(visible: boolean) {
    this.style.display = visible ? 'inline-block' : 'none';
  }

}

registerElement(CourierInboxOptionMenu);
