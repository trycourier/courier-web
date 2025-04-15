import { theme } from "../utils/theme";

export enum CourierIconName {
  Bell = 'bell',
  Check = 'check',
  Close = 'close',
  Menu = 'menu',
  Search = 'search',
  Settings = 'settings',
  User = 'user',
  ArrowRight = 'arrow-right',
  Inbox = 'inbox',
  Archive = 'archive',
  Support = 'support'
}

export class CourierIcon extends HTMLElement {
  private svg: SVGElement;
  static observedAttributes = ['name', 'color', 'mode'];

  constructor(name: CourierIconName) {
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
        color: var(--courier-icon-color, ${theme.light.colors.icon});
      }

      svg[data-size="small"] {
        width: 16px;
        height: 16px;
      }

      svg[data-mode="dark"] {
        color: var(--courier-icon-color, ${theme.dark.colors.icon});
      }

    `;

    shadow.appendChild(style);
    shadow.appendChild(this.svg);

    // Set initial attributes
    this.updateIcon(name);
    this.updateColor();
    this.updateMode();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'name':
        this.updateIcon(newValue as CourierIconName);
        break;
      case 'color':
        this.updateColor();
        break;
      case 'mode':
        this.updateMode();
        break;
    }
  }

  private updateColor() {
    const color = this.getAttribute('color');
    if (color) {
      this.svg.style.setProperty('--courier-icon-color', color);
    } else {
      this.svg.style.removeProperty('--courier-icon-color');
    }
  }

  private updateMode() {
    const mode = this.getAttribute('mode') || 'light';
    this.svg.setAttribute('data-mode', mode);
  }

  private updateIcon(name: CourierIconName) {

    // Clear existing paths
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }

    // Add new paths based on icon name
    switch (name) {
      case CourierIconName.Bell:
        this.svg.innerHTML = `
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        `;
        break;
      case CourierIconName.Check:
        this.svg.innerHTML = `<path d="M20 6L9 17l-5-5"></path>`;
        break;
      case CourierIconName.Close:
        this.svg.innerHTML = `<path d="M16.7812 8.28125L13.0312 12.0312L16.75 15.75C17.0625 16.0312 17.0625 16.5 16.75 16.7812C16.4688 17.0938 16 17.0938 15.7188 16.7812L11.9688 13.0625L8.25 16.7812C7.96875 17.0938 7.5 17.0938 7.21875 16.7812C6.90625 16.5 6.90625 16.0312 7.21875 15.7188L10.9375 12L7.21875 8.28125C6.90625 8 6.90625 7.53125 7.21875 7.21875C7.5 6.9375 7.96875 6.9375 8.28125 7.21875L12 10.9688L15.7188 7.25C16 6.9375 16.4688 6.9375 16.7812 7.25C17.0625 7.53125 17.0625 8 16.7812 8.28125Z"/>`;
        break;
      case CourierIconName.Menu:
        this.svg.innerHTML = `<path d="M3 12h18M3 6h18M3 18h18"></path>`;
        break;
      case CourierIconName.Search:
        this.svg.innerHTML = `
          <circle cx="11" cy="11" r="8"></circle>
          <path d="M21 21l-4.35-4.35"></path>
        `;
        break;
      case CourierIconName.Settings:
        this.svg.innerHTML = `
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        `;
        break;
      case CourierIconName.User:
        this.svg.innerHTML = `
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        `;
        break;
      case CourierIconName.ArrowRight:
        this.svg.innerHTML = `<path d="M5 12h14M12 5l7 7-7 7"></path>`;
        break;
      case CourierIconName.Inbox:
        this.svg.innerHTML = `
          <path d="M22 12h-6l-2 3h-4l-2-3H2"></path>
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
        `;
        break;
      case CourierIconName.Archive:
        this.svg.innerHTML = `<path d="M5.5 6.5V8H18.5V6.5H5.5ZM5 5H19C19.5312 5 20 5.46875 20 6V8.5C20 9.0625 19.5312 9.5 19 9.5H5C4.4375 9.5 4 9.0625 4 8.5V6C4 5.46875 4.4375 5 5 5ZM9 11.75C9 11.3438 9.3125 11 9.75 11H14.25C14.6562 11 15 11.3438 15 11.75C15 12.1875 14.6562 12.5 14.25 12.5H9.75C9.3125 12.5 9 12.1875 9 11.75ZM5 17V10.5H6.5V17C6.5 17.2812 6.71875 17.5 7 17.5H17C17.25 17.5 17.5 17.2812 17.5 17V10.5H19V17C19 18.125 18.0938 19 17 19H7C5.875 19 5 18.125 5 17Z"></path>`;
        break;
    }
  }
}

// Register the custom element
if (!customElements.get('courier-icon')) {
  customElements.define('courier-icon', CourierIcon);
}
