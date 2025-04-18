import { CourierIcon, CourierIconButton } from "@trycourier/courier-ui-core";

export type CourierInboxMenuOption = {
  label: string;
  icon: string;
  onClick: (option: CourierInboxMenuOption) => void;
};

class CourierInboxMenuItem extends HTMLElement {
  private _option: CourierInboxMenuOption;
  private _isSelected: boolean;
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
        background-color: var(--courier-list-hover-color, #f3f4f6);
      }

      :host(:active) {
        background-color: var(--courier-list-active-color, #e5e7eb);
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
        color: var(--courier-text-primary, #111827);
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
}

export class CourierInboxFilterMenu extends HTMLElement {
  private _menuButton: CourierIconButton;
  private _menu: HTMLDivElement;
  private _options: CourierInboxMenuOption[];
  private _selectedIndex: number = 0;

  constructor(props: { options: CourierInboxMenuOption[] }) {
    super();

    this._options = props.options;
    this._selectedIndex = 0;

    const shadow = this.attachShadow({ mode: 'open' });

    this._menuButton = new CourierIconButton('filter');
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
        border: 1px solid var(--Stroke-Subtle-Primary, #E5E5E5);
        background: var(--Background-Default-Primary, #FFF);
        box-shadow: 0px 8px 16px -4px rgba(0, 0, 0, 0.12), 0px 4px 6px -2px rgba(0, 0, 0, 0.06);
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
}

customElements.define('courier-inbox-filter-menu', CourierInboxFilterMenu);
customElements.define('courier-inbox-menu-item', CourierInboxMenuItem);