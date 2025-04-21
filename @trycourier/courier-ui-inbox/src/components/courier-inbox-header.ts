import { CourierInboxFeedType } from "../types/feed-type";
import { CourierButton, CourierIconSource, CourierElement } from "@trycourier/courier-ui-core";
import { CourierInboxFilterMenu, CourierInboxMenuOption } from "./courier-inbox-filter-menu";
import { CourierInboxHeaderTitle } from "./courier-inbox-header-title";
import { CourierInboxHeaderFactoryProps } from "../types/factories";

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
  private _archiveButton?: CourierButton;
  private _onFeedTypeChange: (feedType: CourierInboxFeedType) => void;

  constructor(props: { onFeedTypeChange: (feedType: CourierInboxFeedType) => void }) {
    super();
    this._onFeedTypeChange = props.onFeedTypeChange;
  }

  static get observedAttributes() {
    return ['icon', 'title', 'feed-type'];
  }

  private handleArchiveClick() {
    alert('We need to implement this');
  }

  private handleOptionMenuClick(feedType: CourierInboxFeedType, option: CourierInboxMenuOption) {
    this._feedType = feedType;
    if (this._titleSection) {
      this._titleSection.update(option, this._feedType === 'inbox' ? this._unreadCount : 0);
    }
    this._onFeedTypeChange(feedType);
  }

  private showArchiveButton(show: boolean) {
    if (this._archiveButton) {
      this._archiveButton.style.display = show ? 'block' : 'none';
    }
  }

  public refresh(props: CourierInboxHeaderFactoryProps): void {

    // Update state 
    this._feedType = props.feedType;
    this._unreadCount = props.unreadCount;

    // Update archive button
    const isInbox = props.feedType === 'inbox';
    const hasMessages = props.messageCount > 0;
    this.showArchiveButton(isInbox && hasMessages);

    // Update title section
    const option = this._menuOptions.find(opt => opt.label.toLowerCase() === this._feedType);
    if (option) {
      this._titleSection?.update(option, isInbox ? props.unreadCount : 0);
      this._optionMenu?.selectOption(option);
    }

  }

  defaultElement(): HTMLElement {
    const style = document.createElement('style');
    style.textContent = `
      .courier-inbox-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background-color: var(--courier-header-bg, #ffffff);
        border-bottom: 1px solid var(--courier-header-border, #e5e7eb);
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

    // Create and setup archive button
    this._archiveButton = new CourierButton();
    this._archiveButton.setAttributes({
      variant: 'tertiary',
    });
    this._archiveButton.textContent = 'Archive All';
    this._archiveButton.addEventListener('click', this.handleArchiveClick.bind(this));
    actions.appendChild(this._archiveButton);
    actions.appendChild(this._optionMenu);

    const container = document.createElement('div');
    container.className = 'courier-inbox-header';
    container.appendChild(style);
    container.appendChild(this._titleSection);
    container.appendChild(spacer);
    container.appendChild(actions);

    // Hide archive button by default
    this.showArchiveButton(false);

    // Initialize title section with first menu option
    this._titleSection.update(this._menuOptions[0], this._unreadCount);

    return container;
  }
}

if (!customElements.get('courier-inbox-header')) {
  customElements.define('courier-inbox-header', CourierInboxHeader);
}
