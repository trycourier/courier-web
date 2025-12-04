import { CourierBaseElement, CourierIcon, injectGlobalStyle, registerElement } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-manager";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierInboxFeed } from "../types/inbox-data-set";

export class CourierInboxHeaderTitle extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox-header-title';
  }

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _feed: CourierInboxFeed;

  // Components
  private _style?: HTMLStyleElement;
  private _titleElement?: HTMLHeadingElement;
  private _iconElement?: CourierIcon;

  private get theme(): CourierInboxTheme {
    return this._themeSubscription.manager.getTheme();
  }

  constructor(themeManager: CourierInboxThemeManager, feed: CourierInboxFeed) {
    super();

    this._feed = feed;

    // Subscribe to the theme bus
    this._themeSubscription = themeManager.subscribe((_) => {
      this.refreshTheme(this._feed.id);
    });

  }

  static getStyles(theme: CourierInboxTheme): string {
    return `
      ${CourierInboxHeaderTitle.id} {
        display: flex;
        align-items: center;
        gap: 8px;
        position: relative;
        transition: background 0.2s;
      }

      ${CourierInboxHeaderTitle.id}:hover {
        background: red;
      }

      ${CourierInboxHeaderTitle.id} courier-icon {
        display: flex;
        align-items: center;
      }

      ${CourierInboxHeaderTitle.id} h2 {
        margin: 0;
        font-family: ${theme.inbox?.header?.filters?.font?.family ?? 'inherit'};
        font-size: ${theme.inbox?.header?.filters?.font?.size ?? '18px'};
        font-weight: ${theme.inbox?.header?.filters?.font?.weight ?? '500'};
        color: ${theme.inbox?.header?.filters?.font?.color ?? 'red'};
      }
    `;
  }

  onComponentMounted() {

    this._style = injectGlobalStyle(CourierInboxHeaderTitle.id, CourierInboxHeaderTitle.getStyles(this.theme));

    this._iconElement = new CourierIcon(undefined, this._feed.label);
    this._titleElement = document.createElement('h2');

    this.appendChild(this._iconElement);
    this.appendChild(this._titleElement);

    this.refreshTheme(this._feed.id);

  }

  onComponentUnmounted() {
    this._themeSubscription.unsubscribe();
    this._style?.remove();
  }

  private refreshTheme(feedId: string) {
    console.log('refreshTheme', feedId);
    if (this._style) {
      this._style.textContent = CourierInboxHeaderTitle.getStyles(this.theme);
    }
    this.updateFeedTitle();
  }

  private updateFeedTitle() {
    if (this._titleElement) {
      this._titleElement.textContent = this._feed.label;
    }

    // if (this._iconElement) {
    //   this._iconElement.updateSVG(this._option?.icon.svg ?? CourierIconSVGs.inbox);
    //   this._iconElement.updateColor(this._option?.icon.color ?? 'red');
    // }
  }
}

registerElement(CourierInboxHeaderTitle);
