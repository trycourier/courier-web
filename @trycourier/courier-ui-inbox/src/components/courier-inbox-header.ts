import { CourierInboxFeedType } from "../types/feed-type";
import { CourierIconSource, CourierElement } from "@trycourier/courier-ui-core";
import { CourierInboxFilterMenu, CourierInboxMenuOption } from "./courier-inbox-filter-menu";
import { CourierInboxHeaderTitle } from "./courier-inbox-header-title";
import { CourierInboxHeaderFactoryProps } from "../types/factories";
import { CourierInboxTheme } from "../types/courier-inbox-theme";
import { CourierColors } from "@trycourier/courier-ui-core";

export class CourierInboxHeader extends CourierElement {

  // State
  private _feedType: CourierInboxFeedType = 'inbox';
  private _unreadCount: number = 0;

  // Menu options
  private _menuOptions: CourierInboxMenuOption[] = [
    {
      label: 'Inbox',
      icon: CourierIconSource.inbox,
      onClick: (option: CourierInboxMenuOption) => {
        this.handleOptionMenuClick('inbox', option);
      }
    },
    {
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
  private _onFeedTypeChange: (feedType: CourierInboxFeedType) => void;

  constructor(props: { onFeedTypeChange: (feedType: CourierInboxFeedType) => void }) {
    super();
    this._onFeedTypeChange = props.onFeedTypeChange;
  }

  static get observedAttributes() {
    return ['icon', 'title', 'feed-type'];
  }

  setTheme(theme: CourierInboxTheme) {

    // Update header styles
    const header = this.shadow?.querySelector('.courier-inbox-header') as HTMLElement;
    if (header) {
      header.style.backgroundColor = theme.header?.backgroundColor ?? CourierColors.white[500];
      header.style.borderBottom = `${theme.header?.divider?.width ?? '1px'} solid ${theme.header?.divider?.color ?? CourierColors.gray[200]}`;
    }

    // Update title section theme
    if (this._titleSection) {
      this._titleSection.setTheme(theme);
    }

    // Update menu theme
    if (this._optionMenu) {
      this._optionMenu.setTheme(theme);
    }
  }

  private handleOptionMenuClick(feedType: CourierInboxFeedType, option: CourierInboxMenuOption) {
    this._feedType = feedType;
    if (this._titleSection) {
      this._titleSection.update(option, this._feedType === 'inbox' ? this._unreadCount : 0);
    }
    this._onFeedTypeChange(feedType);
  }

  public refresh(props: CourierInboxHeaderFactoryProps): void {
    // Update state 
    this._feedType = props.feedType;
    this._unreadCount = props.unreadCount;

    // Update archive button
    const isInbox = props.feedType === 'inbox';

    // Update title section
    const option = this._menuOptions.find(opt => opt.label.toLowerCase() === this._feedType);
    if (option) {
      this._titleSection?.update(option, isInbox ? props.unreadCount : 0);
      this._optionMenu?.selectOption(option);
    }
  }

  build(newElement: HTMLElement | undefined | null) {
    super.build(newElement);

    // This will put the header above the rest of the elements
    const style = document.createElement('style');
    style.textContent = `
      :host {
        z-index: 100;
      }
    `;
    this.shadow?.appendChild(style);
  }

  defaultElement(): HTMLElement {
    const style = document.createElement('style');
    style.textContent = `
      .courier-inbox-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background-color: ${CourierColors.white[500]};
        border-bottom: 1px solid ${CourierColors.gray[200]};
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

    this._titleSection = new CourierInboxHeaderTitle({ option: this._menuOptions[0] });
    this._optionMenu = new CourierInboxFilterMenu({ options: this._menuOptions });

    // Create flexible spacer
    const spacer = document.createElement('div');
    spacer.className = 'spacer';

    // Create and setup actions section
    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.appendChild(this._optionMenu);

    const container = document.createElement('div');
    container.className = 'courier-inbox-header';
    container.appendChild(style);
    container.appendChild(this._titleSection);
    container.appendChild(spacer);
    container.appendChild(actions);

    // Initialize title section with first menu option
    this._titleSection.update(this._menuOptions[0], this._unreadCount);

    return container;
  }
}

if (!customElements.get('courier-inbox-header')) {
  customElements.define('courier-inbox-header', CourierInboxHeader);
}
