import { CourierFactoryElement, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxSkeletonListItem } from "./courier-inbox-skeleton-list-item";
import { CourierInboxTheme } from "../types/courier-inbox-theme";

export class CourierInboxSkeletonList extends CourierFactoryElement {

  static get id(): string {
    return 'courier-inbox-skeleton-list';
  }

  private _theme: CourierInboxTheme;
  private _style?: HTMLStyleElement;

  constructor(theme: CourierInboxTheme) {
    super();
    this._theme = theme;
  }

  onComponentMounted() {
    this._style = injectGlobalStyle(CourierInboxSkeletonList.id, CourierInboxSkeletonList.getStyles(this._theme));
  }

  onComponentUnmounted() {
    this._style?.remove();
  }

  defaultElement(): HTMLElement {
    const list = document.createElement('div');
    list.className = 'list';

    // Create skeleton items
    for (let i = 0; i < 3; i++) {
      const skeletonItem = new CourierInboxSkeletonListItem(this._theme); // TODO: Make this a prop
      list.appendChild(skeletonItem);
    }

    this.appendChild(list);
    return list;

  }

  static getStyles(theme: CourierInboxTheme): string {

    return `
      ${CourierInboxSkeletonList.id} {
        display: flex;
        height: 100%;
        width: 100%;
        align-items: flex-start;
        justify-content: flex-start;
        overflow: hidden;
      }

      ${CourierInboxSkeletonList.id} .list {
        display: flex;
        flex-direction: column;
        width: 100%;
        overflow: hidden;
      }

      ${CourierInboxSkeletonList.id} .list > * {
        border-bottom: ${theme.inbox?.loading?.divider ?? '1px solid red'};
        opacity: 100%;
      }

      ${CourierInboxSkeletonList.id} .list > *:nth-child(2) {
        border-bottom: ${theme.inbox?.loading?.divider ?? '1px solid red'};
        opacity: 88%;
      }

      ${CourierInboxSkeletonList.id} .list > *:nth-child(3) {
        border-bottom: none;
        opacity: 50%;
      }
    `;

  }
}

registerElement(CourierInboxSkeletonList);
