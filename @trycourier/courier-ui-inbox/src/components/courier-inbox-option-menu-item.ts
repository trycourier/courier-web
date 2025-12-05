import { CourierBaseElement, CourierIcon, CourierIconSVGs, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager } from "../types/courier-inbox-theme-manager";
import { CourierInboxMenuOption } from "./courier-inbox-option-menu";

export class CourierInboxOptionMenuItem extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox-option-menu-item';
  }

  // State
  private _option: CourierInboxMenuOption;
  private _isSelectedable: boolean;
  private _isSelected?: boolean;
  private _theme: CourierInboxThemeManager;

  // Components
  private _content?: HTMLDivElement;
  private _itemIcon?: CourierIcon;
  private _title?: HTMLParagraphElement;
  private _selectionIcon?: CourierIcon;

  constructor(props: { option: CourierInboxMenuOption, selectable: boolean, isSelected: boolean, themeManager: CourierInboxThemeManager }) {
    super();
    this._option = props.option;
    this._isSelected = props.isSelected;
    this._isSelectedable = props.selectable;
    this._theme = props.themeManager;
  }

  onComponentMounted() {

    this._content = document.createElement('div');
    this._content.className = 'menu-item';

    this._itemIcon = new CourierIcon(this._option.icon.svg ?? CourierIconSVGs.inbox);
    this._itemIcon.setAttribute('size', '16');

    this._title = document.createElement('p');
    this._title.textContent = this._option.text;

    const spacer = document.createElement('div');
    spacer.className = 'spacer';

    this._selectionIcon = new CourierIcon(CourierIconSVGs.check);
    this._selectionIcon.classList.add('check-icon');

    this._content.appendChild(this._itemIcon);
    this._content.appendChild(this._title);
    this._content.appendChild(spacer);

    // Add check icon if selectable
    if (this._isSelectedable) {
      this._content.appendChild(this._selectionIcon);
    }

    this.appendChild(this._content);

    this.updateSelectionState();

    this.refreshTheme();

  }

  public refreshTheme() {

    // Set title text
    if (this._title) {
      this._title.textContent = this._option.text ?? 'Missing Text';
    }

    // Set selected icon color
    const theme = this._theme.getTheme();
    this._selectionIcon?.updateColor(theme.inbox?.header?.menus?.popup?.list?.selectionIcon?.color ?? 'red');
    this._selectionIcon?.updateSVG(theme.inbox?.header?.menus?.popup?.list?.selectionIcon?.svg ?? CourierIconSVGs.check);

    // Set item icon color and SVG
    this._itemIcon?.updateColor(this._option.icon?.color ?? 'red');
    this._itemIcon?.updateSVG(this._option.icon?.svg ?? CourierIconSVGs.inbox);

  }

  public setSelected(isSelected: boolean) {
    this._isSelected = isSelected;
    this.updateSelectionState();
  }

  private updateSelectionState() {
    if (this._selectionIcon) {
      this._selectionIcon.style.display = this._isSelected ? 'block' : 'none';
    }
  }

}

registerElement(CourierInboxOptionMenuItem);
