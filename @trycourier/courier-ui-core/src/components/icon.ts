export enum IconName {
  Bell = 'bell',
  Check = 'check',
  Close = 'close',
  Menu = 'menu',
  Search = 'search',
  Settings = 'settings',
  User = 'user',
  ArrowRight = 'arrow-right'
}

export class CourierIcon extends HTMLElement {
  private svg: SVGElement;
  static observedAttributes = ['name', 'color'];

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    // Create SVG element
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('part', 'icon');
    this.svg.setAttribute('viewBox', '0 0 24 24');
    this.svg.setAttribute('fill', 'none');
    this.svg.setAttribute('stroke', 'currentColor');
    this.svg.setAttribute('stroke-width', '2');
    this.svg.setAttribute('stroke-linecap', 'round');
    this.svg.setAttribute('stroke-linejoin', 'round');

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
        line-height: 0;
      }

      svg {
        width: 24px;
        height: 24px;
      }

      svg[data-size="small"] {
        width: 16px;
        height: 16px;
      }
      
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.svg);

    // Set initial attributes
    this.updateIcon();
    this.updateColor();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'name':
        this.updateIcon();
        break;
      case 'color':
        this.updateColor();
        break;
    }
  }

  private updateColor() {
    const color = this.getAttribute('color');
    if (color) {
      this.svg.style.color = color;
    } else {
      this.svg.style.color = 'currentColor';
    }
  }

  private updateIcon() {
    const name = this.getAttribute('name') as IconName;
    if (!name) return;

    // Clear existing paths
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }

    // Add new paths based on icon name
    switch (name) {
      case IconName.Bell:
        this.svg.innerHTML = `
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        `;
        break;
      case IconName.Check:
        this.svg.innerHTML = `<path d="M20 6L9 17l-5-5"></path>`;
        break;
      case IconName.Close:
        this.svg.innerHTML = `<path d="M18 6L6 18M6 6l12 12"></path>`;
        break;
      case IconName.Menu:
        this.svg.innerHTML = `<path d="M3 12h18M3 6h18M3 18h18"></path>`;
        break;
      case IconName.Search:
        this.svg.innerHTML = `
          <circle cx="11" cy="11" r="8"></circle>
          <path d="M21 21l-4.35-4.35"></path>
        `;
        break;
      case IconName.Settings:
        this.svg.innerHTML = `
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        `;
        break;
      case IconName.User:
        this.svg.innerHTML = `
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        `;
        break;
      case IconName.ArrowRight:
        this.svg.innerHTML = `<path d="M5 12h14M12 5l7 7-7 7"></path>`;
        break;
    }
  }
}

// Register the custom element
if (!customElements.get('courier-icon')) {
  customElements.define('courier-icon', CourierIcon);
}
