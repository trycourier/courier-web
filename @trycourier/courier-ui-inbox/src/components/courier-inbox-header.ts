import { FeedType } from "../types/feed-type";
import { CourierIconName } from "@trycourier/courier-ui-core";

export class CourierInboxHeader extends HTMLElement {
  private titleElement: HTMLHeadingElement;
  private iconElement: HTMLElement;
  private feedTypeSelect: HTMLSelectElement;
  private feedType: FeedType = 'inbox';
  protected _title: string = 'Inbox';
  private icon: string = CourierIconName.Bell;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    this.iconElement = document.createElement('courier-icon');
    this.iconElement.setAttribute('part', 'icon');
    this.iconElement.setAttribute('name', this.icon);

    this.titleElement = document.createElement('h2');
    this.titleElement.setAttribute('part', 'title');

    this.feedTypeSelect = document.createElement('select');
    this.feedTypeSelect.setAttribute('part', 'feed-type-select');
    this.feedTypeSelect.innerHTML = `
      <option value="inbox">Inbox</option>
      <option value="archived">Archive</option>
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
        margin-right: 8px;
        display: flex;
        align-items: center;
      }

      .header-content {
        display: flex;
        align-items: center;
        flex: 1;
      }

      h2[part="title"] {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: var(--courier-text-primary, #111827);
      }

      select[part="feed-type-select"] {
        margin-left: 16px;
        padding: 4px 8px;
        border: 1px solid var(--courier-border, #e5e7eb);
        border-radius: 4px;
        background-color: var(--courier-bg, #ffffff);
        color: var(--courier-text-primary, #111827);
        font-size: 14px;
      }
    `;

    const headerContent = document.createElement('div');
    headerContent.className = 'header-content';
    headerContent.appendChild(this.iconElement);
    headerContent.appendChild(this.titleElement);
    headerContent.appendChild(this.feedTypeSelect);

    shadow.appendChild(style);
    shadow.appendChild(headerContent);
  }

  static get observedAttributes() {
    return ['icon', 'title', 'feed-type'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'icon':
        this.icon = newValue;
        this.updateIcon();
        break;
      case 'title':
        this._title = newValue;
        this.updateTitle();
        break;
      case 'feed-type':
        this.feedType = newValue as FeedType;
        this.feedTypeSelect.value = this.feedType;
        this.updateTitleFromFeedType();
        break;
    }
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

  private updateTitleFromFeedType() {
    this._title = this.feedType === 'inbox' ? 'Inbox' : 'Archive';
    this.updateTitle();
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

  connectedCallback() {
    this.updateIcon();
    this.updateTitle();
  }
}

if (!customElements.get('courier-inbox-header')) {
  customElements.define('courier-inbox-header', CourierInboxHeader);
}
