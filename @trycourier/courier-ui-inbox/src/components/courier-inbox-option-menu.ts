import { CourierIconButton, CourierIconSVGs } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxOptionMenuItem } from "./courier-inbox-option-menu-item";
import { CourierInboxHeaderMenuItemId } from "./courier-inbox-header";

export type CourierInboxMenuOptionType = 'filters' | 'actions';

export type CourierInboxMenuOption = {
  id: CourierInboxHeaderMenuItemId;
  text: string;
  icon: {
    color: string;
    svg: string;
  };
  selectionIcon?: {
    color: string;
    svg: string;
  } | null;
  onClick: (option: CourierInboxMenuOption) => void;
};

export class CourierInboxOptionMenu extends HTMLElement {

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _type: CourierInboxMenuOptionType;
  private _selectedIndex: number = 0;
  private _options: CourierInboxMenuOption[];
  private _selectable: boolean;
  private _onMenuOpen: () => void;

  // Components
  private _menuButton: CourierIconButton;
  private _menu: HTMLDivElement;
  private _style: HTMLStyleElement;

  constructor(themeManager: CourierInboxThemeManager, type: CourierInboxMenuOptionType, selectable: boolean, options: CourierInboxMenuOption[], onMenuOpen: () => void) {
    super();

    this._type = type;
    this._selectable = selectable;
    this._options = options;
    this._selectedIndex = 0;
    this._onMenuOpen = onMenuOpen;

    const shadow = this.attachShadow({ mode: 'open' });

    this._menuButton = new CourierIconButton(type === 'filters' ? CourierIconSVGs.filter : CourierIconSVGs.overflow);
    this._menu = document.createElement('div');
    this._menu.className = `menu ${type}`;

    this._style = document.createElement('style');

    shadow.appendChild(this._style);
    shadow.appendChild(this._menuButton);
    shadow.appendChild(this._menu);

    this._menuButton.addEventListener('click', this.toggleMenu.bind(this));
    document.addEventListener('click', this.handleOutsideClick.bind(this));

    // Handle the theme change
    this._themeSubscription = themeManager.subscribe((_) => {
      this.refreshTheme();
    });

    // Set the theme
    this.refreshTheme();
  }

  private getStyles(): string {
    const theme = this._themeSubscription.manager.getTheme();

    return `
      :host {
        position: relative;
        display: inline-block;
      }

      .menu {
        display: none;
        position: absolute;
        top: 42px;
        right: -6px;
        border-radius: ${theme.inbox?.header?.menus?.popup?.borderRadius ?? '6px'};
        border: ${theme.inbox?.header?.menus?.popup?.border ?? '1px solid red'};
        background: ${theme.inbox?.header?.menus?.popup?.backgroundColor ?? 'red'};
        box-shadow: ${theme.inbox?.header?.menus?.popup?.shadow ?? '0 4px 12px 0 red'};
        z-index: 1000;
        min-width: 200px;
        overflow: hidden;
        padding: 4px 0;
      }

      courier-inbox-filter-menu-item {
        border-bottom: ${theme.inbox?.header?.menus?.popup?.list?.divider ?? 'none'};
      }

      courier-inbox-filter-menu-item:last-child {
        border-bottom: none;
      }
    `;
  }

  private refreshTheme() {
    // Update styles
    this._style.textContent = this.getStyles();

    // Get theme
    const theme = this._themeSubscription.manager.getTheme();

    // Get menu
    const menu = theme.inbox?.header?.menus;
    const isFilter = this._type === 'filters';
    const buttonConfig = isFilter ? menu?.filters?.button : menu?.actions?.button;
    const defaultIcon = isFilter ? CourierIconSVGs.filter : CourierIconSVGs.overflow;

    this._menuButton.updateIconSVG(buttonConfig?.icon?.svg ?? defaultIcon);
    this._menuButton.updateIconColor(buttonConfig?.icon?.color ?? 'red');
    this._menuButton.updateBackgroundColor(buttonConfig?.backgroundColor ?? 'transparent');
    this._menuButton.updateHoverBackgroundColor(buttonConfig?.hoverBackgroundColor ?? 'red');
    this._menuButton.updateActiveBackgroundColor(buttonConfig?.activeBackgroundColor ?? 'red');

    // Reload menu items
    this.refreshMenuItems();
  }

  public setOptions(options: CourierInboxMenuOption[]) {
    this._options = options;
    this.refreshMenuItems();
  }

  private refreshMenuItems() {
    this._menu.innerHTML = '';

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

      this._menu.appendChild(menuItem);
    });
  }

  private toggleMenu(event: Event) {
    event.stopPropagation();
    const isOpening = this._menu.style.display !== 'block';
    this._menu.style.display = isOpening ? 'block' : 'none';

    if (isOpening) {
      this._onMenuOpen();
    }
  }

  private handleOutsideClick(event: MouseEvent) {
    if (!this.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  public closeMenu() {
    this._menu.style.display = 'none';
  }

  public selectOption(option: CourierInboxMenuOption) {
    this._selectedIndex = this._options.findIndex(o => o.id === option.id);
    this.refreshMenuItems();
  }

  disconnectedCallback() {
    this._themeSubscription.unsubscribe();
  }
}

customElements.define('courier-inbox-option-menu', CourierInboxOptionMenu);
