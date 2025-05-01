import { CourierColors, CourierIcon, CourierIconButton, CourierIconSource } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxFeedType } from "../types/feed-type";

export type CourierInboxMenuOption = {
  id: CourierInboxFeedType;
  label: string;
  icon: string;
  onClick: (option: CourierInboxMenuOption) => void;
};

class CourierInboxMenuItem extends HTMLElement {

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
        height: 36px;
        padding: 0 12px;
        cursor: pointer;
      }

      :host(:hover) {
        background-color: var(--courier-list-hover-color, ${CourierColors.gray[200]});
      }

      :host(:active) {
        background-color: var(--courier-list-active-color, ${CourierColors.gray[500]});
      }

      .menu-item {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 12px;
        color: var(--courier-text-primary, ${CourierColors.black[500]});
      }

      .spacer {
        flex: 1;
      }

      p {
        margin: 0;
        font-family: var(--courier-font-family);
        font-size: var(--courier-font-size, 14px);
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

    const menuItem = theme.header?.menu?.popup?.listItems;

    // Set text color
    this.style.setProperty('--courier-text-primary', menuItem?.font?.color ?? CourierColors.black[500]);
    this.style.setProperty('--courier-font-family', menuItem?.font?.family ?? null);
    this.style.setProperty('--courier-font-size', menuItem?.font?.size ?? '14px');

    // Set hover and active colors
    this.style.setProperty('--courier-list-hover-color', menuItem?.hoverColor ?? CourierColors.gray[200]);
    this.style.setProperty('--courier-list-active-color', menuItem?.activeColor ?? CourierColors.gray[500]);

    // Set selected icon color
    this._checkIcon.updateColor(menuItem?.selectionIcon?.color ?? CourierColors.white[500]);
    this._checkIcon.updateSVG(menuItem?.selectionIcon?.svg ?? CourierIconSource.inbox);

    // Update icon based on feed type
    switch (feedType) {
      case 'inbox':
        this._title.textContent = menuItem?.inbox?.title ?? 'Inbox';
        this._itemIcon.updateSVG(menuItem?.inbox?.icon?.svg ?? CourierIconSource.inbox);
        this._itemIcon.updateColor(menuItem?.inbox?.icon?.color ?? CourierColors.black[500]);
        break;
      case 'archive':
        this._title.textContent = menuItem?.archive?.title ?? 'Archive';
        this._itemIcon.updateSVG(menuItem?.archive?.icon?.svg ?? CourierIconSource.archive);
        this._itemIcon.updateColor(menuItem?.archive?.icon?.color ?? CourierColors.black[500]);
        break;
    }
  }

}

export class CourierInboxFilterMenu extends HTMLElement {

  // State
  private _options: CourierInboxMenuOption[];
  private _selectedIndex: number = 0;
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
        border-radius: var(--courier-border-radius, 6px);
        border: var(--courier-border-width, 1px) solid var(--courier-border-color, ${CourierColors.gray[500]});
        background: var(--courier-background-color, ${CourierColors.white[500]});
        box-shadow: var(--courier-shadow, 0 4px 12px 0 ${CourierColors.gray[500]});
        z-index: 1000;
        min-width: 200px;
        overflow: hidden;
        padding: 4px 0;
      }

      courier-inbox-menu-item {
        border-bottom: var(--courier-divider-width, 0px) solid var(--courier-divider-color, ${CourierColors.gray[500]});
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
    const menu = theme.header?.menu;

    // Update menu button
    this._menuButton.updateIconColor(menu?.button?.icon?.color ?? CourierColors.white[500]);
    this._menuButton.updateIconSVG(menu?.button?.icon?.svg ?? CourierIconSource.filter);
    this._menuButton.updateBackgroundColor(menu?.button?.backgroundColor ?? CourierColors.white[500]);
    this._menuButton.updateHoverBackgroundColor(menu?.button?.hoverBackgroundColor ?? CourierColors.white[500]);
    this._menuButton.updateActiveBackgroundColor(menu?.button?.activeBackgroundColor ?? CourierColors.white[500]);

    // Update menu
    this.style.setProperty('--courier-divider-width', menu?.popup?.listItems?.divider?.width ?? '0px');
    this.style.setProperty('--courier-divider-color', menu?.popup?.listItems?.divider?.color ?? 'transparent');
    this.style.setProperty('--courier-border-radius', menu?.popup?.borderRadius ?? '6px');
    this.style.setProperty('--courier-background-color', menu?.popup?.backgroundColor ?? CourierColors.white[500]);
    this.style.setProperty('--courier-border-color', menu?.popup?.borderColor ?? CourierColors.gray[500]);
    this.style.setProperty('--courier-border-width', menu?.popup?.borderWidth ?? '1px');
    this.style.setProperty('--courier-shadow', `${menu?.popup?.shadow?.offsetX ?? 0}px ${menu?.popup?.shadow?.offsetY ?? 0}px ${menu?.popup?.shadow?.blur ?? 10}px ${menu?.popup?.shadow?.color ?? CourierColors.gray[500]}`);

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