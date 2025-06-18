import { CourierBaseElement, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxTheme } from "../types/courier-inbox-theme";

export class CourierInboxSkeletonListItem extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox-skeleton-list-item';
  }

  private _theme: CourierInboxTheme;
  private _style?: HTMLStyleElement;

  constructor(theme: CourierInboxTheme) {
    super();
    this._theme = theme;
  }

  onComponentMounted() {
    this._style = injectGlobalStyle(CourierInboxSkeletonListItem.id, CourierInboxSkeletonListItem.getStyles(this._theme));
    this.render();
  }

  onComponentUnmounted() {
    this._style?.remove();
  }

  private render() {
    // Create skeleton items using CourierSkeletonAnimatedRow
    const firstRow = new CourierSkeletonAnimatedRow(this._theme);
    const secondRow = new CourierSkeletonAnimatedRow(this._theme);
    const thirdRow = new CourierSkeletonAnimatedRow(this._theme);

    this.appendChild(firstRow);
    this.appendChild(secondRow);
    this.appendChild(thirdRow);
  }

  static getStyles(_theme: CourierInboxTheme): string {
    return `
      ${CourierInboxSkeletonListItem.id} {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px;
        width: 100%;
        box-sizing: border-box;
      }

      ${CourierInboxSkeletonListItem.id} > *:first-child {
        width: 35%;
      }

      ${CourierInboxSkeletonListItem.id} > *:nth-child(2) {
        width: 100%;
      }

      ${CourierInboxSkeletonListItem.id} > *:nth-child(3) {
        width: 82%;
      }
    `;
  }
}

// Register the custom element
registerElement(CourierInboxSkeletonListItem);

class CourierSkeletonAnimatedRow extends CourierBaseElement {

  static get id(): string {
    return 'courier-skeleton-animated-row';
  }

  private _theme: CourierInboxTheme;
  private _style?: HTMLStyleElement;

  constructor(theme: CourierInboxTheme) {
    super();
    this._theme = theme;
  }

  onComponentMounted() {
    this._style = injectGlobalStyle(CourierSkeletonAnimatedRow.id, CourierSkeletonAnimatedRow.getStyles(this._theme));
    this.render();
  }

  onComponentUnmounted() {
    this._style?.remove();
  }

  private render() {
    const skeletonItem = document.createElement('div');
    skeletonItem.className = 'skeleton-item';
    this.appendChild(skeletonItem);
  }

  static getStyles(theme: CourierInboxTheme): string {
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
      ${CourierSkeletonAnimatedRow.id} {
        display: flex;
        height: 100%;
        width: 100%;
        align-items: flex-start;
        justify-content: flex-start;
      }

      ${CourierSkeletonAnimatedRow.id} .skeleton-item {
        height: ${theme.inbox?.loading?.animation?.barHeight ?? '14px'};
        width: 100%;
        background: linear-gradient(
          90deg,
          ${colorWithAlpha80} 25%,
          ${colorWithAlpha40} 50%,
          ${colorWithAlpha80} 75%
        );
        background-size: 200% 100%;
        animation: ${CourierSkeletonAnimatedRow.id}-shimmer ${theme.inbox?.loading?.animation?.duration ?? '2s'} ease-in-out infinite;
        border-radius: ${theme.inbox?.loading?.animation?.barBorderRadius ?? '14px'};
      }

      @keyframes ${CourierSkeletonAnimatedRow.id}-shimmer {
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

registerElement(CourierSkeletonAnimatedRow);
