import { BaseElement, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxSkeletonList } from "./courier-inbox-skeleton-list";

export class CourierInboxPaginationListItem extends BaseElement {

  // Components
  private skeletonLoadingList?: CourierInboxSkeletonList;
  private observer: IntersectionObserver;
  private customItem?: HTMLElement;

  // Handlers
  private onPaginationTrigger: () => void;

  constructor(props: { theme: CourierInboxTheme, customItem?: HTMLElement, onPaginationTrigger: () => void }) {
    super();
    this.onPaginationTrigger = props.onPaginationTrigger;
    this.customItem = props.customItem;

    const shadow = this.attachShadow({ mode: 'open' });

    // Add styles to remove padding/margin and set box-sizing
    const style = document.createElement('style');
    style.textContent = this.getStyles();
    shadow.appendChild(style);

    if (this.customItem) {
      shadow.appendChild(this.customItem);
    } else {
      const container = document.createElement('div');
      container.className = 'skeleton-container';

      this.skeletonLoadingList = new CourierInboxSkeletonList(props.theme);
      this.skeletonLoadingList.build(undefined);
      container.appendChild(this.skeletonLoadingList);

      shadow.appendChild(container);
    }

    // Initialize intersection observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.onPaginationTrigger();
        }
      });
    });

    // Start observing the element
    this.observer.observe(this);
  }

  private getStyles(): string {
    return `
      :host {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }

      .skeleton-container {
        height: 150%;
      }
    `;
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

}

registerElement('courier-inbox-pagination-list-item', CourierInboxPaginationListItem);
