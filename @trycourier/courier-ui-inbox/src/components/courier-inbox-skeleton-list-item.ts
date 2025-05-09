export type CourierInboxSkeletonListItemProps = {
  divider: string;
  opacity: number;
}

export class CourierInboxSkeletonListItem extends HTMLElement {

  // Shadow root
  private _shadow: ShadowRoot;

  constructor(props: CourierInboxSkeletonListItemProps) {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });

    // Create style element for gap
    const style = document.createElement('style');
    style.textContent = this.getStyles(props);
    this._shadow.appendChild(style);

    // Create skeleton items using CourierSkeletonAnimatedRow
    const firstRow = new CourierSkeletonAnimatedRow({ widthPercent: 35, borderRadius: 14, duration: 2 });
    const secondRow = new CourierSkeletonAnimatedRow({ widthPercent: 100, borderRadius: 14, duration: 2 });
    const thirdRow = new CourierSkeletonAnimatedRow({ widthPercent: 82, borderRadius: 14, duration: 2 });

    this._shadow.appendChild(firstRow);
    this._shadow.appendChild(secondRow);
    this._shadow.appendChild(thirdRow);

  }

  private getStyles(props: CourierInboxSkeletonListItemProps): string {
    return `
      :host {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px;
        width: 100%;
        box-sizing: border-box;
        opacity: ${props.opacity};
      }
    `;
  }
}

// Register the custom element
if (!customElements.get('courier-inbox-skeleton-list-item')) {
  customElements.define('courier-inbox-skeleton-list-item', CourierInboxSkeletonListItem);
}

export type CourierSkeletonAnimatedRowProps = {
  widthPercent: number;
  borderRadius: number;
  duration: number;
}

class CourierSkeletonAnimatedRow extends HTMLElement {

  private _shadow: ShadowRoot;

  constructor(props: CourierSkeletonAnimatedRowProps) {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = this.getStyles(props);
    this._shadow.appendChild(style);

    const skeletonItem = document.createElement('div');
    skeletonItem.className = 'skeleton-item';
    this._shadow.appendChild(skeletonItem);
  }

  private getStyles(props: CourierSkeletonAnimatedRowProps): string {
    return `
      :host {
        display: flex;
        height: 100%;
        width: ${props.widthPercent}%;
        align-items: flex-start;
        justify-content: flex-start;
      }

      .skeleton-item {
        height: 14px;
        width: 100%;
        background: linear-gradient(
          90deg,
          rgba(240, 240, 240, 0.8) 25%,
          rgba(224, 224, 224, 0.9) 50%,
          rgba(240, 240, 240, 0.8) 75%
        );
        background-size: 200% 100%;
        animation: shimmer ${props.duration}s ease-in-out infinite;
        border-radius: ${props.borderRadius}px;
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    `;
  }
}

if (!customElements.get('courier-skeleton-animated-row')) {
  customElements.define('courier-skeleton-animated-row', CourierSkeletonAnimatedRow);
}
