class CustomListItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const props = JSON.parse(this.getAttribute('data-props'));
    this.render(props);
    this.addClickHandler(props);
  }

  addClickHandler(props) {
    const messageItem = this.shadowRoot.querySelector('.message-item');
    messageItem.addEventListener('click', () => {
      alert(JSON.stringify(props, null, 2));
    });
  }

  render(props) {
    const { message } = props;
    this.shadowRoot.innerHTML = `
      <style>
        .message-item {
          padding: 16px 32px;
          border-bottom: 1px dashed #e0e0e0;
          background: white;
          position: relative;
          overflow: hidden;
          transition: padding-left 0.2s ease, padding-right 0.2s ease;
        }

        .message-item:hover {
          cursor: pointer;
          background: #f8f9fa;
          padding-left: 24px;
          padding-right: 24px;
        }

        .unread::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 2px;
          background: green;
        }

        .message-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .message-title {
          margin: 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 14px;
        }

        .message-id {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 12px;
          background: gray;
          padding: 4px 8px;
          border-radius: 4px;
          text-align: right;
          color: white;
        }

        .message-preview {
          margin: 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 14px;
          line-height: 1.4;
          color: darkgray;
          font-weight: 400;
        }
      </style>

      <div class="message-item ${!message.read && !message.archived ? 'unread' : ''}">
        <div class="message-header">
          <p class="message-title">${message.title || 'No Title'}</p>
          <span class="message-id">${message.messageId.slice(0, 8)}...${message.messageId.slice(-8)}</span>
        </div>
        <p class="message-preview">${message.preview || 'No Content'}</p>
      </div>
    `;
  }
}

class CustomHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const props = JSON.parse(this.getAttribute('data-props'));
    this.render(props);
    this.addClickHandlers();
  }

  addClickHandlers() {
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const feedType = e.target.dataset.feedType;
        this.dispatchEvent(new CustomEvent('tab-change', {
          detail: feedType,
          bubbles: true,
          composed: true
        }));
      });
    });
  }

  render(props) {
    this.shadowRoot.innerHTML = `
      <style>
        .header {
          display: flex;
          width: 100%;
          box-sizing: border-box;
          padding: 0px 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          background: white;
          align-items: center;
        }

        .tab {
          padding: 16px;
          cursor: pointer;
          border: none;
          font-size: 14px;
          background: transparent;
          font-weight: normal;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          position: relative;
        }

        .tab:hover {
          background: #f8f9fa;
        }

        .tab.selected {
          color: green;
          box-shadow: inset 0 -2px 0 green;
        }

      </style>

      <div class="header">
        <button class="tab ${props.feedType === 'inbox' ? 'selected' : ''}" data-feed-type="inbox">
          Inbox
        </button>
        <button class="tab ${props.feedType === 'archive' ? 'selected' : ''}" data-feed-type="archive">
          Archive
        </button>
      </div>
    `;
  }
}

class CustomLoadingState extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const props = JSON.parse(this.getAttribute('data-props'));
    this.render(props);
  }

  render(props) {
    this.shadowRoot.innerHTML = `
      <style>
        .loading {
          width: 100%;
          height: 100%;
          padding: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
        }

        .loading-content {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.6;
          padding: 16px 24px;
          margin: 0;
          font-size: 14px;
          border: 2px dashed lightgray;
        }
      </style>

      <div class="loading">
        <p class="loading-content">Loading ${props.feedType}...</p>
      </div>
    `;
  }
}

class CustomEmptyState extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const props = JSON.parse(this.getAttribute('data-props'));
    this.render(props);
  }

  render(props) {
    this.shadowRoot.innerHTML = `
      <style>
        .empty {
          width: 100%;
          height: 100%;
          padding: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
        }

        .empty-content {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.6;
          padding: 16px 24px;
          margin: 0;
          font-size: 14px;
          border: 2px dashed lightgray;
        }
      </style>

      <div class="empty">
        <p class="empty-content">No ${props.feedType} messages yet</p>
      </div>
    `;
  }
}

class CustomErrorState extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const props = JSON.parse(this.getAttribute('data-props'));
    this.render(props);
  }

  render(props) {
    this.shadowRoot.innerHTML = `
      <style>
        .error {
          width: 100%;
          height: 100%;
          padding: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
        }

        .error-content {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.6;
          background: #fff2f2;
          padding: 16px 24px;
          border-radius: 8px;
          margin: 0;
          color: #dc3545;
          font-size: 14px;
        }
      </style>

      <div class="error">
        <p class="error-content">Error loading ${props.feedType} messages: ${props.error.message}</p>
      </div>
    `;
  }
}

class CustomPaginationItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const props = JSON.parse(this.getAttribute('data-props'));
    this.render(props);
  }

  render(props) {
    this.shadowRoot.innerHTML = `
      <style>
        .pagination-item {
          width: 100%;
          height: 200%;
          padding: 24px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          box-sizing: border-box;
          padding-top: 48px;
        }

        .pagination-content {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.6;
          padding: 16px 24px;
          margin: 0;
          font-size: 14px;
          border: 2px dashed lightgray;
        }
      </style>

      <div class="pagination-item">
        <p class="pagination-content">Loading more messages from ${props.feedType}...</p>
      </div>
    `;
  }
}

class CustomMenuButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const props = JSON.parse(this.getAttribute('data-props'));
    this.render(props);
  }

  render(props) {
    this.shadowRoot.innerHTML = `
      <style>
        .menu-button {
          width: 160px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 10px 24px;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .menu-button:hover {
          background: #f8f9fa;
          padding-left: 16px;
          padding-right: 16px;
        }

        .notification-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 6px;
          border-radius: 4px;
          font-size: 12px;
          color: white;
        }

        .notification-badge.has-count {
          background: green;
        }

        .notification-badge.no-count {
          background: gray;
        }
          
      </style>

      <button class="menu-button">
        Alerts
        <span class="notification-badge ${props.unreadCount > 0 ? 'has-count' : 'no-count'}">${props.unreadCount}</span>
      </button>
    `;
  }
}

// Register the custom elements
customElements.define('custom-list-item', CustomListItem);
customElements.define('custom-header', CustomHeader);
customElements.define('custom-loading-state', CustomLoadingState);
customElements.define('custom-empty-state', CustomEmptyState);
customElements.define('custom-error-state', CustomErrorState);
customElements.define('custom-pagination-item', CustomPaginationItem);
customElements.define('custom-menu-button', CustomMenuButton);