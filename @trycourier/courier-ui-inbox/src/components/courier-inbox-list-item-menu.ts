import { CourierBaseElement, CourierIconButton, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxIcon, CourierInboxTheme } from "../types/courier-inbox-theme";

export type CourierInboxListItemActionMenuOption = {
  id: string;
  icon: CourierInboxIcon;
  onClick: () => void;
};

export class CourierInboxListItemMenu extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox-list-item-menu';
  }

  // State
  private _theme: CourierInboxTheme;
  private _options: CourierInboxListItemActionMenuOption[] = [];

  // Components
  private _style: HTMLStyleElement;

  constructor(theme: CourierInboxTheme) {
    super();
    this._theme = theme;

    // Style
    this._style = document.createElement("style");
    this._style.textContent = this.getStyles();
    this.appendChild(this._style);

    // Menu container
    const menu = document.createElement("ul");
    menu.className = "menu";
    this.appendChild(menu);

  }

  private getStyles(): string {

    const menu = this._theme.inbox?.list?.item?.menu;

    return `
      :host {
        display: block;
        position: absolute;
        background: ${menu?.backgroundColor ?? 'red'};
        border: ${menu?.border ?? "1px solid red"};
        border-radius: ${menu?.borderRadius ?? '0px'};
        box-shadow: ${menu?.shadow ?? "0 2px 8px red"};
        user-select: none;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.15s;
        overflow: hidden;
      }

      :host(.visible) {
        opacity: 1;
        pointer-events: auto;
      }

      ul.menu {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
      }

      li.menu-item {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-bottom: none;
        background: transparent;
      }
    `;
  }

  setOptions(options: CourierInboxListItemActionMenuOption[]) {
    this._options = options;
    this.renderMenu();
  }

  private renderMenu() {
    // Clear existing menu items
    const menu = this.shadowRoot?.querySelector("ul.menu");
    if (!menu) return;
    menu.innerHTML = "";
    const menuTheme = this._theme.inbox?.list?.item?.menu;

    // Prevent click events from propagating outside of this menu
    const cancelEvent = (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
    };

    // Create new menu items
    this._options.forEach((opt) => {
      const icon = new CourierIconButton(opt.icon.svg, opt.icon.color, menuTheme?.backgroundColor, menuTheme?.item?.hoverBackgroundColor, menuTheme?.item?.activeBackgroundColor, menuTheme?.item?.borderRadius);

      // Handle both click and touch events
      const handleInteraction = (e: Event) => {
        cancelEvent(e);
        opt.onClick();
      };

      // Add click handler for desktop
      icon.addEventListener('click', handleInteraction);

      // Add touch handlers for mobile
      icon.addEventListener('touchstart', cancelEvent);
      icon.addEventListener('touchend', handleInteraction);

      // Prevent default touch behavior
      icon.addEventListener('touchmove', cancelEvent);

      // Prevent mouse events from interfering
      icon.addEventListener('mousedown', cancelEvent);
      icon.addEventListener('mouseup', cancelEvent);

      menu.appendChild(icon);
    });
  }

  show() {
    this.classList.add('visible');
  }

  hide() {
    this.classList.remove('visible');
  }
}

registerElement(CourierInboxListItemMenu);