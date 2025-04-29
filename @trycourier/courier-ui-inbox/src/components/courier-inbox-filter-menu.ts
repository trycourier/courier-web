import { CourierColors, CourierIcon, CourierIconButton, CourierIconSource } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";

export type CourierInboxMenuOption = {
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
      }

      .spacer {
        flex: 1;
      }

      p {
        margin: 0;
        font-size: 14px;
        color: var(--courier-text-primary, ${CourierColors.black[500]});
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

    this._checkIcon = new CourierIcon();
    this._checkIcon.setAttribute('icon', 'check');

    this._content.appendChild(this._itemIcon);
    this._content.appendChild(this._title);
    this._content.appendChild(spacer);
    this._content.appendChild(this._checkIcon);

    shadow.appendChild(style);
    shadow.appendChild(this._content);

    this._checkIcon.style.display = this._isSelected ? 'block' : 'none';
  }

  public setTheme(theme: CourierInboxTheme, icon: string) {
    this._itemIcon.updateSVG(icon);
    this._itemIcon.updateColor(theme.header?.menu?.listItems?.iconColor ?? CourierColors.white[500]);
    this._title.style.color = theme.header?.menu?.listItems?.color ?? CourierColors.white[500];
    this._content.style.setProperty('--courier-list-hover-color', theme.header?.menu?.listItems?.hoverColor ?? CourierColors.white[500]);
    this._content.style.setProperty('--courier-list-active-color', theme.header?.menu?.listItems?.activeColor ?? CourierColors.white[500]);
  }
}

export class CourierInboxFilterMenu extends HTMLElement {

  // State
  private _options: CourierInboxMenuOption[];
  private _selectedIndex: number = 0;

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
        top: 40px;
        right: -10px;
        border-radius: 6px;
        border: 1px solid var(--courier-border-color, ${CourierColors.gray[500]});
        background: var(--courier-background-color, ${CourierColors.white[500]});
        box-shadow: var(--courier-shadow, 0 4px 12px 0 ${CourierColors.gray[500]});
        z-index: 1000;
        min-width: 200px;
        overflow: hidden;
        padding: 4px 0;
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
    this._menuButton.updateColor(theme.header?.menu?.icon?.color ?? CourierColors.white[500]);
    this._menuButton.updateSVG(theme.header?.menu?.icon?.svg ?? CourierIconSource.filter);
    this._menu.style.backgroundColor = theme.header?.menu?.backgroundColor ?? CourierColors.white[500];
    this._menu.style.borderColor = theme.header?.menu?.borderColor ?? CourierColors.gray[500];
    this._menu.style.boxShadow = `${theme.header?.menu?.shadow?.offsetX ?? 0}px ${theme.header?.menu?.shadow?.offsetY ?? 0}px ${theme.header?.menu?.shadow?.blur ?? 10}px ${theme.header?.menu?.shadow?.color ?? CourierColors.gray[500]}`;

    this._options.forEach((option, index) => {
      const menuItem = this._menu.children[index] as CourierInboxMenuItem;
      switch (option.label) {
        case 'Inbox':
          menuItem.setTheme(theme, theme.header?.menu?.listItems?.icons?.inboxSVG ?? CourierIconSource.inbox);
          break;
        case 'Archive':
          menuItem.setTheme(theme, theme.header?.menu?.listItems?.icons?.archiveSVG ?? CourierIconSource.archive);
          break;
      }
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