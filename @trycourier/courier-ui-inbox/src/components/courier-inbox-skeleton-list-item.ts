import { BaseElement, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";

export class CourierInboxSkeletonListItem extends BaseElement {

  // Shadow root
  private _shadow: ShadowRoot;

  constructor(theme: CourierInboxTheme, opacity: number) {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });

    // Create style element for gap
    const style = document.createElement('style');
    style.textContent = this.getStyles(opacity);
    this._shadow.appendChild(style);

    // Create skeleton items using CourierSkeletonAnimatedRow
    const firstRow = new CourierSkeletonAnimatedRow(theme, 35);
    const secondRow = new CourierSkeletonAnimatedRow(theme, 100);
    const thirdRow = new CourierSkeletonAnimatedRow(theme, 82);

    this._shadow.appendChild(firstRow);
    this._shadow.appendChild(secondRow);
    this._shadow.appendChild(thirdRow);

  }

  private getStyles(opacity: number): string {
    return `
      :host {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px;
        width: 100%;
        box-sizing: border-box;
        opacity: ${opacity};
      }
    `;
  }
}

// Register the custom element
registerElement('courier-inbox-skeleton-list-item', CourierInboxSkeletonListItem);

class CourierSkeletonAnimatedRow extends BaseElement {

  private _shadow: ShadowRoot;

  constructor(theme: CourierInboxTheme, widthPercent: number) {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = this.getStyles(theme, widthPercent);
    this._shadow.appendChild(style);

    const skeletonItem = document.createElement('div');
    skeletonItem.className = 'skeleton-item';
    this._shadow.appendChild(skeletonItem);
  }

  private getStyles(theme: CourierInboxTheme, widthPercent: number): string {
    const color = theme.inbox?.loading?.animation?.barColor ?? '#000';

    // Handle both 3 and 6 character hex colors
    const hexColor = color.length === 4 ?
      `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}` :
      color;

    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    const colorWithAlpha80 = `rgba(${r}, ${g}, ${b}, 0.8)`; // 80% opacity
    const colorWithAlpha40 = `rgba(${r}, ${g}, ${b}, 0.4)`; // 40% opacity

    return `
      :host {
        display: flex;
        height: 100%;
        width: ${widthPercent}%;
        align-items: flex-start;
        justify-content: flex-start;
      }

      .skeleton-item {
        height: ${theme.inbox?.loading?.animation?.barHeight ?? '14px'};
        width: 100%;
        background: linear-gradient(
          90deg,
          ${colorWithAlpha80} 25%,
          ${colorWithAlpha40} 50%,
          ${colorWithAlpha80} 75%
        );
        background-size: 200% 100%;
        animation: shimmer ${theme.inbox?.loading?.animation?.duration ?? '2s'} ease-in-out infinite;
        border-radius: ${theme.inbox?.loading?.animation?.barBorderRadius ?? '14px'};
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

registerElement('courier-skeleton-animated-row', CourierSkeletonAnimatedRow);
