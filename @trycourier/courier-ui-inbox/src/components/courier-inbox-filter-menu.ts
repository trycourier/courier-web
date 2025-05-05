import { CourierColors, CourierIcon, CourierIconButton, CourierIconSource } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxThemeBus } from "../types/courier-inbox-theme-bus";
import { CourierInboxFilterMenuItem } from "./courier-inbox-filter-menu-item";

export type CourierInboxMenuOption = {
  id: CourierInboxFeedType;
  label: string;
  icon: string;
  onClick: (option: CourierInboxMenuOption) => void;
};

export class CourierInboxFilterMenu extends HTMLElement {

  // Theme
  private _themeSubscription: AbortController;

  // State
  private _selectedIndex: number = 0;
  private _options: CourierInboxMenuOption[];
  private _theme?: CourierInboxTheme;

  // Components
  private _menuButton: CourierIconButton;
  private _menu: HTMLDivElement;

  constructor(props: { themeBus: CourierInboxThemeBus, options: CourierInboxMenuOption[] }) {
    super();

    this._options = props.options;
    this._selectedIndex = 0;

    const shadow = this.attachShadow({ mode: 'open' });

    this._menuButton = new CourierIconButton(CourierIconSource.filter);
    this._menu = document.createElement('div');
    this._menu.className = 'menu';

    const style = document.createElement('style');
    style.textContent = `
      :host {
        position: relative;
        display: inline-block;
      }

      .menu {
        display: none;
        position: absolute;
        top: 42px;
        right: -6px;
        border-radius: var(--menu-border-radius, 6px);
        border: var(--menu-border, 1px solid ${CourierColors.gray[500]});
        background: var(--menu-background-color, ${CourierColors.white[500]});
        box-shadow: var(--menu-shadow, 0 4px 12px 0 ${CourierColors.gray[500]});
        z-index: 1000;
        min-width: 200px;
        overflow: hidden;
        padding: 4px 0;
      }

      courier-inbox-menu-item {
        border-bottom: var(--menu-divider, none);
      }

      courier-inbox-menu-item:last-child {
        border-bottom: none;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this._menuButton);
    shadow.appendChild(this._menu);

    this._menuButton.addEventListener('click', this.toggleMenu.bind(this));
    document.addEventListener('click', this.handleOutsideClick.bind(this));

    this.setOptions(props.options);

    // Handle the theme change
    this._themeSubscription = props.themeBus.subscribe((theme: CourierInboxTheme) => {
      this.setTheme(theme);
    });

  }

  public setTheme(theme: CourierInboxTheme) {
    this._theme = theme;
    const menu = theme.inbox?.header?.menu;

    // Update menu button
    const button = menu?.button;
    this._menuButton.updateIconColor(button?.icon?.color ?? CourierColors.black[500]);
    this._menuButton.updateIconSVG(button?.icon?.svg ?? CourierIconSource.filter);
    this._menuButton.updateBackgroundColor(button?.backgroundColor ?? 'transparent');
    this._menuButton.updateHoverBackgroundColor(button?.hoverBackgroundColor ?? CourierColors.black[500_10]);
    this._menuButton.updateActiveBackgroundColor(button?.activeBackgroundColor ?? CourierColors.black[500_20]);

    // Update menu
    const popup = menu?.popup;
    this.style.setProperty('--menu-divider', popup?.list?.divider ?? `transparent`);
    this.style.setProperty('--menu-border-radius', popup?.borderRadius ?? '6px');
    this.style.setProperty('--menu-background-color', popup?.backgroundColor ?? CourierColors.white[500]);
    this.style.setProperty('--menu-border', popup?.border ?? `1px solid ${CourierColors.gray[500]}`);
    this.style.setProperty('--menu-shadow', popup?.shadow ?? `0px 8px 16px -4px ${CourierColors.gray[500]}`);

    // Update menu items
    this._options.forEach((option, index) => {
      const menuItem = this._menu.children[index] as CourierInboxFilterMenuItem;
      menuItem.setTheme(option.id, theme);
    });
  }

  public setOptions(options: CourierInboxMenuOption[]) {
    this._options = options;
    this.render();
  }

  private render() {
    this._menu.innerHTML = '';

    this._options.forEach((option, index) => {
      const menuItem = new CourierInboxFilterMenuItem({ option, isSelected: this._selectedIndex === index });
      menuItem.setTheme(option.id, this._theme);

      menuItem.addEventListener('click', () => {
        this._selectedIndex = index;
        option.onClick(option);
        this.render();
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
    this.render();
  }

  disconnectedCallback() {
    this._themeSubscription.abort();
  }

}

customElements.define('courier-inbox-filter-menu', CourierInboxFilterMenu);
