import { CourierColors, CourierIcon, CourierIconSource } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager } from "../types/courier-inbox-theme-manager";
import { CourierInboxFeedType } from "../types/feed-type";
import { CourierInboxMenuOption } from "./courier-inbox-filter-menu";

export class CourierInboxFilterMenuItem extends HTMLElement {

  // State
  private _option: CourierInboxMenuOption;
  private _isSelected: boolean;

  // Components
  private _content: HTMLDivElement;
  private _itemIcon: CourierIcon;
  private _title: HTMLParagraphElement;
  private _checkIcon: CourierIcon;
  private _style: HTMLStyleElement;

  // Theme
  private _themeManager: CourierInboxThemeManager;

  constructor(props: { option: CourierInboxMenuOption, isSelected: boolean, themeManager: CourierInboxThemeManager }) {
    super();

    this._option = props.option;
    this._isSelected = props.isSelected;
    this._themeManager = props.themeManager;

    const shadow = this.attachShadow({ mode: 'open' });

    this._style = document.createElement('style');

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

    shadow.appendChild(this._style);
    shadow.appendChild(this._content);

    this._checkIcon.style.display = this._isSelected ? 'block' : 'none';

    this.refreshTheme(this._option.id);

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
        background-color: ${theme.inbox?.header?.menu?.popup?.list?.hoverColor ?? 'red'};
      }

      :host(:active) {
        background-color: ${theme.inbox?.header?.menu?.popup?.list?.activeColor ?? 'red'};
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
        font-family: ${theme.inbox?.header?.menu?.popup?.list?.font?.family ?? 'inherit'};
        font-weight: ${theme.inbox?.header?.menu?.popup?.list?.font?.weight ?? 'inherit'};
        font-size: ${theme.inbox?.header?.menu?.popup?.list?.font?.size ?? '14px'};
        color: ${theme.inbox?.header?.menu?.popup?.list?.font?.color ?? 'red'};
      }

      .check-icon {
        display: none;
      }
    `;
  }

  public refreshTheme(feedType: CourierInboxFeedType) {
    const theme = this._themeManager.getTheme();

    const list = theme.inbox?.header?.menu?.popup?.list;

    // Update styles
    this._style.textContent = this.getStyles();

    // Set selected icon color
    this._checkIcon.updateColor(theme.inbox?.header?.menu?.popup?.list?.selectionIcon?.color ?? CourierColors.black[500]);
    this._checkIcon.updateSVG(theme.inbox?.header?.menu?.popup?.list?.selectionIcon?.svg ?? CourierIconSource.check);

    // Update icon based on feed type
    switch (feedType) {
      case 'inbox':
        this._title.textContent = list?.items?.inbox?.text ?? 'Inbox';
        this._itemIcon.updateSVG(list?.items?.inbox?.icon?.svg ?? CourierIconSource.inbox);
        this._itemIcon.updateColor(list?.items?.inbox?.icon?.color ?? CourierColors.black[500]);
        break;
      case 'archive':
        this._title.textContent = list?.items?.archive?.text ?? 'Archive';
        this._itemIcon.updateSVG(list?.items?.archive?.icon?.svg ?? CourierIconSource.archive);
        this._itemIcon.updateColor(list?.items?.archive?.icon?.color ?? CourierColors.black[500]);
        break;
    }
  }

}

customElements.define('courier-inbox-filter-menu-item', CourierInboxFilterMenuItem);