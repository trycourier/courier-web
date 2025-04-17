import { FeedType } from "../types/feed-type";
import { CourierButton, CourierIcon, CourierIconSource } from "@trycourier/courier-ui-core";
import { CourierInboxFilterMenu } from "./courier-inbox-filter-menu";
import { CourierUnreadCountBadge } from "./courier-unread-count-badge";

export class CourierInboxHeader extends HTMLElement {
  private titleElement: HTMLHeadingElement;
  private iconElement: HTMLElement;
  private optionMenu: CourierInboxFilterMenu;
  private feedType: FeedType = 'inbox';
  private _title: string = this.getContentForFeedType(this.feedType).title;
  private icon: string = this.getContentForFeedType(this.feedType).icon;
  private archiveButton: CourierButton;
  private unreadCount: number = 0;
  private unreadBadge: CourierUnreadCountBadge;
  private onFeedTypeChange: (feedType: FeedType) => void;

  constructor(props: { onFeedTypeChange: (feedType: FeedType) => void }) {
    super();
    this.onFeedTypeChange = props.onFeedTypeChange;

    const shadow = this.attachShadow({ mode: 'open' });

    this.iconElement = new CourierIcon();
    this.iconElement.setAttribute('part', 'icon');

    this.titleElement = document.createElement('h2');
    this.titleElement.setAttribute('part', 'title');

    this.unreadBadge = new CourierUnreadCountBadge();

    this.optionMenu = new CourierInboxFilterMenu([
      {
        label: 'Inbox',
        icon: CourierIconSource.inbox,
        onClick: () => {
          this.handleOptionMenuClick('inbox');
        }
      },
      {
        label: 'Archive',
        icon: CourierIconSource.archive,
        onClick: () => {
          this.handleOptionMenuClick('archive');
        }
      }
    ]);

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background-color: var(--courier-header-bg, #ffffff);
        border-bottom: 1px solid var(--courier-header-border, #e5e7eb);
      }

      courier-icon[part="icon"] {
        display: flex;
        align-items: center;
      }

      .header-content {
        display: flex;
        align-items: center;
        flex: 1;
      }

      .title-section {
        display: flex;
        align-items: center;
        gap: 8px;
        position: relative;
      }

      .spacer {
        flex: 1;
      }

      h2[part="title"] {
        margin: 0;
        font-size: 18px;
        font-weight: 50;
        color: var(--courier-text-primary, #111827);
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }
    `;

    // Create main header container
    const headerContent = document.createElement('div');
    headerContent.className = 'header-content';

    // Create and setup title section with icon and title
    const titleSection = document.createElement('div');
    titleSection.className = 'title-section';
    titleSection.appendChild(this.iconElement);
    titleSection.appendChild(this.titleElement);
    titleSection.appendChild(this.unreadBadge);

    // Create flexible spacer
    const spacer = document.createElement('div');
    spacer.className = 'spacer';

    // Create and setup actions section
    const actions = document.createElement('div');
    actions.className = 'actions';

    // Create and setup archive button
    this.archiveButton = new CourierButton();
    this.archiveButton.setAttributes({
      variant: 'tertiary',
    });
    this.archiveButton.textContent = 'Archive All';
    this.archiveButton.addEventListener('click', this.handleArchiveClick.bind(this));
    actions.appendChild(this.archiveButton);
    actions.appendChild(this.optionMenu);

    // Assemble header content
    headerContent.appendChild(titleSection);
    headerContent.appendChild(spacer);
    headerContent.appendChild(actions);

    // Add elements to shadow DOM
    shadow.appendChild(style);
    shadow.appendChild(headerContent);
  }

  static get observedAttributes() {
    return ['icon', 'title', 'feed-type'];
  }

  private handleArchiveClick() {
    alert('We need to implement this');
  }

  public setUnreadCount(unreadCount: number) {
    this.unreadCount = unreadCount;
    switch (this.feedType) {
      case 'inbox':
        this.unreadBadge.setCount(this.unreadCount);
        break;
      case 'archive':
        this.unreadBadge.setCount(0);
        break;
    }
  }

  private handleOptionMenuClick(feedType: FeedType) {
    this.feedType = feedType;
    this.updateTitleFromFeedType();
    this.onFeedTypeChange(feedType);
  }

  private getContentForFeedType(feedType: FeedType) {
    if (feedType === 'inbox') {
      return {
        title: 'Inbox',
        icon: 'inbox'
      };
    } else {
      return {
        title: 'Archive',
        icon: 'archive'
      };
    }
  }

  private updateTitleFromFeedType() {
    const content = this.getContentForFeedType(this.feedType);
    this._title = content.title;
    this.icon = content.icon;
    this.updateTitle();
    this.updateIcon();
  }

  private updateIcon() {
    if (this.icon) {
      this.iconElement.setAttribute('icon', this.icon);
    } else {
      this.iconElement.removeAttribute('icon');
    }
  }

  private updateTitle() {
    this.titleElement.textContent = this._title;
  }

  private updateArchiveButton(show: boolean) {
    this.archiveButton.style.display = show ? 'block' : 'none';
  }

  connectedCallback() {
    this.updateIcon();
    this.updateTitle();
  }

  public setIcon(icon: string): void {
    this.icon = icon;
    this.updateIcon();
  }

  public setTitle(title: string): void {
    this._title = title;
    this.updateTitle();
  }

  public setFeedType(feedType: FeedType, messageCount: number): void {
    this.feedType = feedType;
    this.updateTitleFromFeedType();
    this.updateArchiveButton(feedType === 'inbox' && messageCount > 0);
  }
}

if (!customElements.get('courier-inbox-header')) {
  customElements.define('courier-inbox-header', CourierInboxHeader);
}
