import { CourierColors, CourierIcon, CourierIconButton, CourierIconSource, CourierSystemThemeElement } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxFeedType } from "../types/feed-type";
import { getFallbackTheme } from "../utils/theme";

export type CourierInboxMenuOption = {
  id: CourierInboxFeedType;
  label: string;
  icon: string;
  onClick: (option: CourierInboxMenuOption) => void;
};

class CourierInboxMenuItem extends CourierSystemThemeElement {

  // State
  private _option: CourierInboxMenuOption;
  private _isSelected: boolean;

  // Components
  private _content: HTMLDivElement;
  private _itemIcon: CourierIcon;
  private _title: HTMLParagraphElement;
  private _checkIcon: CourierIcon;

  constructor(props: { option: CourierInboxMenuOption, isSelected: boolean }) {
    super();

    this._option = props.option;
    this._isSelected = props.isSelected;

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: flex;
        flex-direction: row;
        padding: 6px 12px;
        cursor: pointer;
      }

      :host(:hover) {
        background-color: var(--hover-color, ${getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.hoverColor ?? CourierColors.gray[200]});
      }

      :host(:active) {
        background-color: var(--active-color, ${getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.activeColor ?? CourierColors.gray[500]});
      }

      .menu-item {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 12px;
        color: var(--text-color, ${getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.font?.color ?? CourierColors.black[500]});
      }

      .spacer {
        flex: 1;
      }

      p {
        margin: 0;
        font-family: var(--font-family);
        font-size: var(--font-size, ${getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.font?.size ?? '14px'});
      }

      .check-icon {
        display: none;
      }
    `;

    this._content = document.createElement('div');
    this._content.className = 'menu-item';

    this._itemIcon = new CourierIcon();
    this._itemIcon.setAttribute('svg', this._option.icon);
    this._itemIcon.setAttribute('size', '16');

    this._title = document.createElement('p');
    this._title.textContent = this._option.label;

    const spacer = document.createElement('div');
    spacer.className = 'spacer';

    this._checkIcon = new CourierIcon(CourierIconSource.check);

    this._content.appendChild(this._itemIcon);
    this._content.appendChild(this._title);
    this._content.appendChild(spacer);
    this._content.appendChild(this._checkIcon);

    shadow.appendChild(style);
    shadow.appendChild(this._content);

    this._checkIcon.style.display = this._isSelected ? 'block' : 'none';

  }

  public setTheme(feedType: CourierInboxFeedType, theme?: CourierInboxTheme) {
    if (!theme) {
      return;
    }

    const list = theme.inbox?.header?.menu?.popup?.list;

    // Set text color
    this.style.setProperty('--text-color', list?.font?.color ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.font?.color ?? CourierColors.black[500]);
    this.style.setProperty('--font-family', list?.font?.family ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.font?.family ?? null);
    this.style.setProperty('--font-size', list?.font?.size ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.font?.size ?? '14px');

    // Set hover and active colors
    this.style.setProperty('--hover-color', list?.hoverColor ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.hoverColor ?? CourierColors.gray[200]);
    this.style.setProperty('--active-color', list?.activeColor ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.activeColor ?? CourierColors.gray[500]);

    // Set selected icon color
    this._checkIcon.updateColor(list?.selectionIcon?.color ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.selectionIcon?.color ?? CourierColors.black[500]);
    this._checkIcon.updateSVG(list?.selectionIcon?.svg ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.selectionIcon?.svg ?? CourierIconSource.check);

    // Update icon based on feed type
    switch (feedType) {
      case 'inbox':
        this._title.textContent = list?.items?.inbox?.title ?? 'Inbox';
        this._itemIcon.updateSVG(list?.items?.inbox?.icon?.svg ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.items?.inbox?.icon?.svg ?? CourierIconSource.inbox);
        this._itemIcon.updateColor(list?.items?.inbox?.icon?.color ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.items?.inbox?.icon?.color ?? CourierColors.black[500]);
        break;
      case 'archive':
        this._title.textContent = list?.items?.archive?.title ?? 'Archive';
        this._itemIcon.updateSVG(list?.items?.archive?.icon?.svg ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.items?.archive?.icon?.svg ?? CourierIconSource.archive);
        this._itemIcon.updateColor(list?.items?.archive?.icon?.color ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.items?.archive?.icon?.color ?? CourierColors.black[500]);
        break;
    }
  }

}

export class CourierInboxFilterMenu extends CourierSystemThemeElement {

  // State
  private _selectedIndex: number = 0;
  private _options: CourierInboxMenuOption[];
  private _theme?: CourierInboxTheme;

  // Components
  private _menuButton: CourierIconButton;
  private _menu: HTMLDivElement;

  constructor(props: { options: CourierInboxMenuOption[] }) {
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
        border-radius: var(--menu-border-radius, ${getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.borderRadius ?? '6px'});
        border: var(--menu-border, 1px solid ${getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.border ?? `1px solid ${CourierColors.gray[500]}`});
        background: var(--menu-background-color, ${getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.backgroundColor ?? CourierColors.white[500]});
        box-shadow: var(--menu-shadow, ${getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.shadow ?? `0 4px 12px 0 ${CourierColors.gray[500]}`});
        z-index: 1000;
        min-width: 200px;
        overflow: hidden;
        padding: 4px 0;
      }

      courier-inbox-menu-item {
        border-bottom: var(--menu-divider, ${getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.divider ?? `transparent`});
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
  }

  public setTheme(theme: CourierInboxTheme) {
    this._theme = theme;
    const menu = theme.inbox?.header?.menu;

    // Update menu button
    const button = menu?.button;
    this._menuButton.updateIconColor(button?.icon?.color ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.button?.icon?.color ?? CourierColors.black[500]);
    this._menuButton.updateIconSVG(button?.icon?.svg ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.button?.icon?.svg ?? CourierIconSource.filter);
    this._menuButton.updateBackgroundColor(button?.backgroundColor ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.button?.backgroundColor ?? 'transparent');
    this._menuButton.updateHoverBackgroundColor(button?.hoverBackgroundColor ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.button?.hoverBackgroundColor ?? CourierColors.black[500_10]);
    this._menuButton.updateActiveBackgroundColor(button?.activeBackgroundColor ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.button?.activeBackgroundColor ?? CourierColors.black[500_20]);

    // Update menu
    const popup = menu?.popup;
    this.style.setProperty('--menu-divider', popup?.list?.divider ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.list?.divider ?? `transparent`);
    this.style.setProperty('--menu-border-radius', popup?.borderRadius ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.borderRadius ?? '6px');
    this.style.setProperty('--menu-background-color', popup?.backgroundColor ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.backgroundColor ?? CourierColors.white[500]);
    this.style.setProperty('--menu-border', popup?.border ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.border ?? `1px solid ${CourierColors.gray[500]}`);
    this.style.setProperty('--menu-shadow', popup?.shadow ?? getFallbackTheme(this.currentSystemTheme).inbox?.header?.menu?.popup?.shadow ?? `0px 8px 16px -4px ${CourierColors.gray[500]}`);

    // Update menu items
    this._options.forEach((option, index) => {
      const menuItem = this._menu.children[index] as CourierInboxMenuItem;
      menuItem.setTheme(option.id, theme);
    });
  }

  public setOptions(options: CourierInboxMenuOption[]) {
    this._options = options;
    this.renderMenu();
  }

  private renderMenu() {
    this._menu.innerHTML = '';

    this._options.forEach((option, index) => {
      const menuItem = new CourierInboxMenuItem({ option, isSelected: this._selectedIndex === index });
      menuItem.setTheme(option.id, this._theme);

      menuItem.addEventListener('click', () => {
        this._selectedIndex = index;
        option.onClick(option);
        this.renderMenu();
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
    this.renderMenu();
  }

}

customElements.define('courier-inbox-filter-menu', CourierInboxFilterMenu);
customElements.define('courier-inbox-menu-item', CourierInboxMenuItem);