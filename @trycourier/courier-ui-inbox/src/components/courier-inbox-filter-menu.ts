import { CourierIcon, CourierIconButton } from "@trycourier/courier-ui-core";

export type CourierInboxMenuOption = {
  label: string;
  icon: string;
  onClick: () => void;
};

class CourierInboxMenuItem extends HTMLElement {
  private option: CourierInboxMenuOption;
  private isSelected: boolean;
  private content: HTMLDivElement;
  private itemIcon: CourierIcon;
  private _title: HTMLParagraphElement;
  private checkIcon: CourierIcon;

  constructor(option: CourierInboxMenuOption, isSelected: boolean) {
    super();

    this.option = option;
    this.isSelected = isSelected;

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

    this.content = document.createElement('div');
    this.content.className = 'menu-item';

    this.itemIcon = new CourierIcon();
    this.itemIcon.setAttribute('svg', this.option.icon);
    this.itemIcon.setAttribute('size', '16');

    this._title = document.createElement('p');
    this._title.textContent = this.option.label;

    const spacer = document.createElement('div');
    spacer.className = 'spacer';

    this.checkIcon = new CourierIcon();
    this.checkIcon.setAttribute('icon', 'check');

    this.content.appendChild(this.itemIcon);
    this.content.appendChild(this._title);
    this.content.appendChild(spacer);
    this.content.appendChild(this.checkIcon);

    shadow.appendChild(style);
    shadow.appendChild(this.content);

    this.checkIcon.style.display = this.isSelected ? 'block' : 'none';
  }
}

export class CourierInboxFilterMenu extends HTMLElement {
  private menuButton: CourierIconButton;
  private menu: HTMLDivElement;
  private options: CourierInboxMenuOption[];
  private selectedIndex: number = 0;

  constructor(options: CourierInboxMenuOption[]) {
    super();

    this.options = options;
    this.selectedIndex = 0;

    const shadow = this.attachShadow({ mode: 'open' });

    this.menuButton = new CourierIconButton('filter');
    this.menu = document.createElement('div');
    this.menu.className = 'menu';

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
    shadow.appendChild(this.menuButton);
    shadow.appendChild(this.menu);

    this.menuButton.addEventListener('click', this.toggleMenu.bind(this));
    document.addEventListener('click', this.handleOutsideClick.bind(this));

    this.setOptions(options);
  }

  public setOptions(options: CourierInboxMenuOption[]) {
    this.options = options;
    this.renderMenu();
  }

  private renderMenu() {
    this.menu.innerHTML = '';

    this.options.forEach((option, index) => {
      const menuItem = new CourierInboxMenuItem(option, this.selectedIndex === index);

      menuItem.addEventListener('click', () => {
        this.selectedIndex = index;
        option.onClick();
        this.renderMenu();
        this.menu.style.display = 'none';
      });

      this.menu.appendChild(menuItem);
    });
  }

  private toggleMenu(event: Event) {
    event.stopPropagation();
    this.menu.style.display = this.menu.style.display === 'block' ? 'none' : 'block';
  }

  private handleOutsideClick(event: MouseEvent) {
    if (!this.contains(event.target as Node)) {
      this.menu.style.display = 'none';
    }
  }

  public getSelectedOption(): CourierInboxMenuOption | null {
    return this.options[this.selectedIndex];
  }
}

if (!customElements.get('courier-inbox-filter-menu')) {
  customElements.define('courier-inbox-filter-menu', CourierInboxFilterMenu);
}

if (!customElements.get('courier-inbox-menu-item')) {
  customElements.define('courier-inbox-menu-item', CourierInboxMenuItem);
}
