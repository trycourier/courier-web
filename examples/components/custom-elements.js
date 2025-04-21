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
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
          transition: all 0.2s ease;
          background: white;
          position: relative;
          overflow: hidden;
        }

        .message-item:hover {
          cursor: pointer;
          background: #f8f9fa;
          transform: translateX(4px);
        }

        .message-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background: #521e65;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .message-item:hover::before {
          opacity: 1;
        }

        .message-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }

        .message-title {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .message-id {
          margin-left: 12px;
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 12px;
          color: #666;
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .message-preview {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 24px;
          line-height: 1.4;
          color: #4a4a4a;
          font-weight: 400;
        }
      </style>

      <div class="message-item">
        <div class="message-header">
          <h2 class="message-title">${message.title || 'No Title'}</h2>
          <span class="message-id">${message.messageId}</span>
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
          gap: 12px;
          padding: 16px;
          width: 100%;
          box-sizing: border-box;
          overflow-x: auto;
          border-bottom: 1px solid #e0e0e0;
          background: white;
        }

        .tab {
          flex: 1;
          padding: 12px 24px;
          cursor: pointer;
          border: none;
          font-size: 14px;
          background: transparent;
          font-weight: normal;
          border-radius: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          border: 2px solid #f5f5f5;
          transition: all 0.2s ease;
        }

        .tab:hover {
          background: #f8f9fa;
          border-color: #e0e0e0;
        }

        .tab.selected {
          background: #521e65;
          color: white;
          font-weight: 600;
          border: none;
        }
      </style>

      <div class="header">
        <button class="tab ${props.feedType === 'inbox' ? 'selected' : ''}" data-feed-type="inbox">
          Inbox (${props.unreadCount})
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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.6;
          background: #f8f9fa;
          padding: 16px 24px;
          border-radius: 8px;
          margin: 0;
          color: #521e65;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.6;
          background: #f8f9fa;
          padding: 16px 24px;
          border-radius: 8px;
          margin: 0;
          color: #666;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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
          box-shadow: 0 2px 8px rgba(220, 53, 69, 0.1);
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
          padding: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: white;
        }

        .pagination-content {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          color: #666;
          background: #f8f9fa;
          padding: 12px 20px;
          border-radius: 8px;
          margin: 0;
        }
      </style>

      <div class="pagination-item">
        <p class="pagination-content">Loading more messages from ${props.feedType}...</p>
      </div>
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