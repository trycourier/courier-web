import { CourierBaseElement, CourierIcon, CourierIconSVGs, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager } from "../types/courier-inbox-theme-manager";
import { CourierInboxMenuOption } from "./courier-inbox-option-menu";

export class CourierInboxOptionMenuItem extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox-option-menu-item';
  }

  // State
  private _option: CourierInboxMenuOption;
  private _isSelected?: boolean;

  // Components
  private _content: HTMLDivElement;
  private _itemIcon: CourierIcon;
  private _title: HTMLParagraphElement;
  private _selectionIcon: CourierIcon;
  private _style: HTMLStyleElement;

  // Theme
  private _themeManager: CourierInboxThemeManager;

  constructor(props: { option: CourierInboxMenuOption, selectable: boolean, isSelected: boolean, themeManager: CourierInboxThemeManager }) {
    super();

    this._option = props.option;
    this._isSelected = props.isSelected;
    this._themeManager = props.themeManager;

    this._style = document.createElement('style');

    this._content = document.createElement('div');
    this._content.className = 'menu-item';

    this._itemIcon = new CourierIcon(this._option.icon.svg ?? CourierIconSVGs.inbox);
    this._itemIcon.setAttribute('size', '16');

    this._title = document.createElement('p');
    this._title.textContent = this._option.text;

    const spacer = document.createElement('div');
    spacer.className = 'spacer';

    this._selectionIcon = new CourierIcon(CourierIconSVGs.check);

    this._content.appendChild(this._itemIcon);
    this._content.appendChild(this._title);
    this._content.appendChild(spacer);

    // Add check icon if selectable
    if (props.selectable) {
      this._content.appendChild(this._selectionIcon);
    }

    this.appendChild(this._style);
    this.appendChild(this._content);

    this._selectionIcon.style.display = this._isSelected ? 'block' : 'none';

    this.refreshTheme();

  }

  private getStyles(): string {

    const theme = this._themeManager.getTheme();

    return `
      :host {
        display: flex;
        flex-direction: row;
        padding: 6px 12px;
        cursor: pointer;
      }

      :host(:hover) {
        background-color: ${theme.inbox?.header?.menus?.popup?.list?.hoverBackgroundColor ?? 'red'};
      }

      :host(:active) {
        background-color: ${theme.inbox?.header?.menus?.popup?.list?.activeBackgroundColor ?? 'red'};
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
        font-family: ${theme.inbox?.header?.menus?.popup?.list?.font?.family ?? 'inherit'};
        font-weight: ${theme.inbox?.header?.menus?.popup?.list?.font?.weight ?? 'inherit'};
        font-size: ${theme.inbox?.header?.menus?.popup?.list?.font?.size ?? '14px'};
        color: ${theme.inbox?.header?.menus?.popup?.list?.font?.color ?? 'red'};
        white-space: nowrap;
      }

      .check-icon {
        display: none;
      }
    `;
  }

  public refreshTheme() {

    // Update styles
    this._style.textContent = this.getStyles();

    // Set selected icon color
    this._selectionIcon.updateColor(this._option.selectionIcon?.color ?? 'red');
    this._selectionIcon.updateSVG(this._option.selectionIcon?.svg ?? CourierIconSVGs.check);

    this._title.textContent = this._option.text ?? 'Missing Text';
    this._itemIcon.updateColor(this._option.icon?.color ?? 'red');
    this._itemIcon.updateSVG(this._option.icon?.svg ?? CourierIconSVGs.inbox);

  }

}

registerElement(CourierInboxOptionMenuItem);
