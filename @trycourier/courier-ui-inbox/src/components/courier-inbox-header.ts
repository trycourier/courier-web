import { FeedType } from "../types/feed-type";
import { CourierButton, CourierIcon, CourierIconName } from "@trycourier/courier-ui-core";

export class CourierInboxHeader extends HTMLElement {
  private titleElement: HTMLHeadingElement;
  private iconElement: HTMLElement;
  private feedTypeSelect: HTMLSelectElement;
  private feedType: FeedType = 'inbox';
  protected _title: string = this.getContentForFeedType(this.feedType).title;
  private icon: string | CourierIconName = this.getContentForFeedType(this.feedType).icon;
  private archiveButton: CourierButton;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    this.iconElement = new CourierIcon(this.icon as CourierIconName);

    this.titleElement = document.createElement('h2');
    this.titleElement.setAttribute('part', 'title');

    this.feedTypeSelect = document.createElement('select');
    this.feedTypeSelect.setAttribute('part', 'feed-type-select');
    this.feedTypeSelect.innerHTML = `
      <option value="inbox">Inbox</option>
      <option value="archive">Archive</option>
    `;
    this.feedTypeSelect.value = this.feedType;
    this.feedTypeSelect.addEventListener('change', this.handleFeedTypeChange.bind(this));

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
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
        gap: 12px;
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

      select[part="feed-type-select"] {
        padding: 4px 8px;
        border: 1px solid var(--courier-border, #e5e7eb);
        border-radius: 4px;
        background-color: var(--courier-bg, #ffffff);
        color: var(--courier-text-primary, #111827);
        font-size: 14px;
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 16px;
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
    actions.appendChild(this.feedTypeSelect);

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

  private handleFeedTypeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newFeedType = select.value as FeedType;
    this.feedType = newFeedType;
    this.updateTitleFromFeedType();

    // Dispatch custom event for feed type change
    const feedTypeChangeEvent = new CustomEvent('feedTypeChange', {
      detail: { feedType: newFeedType },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(feedTypeChangeEvent);
  }

  private handleArchiveClick() {
    alert('We need to implement this');
  }

  private getContentForFeedType(feedType: FeedType) {
    if (feedType === 'inbox') {
      return {
        title: 'Inbox',
        icon: CourierIconName.Inbox
      };
    } else {
      return {
        title: 'Archive',
        icon: CourierIconName.Archive
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
      this.iconElement.setAttribute('name', this.icon);
    } else {
      this.iconElement.removeAttribute('name');
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
    this.feedTypeSelect.value = feedType;
    this.updateTitleFromFeedType();
    this.updateArchiveButton(feedType === 'inbox' && messageCount > 0);
  }

}

if (!customElements.get('courier-inbox-header')) {
  customElements.define('courier-inbox-header', CourierInboxHeader);
}
