import { CourierColors, CourierIcon, CourierIconSource } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
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

  constructor(props: { option: CourierInboxMenuOption, isSelected: boolean }) {
    super();

    this._option = props.option;
    this._isSelected = props.isSelected;

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = this.getStyles();

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

  private getStyles(): string {
    return `
      :host {
        display: flex;
        flex-direction: row;
        padding: 6px 12px;
        cursor: pointer;
      }

      :host(:hover) {
        background-color: var(--hover-color, ${CourierColors.gray[200]});
      }

      :host(:active) {
        background-color: var(--active-color, ${CourierColors.gray[500]});
      }

      .menu-item {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 12px;
        color: var(--text-color, ${CourierColors.black[500]});
      }

      .spacer {
        flex: 1;
      }

      p {
        margin: 0;
        font-family: var(--font-family);
        font-size: var(--font-size, 14px);
      }

      .check-icon {
        display: none;
      }
    `;
  }

  public setTheme(feedType: CourierInboxFeedType, theme?: CourierInboxTheme) {
    if (!theme) {
      return;
    }

    const list = theme.inbox?.header?.menu?.popup?.list;

    // Set text color
    this.style.setProperty('--text-color', list?.font?.color ?? CourierColors.black[500]);
    this.style.setProperty('--font-family', list?.font?.family ?? null);
    this.style.setProperty('--font-size', list?.font?.size ?? '14px');

    // Set hover and active colors
    this.style.setProperty('--hover-color', list?.hoverColor ?? CourierColors.gray[200]);
    this.style.setProperty('--active-color', list?.activeColor ?? CourierColors.gray[500]);

    // Set selected icon color
    this._checkIcon.updateColor(theme.inbox?.header?.menu?.popup?.list?.selectionIcon?.color ?? CourierColors.black[500]);
    this._checkIcon.updateSVG(theme.inbox?.header?.menu?.popup?.list?.selectionIcon?.svg ?? CourierIconSource.check);

    // Update icon based on feed type
    switch (feedType) {
      case 'inbox':
        this._title.textContent = list?.items?.inbox?.title ?? 'Inbox';
        this._itemIcon.updateSVG(list?.items?.inbox?.icon?.svg ?? CourierIconSource.inbox);
        this._itemIcon.updateColor(list?.items?.inbox?.icon?.color ?? CourierColors.black[500]);
        break;
      case 'archive':
        this._title.textContent = list?.items?.archive?.title ?? 'Archive';
        this._itemIcon.updateSVG(list?.items?.archive?.icon?.svg ?? CourierIconSource.archive);
        this._itemIcon.updateColor(list?.items?.archive?.icon?.color ?? CourierColors.black[500]);
        break;
    }
  }

}

customElements.define('courier-inbox-filter-menu-item', CourierInboxFilterMenuItem);