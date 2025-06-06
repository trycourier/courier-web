import { CourierElement, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxSkeletonListItem } from "./courier-inbox-skeleton-list-item";
import { CourierInboxTheme } from "../types/courier-inbox-theme";

export class CourierInboxSkeletonList extends CourierElement {

  private _theme: CourierInboxTheme;

  constructor(theme: CourierInboxTheme) {
    super();
    this._theme = theme;
  }

  defaultElement(): HTMLElement {
    const list = document.createElement('div');
    list.className = 'list';

    // Create style element
    const style = document.createElement('style');
    style.textContent = this.getStyles();
    list.appendChild(style);

    // Create skeleton items
    for (let i = 0; i < 3; i++) {
      const skeletonItem = new CourierInboxSkeletonListItem(this._theme, 1 / (i + 1)); // TODO: Make this a prop
      list.appendChild(skeletonItem);
    }

    this.shadow.appendChild(list);
    return list;
  }

  private getStyles(): string {
    return `
      :host {
        display: flex;
        height: 100%;
        width: 100%;
        align-items: flex-start;
        justify-content: flex-start;
        overflow: hidden;
      }

      .list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        overflow: hidden;
      }

      .list > * {
        border-bottom: ${this._theme.inbox?.loading?.divider ?? '1px solid red'};
      }

      .list > *:last-child {
        border-bottom: none;
      }
    `;
  }
}

registerElement('courier-inbox-skeleton-list', CourierInboxSkeletonList);
