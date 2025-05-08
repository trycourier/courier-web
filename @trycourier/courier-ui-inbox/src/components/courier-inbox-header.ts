import { CourierInboxFeedType } from "../types/feed-type";
import { CourierIconSource, CourierElement } from "@trycourier/courier-ui-core";
import { CourierInboxFilterMenu, CourierInboxMenuOption } from "./courier-inbox-filter-menu";
import { CourierInboxHeaderTitle } from "./courier-inbox-header-title";
import { CourierInboxHeaderFactoryProps } from "../types/factories";
import { CourierColors } from "@trycourier/courier-ui-core";
import { CourierInboxThemeManager, CourierInboxThemeSubscription } from "../types/courier-inbox-theme-bus";

export class CourierInboxHeader extends CourierElement {

  // Theme
  private _themeSubscription: CourierInboxThemeSubscription;

  // State
  private _feedType: CourierInboxFeedType = 'inbox';
  private _unreadCount: number = 0;

  // Menu options
  private _menuOptions: CourierInboxMenuOption[] = [
    {
      id: 'inbox',
      label: 'Inbox',
      icon: CourierIconSource.inbox,
      onClick: (option: CourierInboxMenuOption) => {
        this.handleOptionMenuClick('inbox', option);
      }
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: CourierIconSource.archive,
      onClick: (option: CourierInboxMenuOption) => {
        this.handleOptionMenuClick('archive', option);
      }
    }
  ];

  // Components
  private _titleSection?: CourierInboxHeaderTitle;
  private _optionMenu?: CourierInboxFilterMenu;
  private _style?: HTMLStyleElement;

  // Callbacks
  private _onFeedTypeChange: (feedType: CourierInboxFeedType) => void;

  constructor(props: { themeManager: CourierInboxThemeManager, onFeedTypeChange: (feedType: CourierInboxFeedType) => void }) {
    super();

    // Subscribe to the theme bus
    this._themeSubscription = props.themeManager.subscribe((_) => {
      this.refreshTheme();
    });

    // Set the on feed type change callback
    this._onFeedTypeChange = props.onFeedTypeChange;

  }

  static get observedAttributes() {
    return ['icon', 'title', 'feed-type'];
  }

  private refreshTheme() {

    const theme = this._themeSubscription.manager.getTheme();

    // Update header styles
    const header = this.shadow?.querySelector('.courier-inbox-header') as HTMLElement;
    if (header) {
      header.style.backgroundColor = theme.inbox?.header?.backgroundColor ?? CourierColors.white[500];
      header.style.boxShadow = theme.inbox?.header?.shadow ?? `0px 1px 0px 0px ${CourierColors.gray[500]}`;
    }

  }

  private handleOptionMenuClick(feedType: CourierInboxFeedType, option: CourierInboxMenuOption) {
    this._feedType = feedType;
    if (this._titleSection) {
      this._titleSection.updateSelectedOption(option, this._feedType, this._feedType === 'inbox' ? this._unreadCount : 0);
    }
    this._onFeedTypeChange(feedType);
  }

  public render(props: CourierInboxHeaderFactoryProps): void {
    // Update state 
    this._feedType = props.feedType;
    this._unreadCount = props.unreadCount;

    // Update archive button
    const isInbox = props.feedType === 'inbox';

    // Update title section
    const option = this._menuOptions.find(opt => opt.label.toLowerCase() === this._feedType);
    if (option) {
      this._titleSection?.updateSelectedOption(option, this._feedType, isInbox ? props.unreadCount : 0);
      this._optionMenu?.selectOption(option);
    }
  }

  build(newElement: HTMLElement | undefined | null) {
    super.build(newElement);

    // This will put the header above the rest of the elements
    // This is needed incase someone wants to set shadow
    this._style = document.createElement('style');
    this._style.textContent = this.getStyles();
    this.shadow?.appendChild(this._style);

    this.refreshTheme();

  }

  defaultElement(): HTMLElement {

    this._titleSection = new CourierInboxHeaderTitle(this._themeSubscription.manager, this._menuOptions[0]);
    this._optionMenu = new CourierInboxFilterMenu(this._themeSubscription.manager, this._menuOptions);

    // Create flexible spacer
    const spacer = document.createElement('div');
    spacer.className = 'spacer';

    // Create and setup actions section
    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.appendChild(this._optionMenu);

    const container = document.createElement('div');
    container.className = 'courier-inbox-header';
    container.appendChild(this._titleSection);
    container.appendChild(spacer);
    container.appendChild(actions);

    return container;
  }

  private getStyles(): string {
    return `
      :host {
        z-index: 100;
      }

      .courier-inbox-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        background-color: ${CourierColors.white[500]};
        box-shadow: 0px 1px 0px 0px ${CourierColors.gray[500]};
      }

      .header-content {
        display: flex;
        align-items: center;
        flex: 1;
      }

      .spacer {
        flex: 1;
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }
    `;
  }

  // Disconnect the theme subscription
  disconnectedCallback() {
    this._themeSubscription.remove();
  }
}

if (!customElements.get('courier-inbox-header')) {
  customElements.define('courier-inbox-header', CourierInboxHeader);
}
