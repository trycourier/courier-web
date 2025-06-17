import { CourierBaseElement, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxSkeletonList } from "./courier-inbox-skeleton-list";

export class CourierInboxPaginationListItem extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox-pagination-list-item';
  }

  // State
  private _theme: CourierInboxTheme;

  // Components
  private _style?: HTMLStyleElement;
  private _skeletonLoadingList?: CourierInboxSkeletonList;
  private _observer?: IntersectionObserver;
  private _customItem?: HTMLElement;

  // Handlers
  private _onPaginationTrigger: () => void;

  constructor(props: { theme: CourierInboxTheme, customItem?: HTMLElement, onPaginationTrigger: () => void }) {
    super();
    this._theme = props.theme;
    this._customItem = props.customItem;
    this._onPaginationTrigger = props.onPaginationTrigger;
  }

  onComponentMounted() {

    this._style = injectGlobalStyle(CourierInboxPaginationListItem.id, CourierInboxPaginationListItem.getStyles(this._theme));

    if (this._customItem) {
      this.appendChild(this._customItem);
    } else {
      const container = document.createElement('div');
      container.className = 'skeleton-container';

      this._skeletonLoadingList = new CourierInboxSkeletonList(this._theme);
      this._skeletonLoadingList.build(undefined);
      container.appendChild(this._skeletonLoadingList);

      this.appendChild(container);
    }

    // Initialize intersection observer
    this._observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this._onPaginationTrigger();
        }
      });
    });

    // Start observing the element
    this._observer.observe(this);

  }

  onComponentUnmounted() {
    this._observer?.disconnect();
    this._style?.remove();
  }

  static getStyles(_theme: CourierInboxTheme): string {
    return `
      ${CourierInboxPaginationListItem.id} {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }

      ${CourierInboxPaginationListItem.id} .skeleton-container {
        height: 150%;
      }
    `;
  }

}

registerElement(CourierInboxPaginationListItem);
