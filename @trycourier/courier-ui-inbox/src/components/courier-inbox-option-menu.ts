import { CourierBaseElement, CourierIconButton, CourierIconSVGs, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxOptionMenuItem } from "./courier-inbox-option-menu-item";
import { CourierInboxHeaderMenuItemId } from "./courier-inbox-header";
import { CourierInboxIconTheme } from "../types/courier-inbox-theme";

export type CourierInboxMenuOptionType = 'filters' | 'actions';

export type CourierInboxMenuOption = {
  id: CourierInboxHeaderMenuItemId;
  text: string;
  icon: CourierInboxIconTheme;
  selectionIcon?: CourierInboxIconTheme | null;
  onClick: (option: CourierInboxMenuOption) => void;
};

export class CourierInboxOptionMenu extends CourierBaseElement {

  private static readonly MENU_BORDER_PADDING_PX = 6;

  static get id(): string {
    return 'courier-inbox-option-menu';
  }

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _type: CourierInboxMenuOptionType;
  private _selectedIndex: number = 0;
  private _options: CourierInboxMenuOption[];
  private _selectable: boolean;
  private _onMenuOpen: () => void;

  // Components
  private _menuButton?: CourierIconButton;
  private _menu?: HTMLDivElement;
  private _style?: HTMLStyleElement;

  constructor(themeManager: CourierInboxThemeManager, type: CourierInboxMenuOptionType, selectable: boolean, options: CourierInboxMenuOption[], onMenuOpen: () => void) {
    super();

    this._type = type;
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

    this._menuButton = new CourierIconButton(this._type === 'filters' ? CourierIconSVGs.chevronDown : CourierIconSVGs.overflow);
    this._menu = document.createElement('div');
    this._menu.className = `menu ${this._type}`;

    this.appendChild(this._menuButton);
    this.appendChild(this._menu);

    this._menuButton.addEventListener('click', this.toggleMenu.bind(this));
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
        position: relative;
        display: inline-block;
      }

      ${CourierInboxOptionMenu.id} .menu {
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

      ${CourierInboxOptionMenu.id} .menu.anchor-right {
        right: -${CourierInboxOptionMenu.MENU_BORDER_PADDING_PX}px;
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

  private refreshTheme() {
    // Update styles
    if (this._style) {
      this._style.textContent = this.getStyles();
    }

    // Get theme
    const theme = this._themeSubscription.manager.getTheme();

    // Get menu
    const menu = theme.inbox?.header?.menus;
    const isFilter = this._type === 'filters';
    const buttonConfig = isFilter ? menu?.filters?.button : menu?.actions?.button;
    const defaultIcon = isFilter ? CourierIconSVGs.chevronDown : CourierIconSVGs.overflow;

    // Actions menu is anchored right, filter menu position is calculated dynamically
    if (!isFilter) {
      this._menu?.classList.add('anchor-right');
    } else {
      this._menu?.classList.remove('anchor-right');
    }

    this._menuButton?.updateIconSVG(buttonConfig?.icon?.svg ?? defaultIcon);
    this._menuButton?.updateIconColor(buttonConfig?.icon?.color ?? 'red');
    this._menuButton?.updateBackgroundColor(buttonConfig?.backgroundColor ?? 'transparent');
    this._menuButton?.updateHoverBackgroundColor(buttonConfig?.hoverBackgroundColor ?? 'red');
    this._menuButton?.updateActiveBackgroundColor(buttonConfig?.activeBackgroundColor ?? 'red');

    // Reload menu items
    this.refreshMenuItems();
  }

  public setOptions(options: CourierInboxMenuOption[]) {
    this._options = options;
    this.refreshMenuItems();
  }

  private refreshMenuItems() {
    if (this._menu) {
      this._menu.innerHTML = '';
    }

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

      this._menu?.appendChild(menuItem);
    });
  }

  /** Calculate the left offset relative to the inbox header to anchor the menu to the left border. */
  private calculateMenuLeftOffset(): number {
    if (!this._menu) {
      return 0;
    }

    const rect = this.getBoundingClientRect();
    const inboxHeader = this.closest('courier-inbox-header');
    if (!inboxHeader) {
      return 0;
    }

    const headerRect = inboxHeader.getBoundingClientRect();
    const offsetFromLeft = rect.left - headerRect.left;
    return offsetFromLeft;
  }

  private toggleMenu(event: Event) {
    event.stopPropagation();
    const isOpening = this._menu?.style.display !== 'block';
    if (this._menu) {
      this._menu.style.display = isOpening ? 'block' : 'none';
    }

    if (this._menu && this._type === 'filters') {
      const leftOffset = this.calculateMenuLeftOffset();
      this._menu.style.left = `-${leftOffset - CourierInboxOptionMenu.MENU_BORDER_PADDING_PX}px`
    }

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
    if (this._menu) {
      this._menu.style.display = 'none';
    }
  }

  public selectOption(option: CourierInboxMenuOption) {
    this._selectedIndex = this._options.findIndex(o => o.id === option.id);
    this.refreshMenuItems();
  }

}

registerElement(CourierInboxOptionMenu);
