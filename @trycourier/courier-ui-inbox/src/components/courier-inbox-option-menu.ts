import { CourierBaseElement, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxOptionMenuItem } from "./courier-inbox-option-menu-item";
import { CourierInboxIconTheme } from "../types/courier-inbox-theme";

export type CourierInboxMenuOptionType = 'filters' | 'actions';

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
    this._selectedIndex = 0;
    this._onMenuOpen = onMenuOpen;

    // Handle the theme change
    this._themeSubscription = themeManager.subscribe((_) => {
      this.refreshTheme();
    });

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
        display: none;
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
        display: none;
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
        this._selectedIndex = index;
        option.onClick(option);
        this.refreshMenuItems();
        this.closeMenu();
      });

      this.appendChild(menuItem);
    });
  }

  // /** Calculate the left offset relative to the inbox header to anchor the menu to the left border. */
  // private calculateMenuLeftOffset(): number {
  //   if (!this._menu) {
  //     return 0;
  //   }

  //   const rect = this.getBoundingClientRect();
  //   const inboxHeader = this.closest('courier-inbox-header');
  //   if (!inboxHeader) {
  //     return 0;
  //   }

  //   const headerRect = inboxHeader.getBoundingClientRect();
  //   const offsetFromLeft = rect.left - headerRect.left;
  //   return offsetFromLeft;
  // }

  public toggleMenu() {
    this._isOpen = !this._isOpen;
    this.classList.toggle('open', this._isOpen);
    if (this._isOpen) {
      this._onMenuOpen?.();
    }
  }

  public closeMenu() {
    this._isOpen = false;
    this.classList.remove('open');
  }

  private handleOutsideClick(event: MouseEvent) {
    if (!this.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  public selectOption(option: CourierInboxMenuOption) {
    this._selectedIndex = this._options.findIndex(o => o.id === option.id);
    this.refreshMenuItems();
  }

  public setVisible(visible: boolean) {
    this.style.display = visible ? 'inline-block' : 'none';
  }

}

registerElement(CourierInboxOptionMenu);
