import { CourierElement } from "@trycourier/courier-ui-core";
import { CourierInboxSkeletonListItem } from "./courier-inbox-skeleton-list-item";

export class CourierInboxSkeletonList extends CourierElement {

  constructor() {
    super();
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
      const skeletonItem = new CourierInboxSkeletonListItem({ divider: '1px solid #e0e0e0', opacity: 1 / (i + 1) }); // TODO: Make this a prop
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
        border-bottom: 1px solid #e0e0e0;
      }

      .list > *:last-child {
        border-bottom: none;
      }
    `;
  }
}

// Register the custom element
if (!customElements.get('courier-inbox-skeleton-list')) {
  customElements.define('courier-inbox-skeleton-list', CourierInboxSkeletonList);
}