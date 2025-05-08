import { CourierColors, CourierIconButton, CourierIconSource } from "@trycourier/courier-ui-core";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-bus";
import { CourierInboxFilterMenuItem } from "./courier-inbox-filter-menu-item";

export type CourierInboxMenuOption = {
  id: CourierInboxFeedType;
  label: string;
  icon: string;
  onClick: (option: CourierInboxMenuOption) => void;
};

export class CourierInboxFilterMenu extends HTMLElement {

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _selectedIndex: number = 0;
  private _options: CourierInboxMenuOption[];

  // Components
  private _menuButton: CourierIconButton;
  private _menu: HTMLDivElement;
  private _style: HTMLStyleElement;

  constructor(themeManager: CourierInboxThemeManager, options: CourierInboxMenuOption[]) {
    super();

    this._options = options;
    this._selectedIndex = 0;

    const shadow = this.attachShadow({ mode: 'open' });

    this._menuButton = new CourierIconButton(CourierIconSource.filter);
    this._menu = document.createElement('div');
    this._menu.className = 'menu';

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

    // this.setOptions(options);

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
        border-radius: ${theme.inbox?.header?.menu?.popup?.borderRadius ?? '6px'};
        border: ${theme.inbox?.header?.menu?.popup?.border ?? '1px solid red'};
        background: ${theme.inbox?.header?.menu?.popup?.backgroundColor ?? 'red'};
        box-shadow: ${theme.inbox?.header?.menu?.popup?.shadow ?? '0 4px 12px 0 red'};
        z-index: 1000;
        min-width: 200px;
        overflow: hidden;
        padding: 4px 0;
      }

      courier-inbox-filter-menu-item {
        border-bottom: ${theme.inbox?.header?.menu?.popup?.list?.divider ?? 'none'};
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
    const menu = theme.inbox?.header?.menu;

    // Update menu button
    const button = menu?.button;
    this._menuButton.updateIconColor(button?.icon?.color ?? CourierColors.black[500]);
    this._menuButton.updateIconSVG(button?.icon?.svg ?? CourierIconSource.filter);
    this._menuButton.updateBackgroundColor(button?.backgroundColor ?? 'transparent');
    this._menuButton.updateHoverBackgroundColor(button?.hoverBackgroundColor ?? CourierColors.black[500_10]);
    this._menuButton.updateActiveBackgroundColor(button?.activeBackgroundColor ?? CourierColors.black[500_20]);

    // Reload menu items
    this.reloadMenuItems();
  }

  public setOptions(options: CourierInboxMenuOption[]) {
    this._options = options;
    this.reloadMenuItems();
  }

  private reloadMenuItems() {
    this._menu.innerHTML = '';

    this._options.forEach((option, index) => {
      const menuItem = new CourierInboxFilterMenuItem({ option, isSelected: this._selectedIndex === index, themeManager: this._themeSubscription.manager });

      menuItem.addEventListener('click', () => {
        this._selectedIndex = index;
        option.onClick(option);
        this.reloadMenuItems();
        this._menu.style.display = 'none';
      });

      this._menu.appendChild(menuItem);
    });
  }

  private toggleMenu(event: Event) {
    event.stopPropagation();
    this._menu.style.display = this._menu.style.display === 'block' ? 'none' : 'block';
  }

  private handleOutsideClick(event: MouseEvent) {
    if (!this.contains(event.target as Node)) {
      this._menu.style.display = 'none';
    }
  }

  public selectOption(option: CourierInboxMenuOption) {
    this._selectedIndex = this._options.findIndex(o => o.label === option.label);
    this.reloadMenuItems();
  }

  disconnectedCallback() {
    this._themeSubscription.remove();
  }

}

customElements.define('courier-inbox-filter-menu', CourierInboxFilterMenu);
