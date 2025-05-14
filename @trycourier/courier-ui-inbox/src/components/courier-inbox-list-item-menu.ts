import { CourierIconButton } from "@trycourier/courier-ui-core";
import { CourierInboxIcon, CourierInboxTheme } from "../types/courier-inbox-theme";

export type CourierListItemMenuOption = {
  id: string;
  icon: CourierInboxIcon;
  onClick: () => void;
};

export class CourierListItemMenu extends HTMLElement {

  // State
  private _theme: CourierInboxTheme;
  private _options: CourierListItemMenuOption[] = [];

  // Components
  private _style: HTMLStyleElement;

  constructor(theme: CourierInboxTheme) {
    super();
    this._theme = theme;
    const shadow = this.attachShadow({ mode: "open" });

    // Style
    this._style = document.createElement("style");
    this._style.textContent = this.getStyles();
    shadow.appendChild(this._style);

    // Menu container
    const menu = document.createElement("ul");
    menu.className = "menu";
    shadow.appendChild(menu);
  }

  private getStyles(): string {

    const menu = this._theme.inbox?.list?.item?.menu;

    return `
      :host {
        display: block;
        position: absolute;
        padding: 4px;
        background: ${menu?.backgroundColor ?? 'red'};
        border: ${menu?.border ?? "1px solid red"};
        border-radius: ${menu?.borderRadius ?? "4px"};
        box-shadow: ${menu?.shadow ?? "0 2px 8px red"};
        user-select: none;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.15s;
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
        gap: 4px;
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

  setOptions(options: CourierListItemMenuOption[]) {
    this._options = options;
    this.renderMenu();
  }

  private renderMenu() {
    const menu = this.shadowRoot?.querySelector("ul.menu");
    if (!menu) return;
    menu.innerHTML = "";
    const menuTheme = this._theme.inbox?.list?.item?.menu;
    this._options.forEach((opt) => {
      const icon = new CourierIconButton(opt.icon.svg, opt.icon.color, menuTheme?.backgroundColor, menuTheme?.item?.hoverBackgroundColor, menuTheme?.item?.activeBackgroundColor, menuTheme?.item?.borderRadius);
      icon.addEventListener('click', opt.onClick);
      menu.appendChild(icon);
    });
  }

  show() {
    this.classList.add("visible");
  }

  hide() {
    this.classList.remove("visible");
  }
}

if (!customElements.get("courier-list-item-menu")) {
  customElements.define("courier-list-item-menu", CourierListItemMenu);
}