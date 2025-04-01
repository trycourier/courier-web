export class CourierInbox extends HTMLElement {
  private list: HTMLUListElement;
  static observedAttributes = ['items'];

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    this.list = document.createElement('ul');
    this.list.setAttribute('part', 'list');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      li {
        padding: 8px 16px;
        border-bottom: 1px solid var(--courier-list-border-color, #e5e7eb);
        font-family: inherit;
        font-size: 16px;
      }

      li:last-child {
        border-bottom: none;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.list);
  }

  connectedCallback() {
    this.updateItems();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'items' && oldValue !== newValue) {
      this.updateItems();
    }
  }

  private updateItems() {
    this.list.innerHTML = '';
    const items = JSON.parse(this.getAttribute('items') || '[]');

    // Generate 50 items if no items provided
    const listItems = items.length ? items : Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

    listItems.forEach((item: string) => {
      const li = document.createElement('li');
      li.textContent = item;
      this.list.appendChild(li);
    });
  }
}

// Register the custom element
if (!customElements.get('courier-inbox')) {
  customElements.define('courier-inbox', CourierInbox);
}