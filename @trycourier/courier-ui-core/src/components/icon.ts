import { theme } from "../utils/theme";

export const CourierIconSource = {
  inbox: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.5 14.5V17C5.5 17.2812 5.71875 17.5 6 17.5H18C18.25 17.5 18.5 17.2812 18.5 17V14.5H15.9375L15.2812 15.8125C15.0938 16.25 14.6562 16.5 14.1875 16.5H9.78125C9.3125 16.5 8.875 16.25 8.6875 15.8125L8.03125 14.5H5.5ZM18.1875 13L16.6562 6.90625C16.5938 6.65625 16.4062 6.5 16.1875 6.5H7.8125C7.5625 6.5 7.375 6.65625 7.3125 6.90625L5.78125 13H8.1875C8.65625 13 9.09375 13.2812 9.3125 13.7188L9.9375 15H14.0312L14.6875 13.7188C14.875 13.2812 15.3125 13 15.7812 13H18.1875ZM4 14.25C4 14.0938 4 13.9375 4.03125 13.7812L5.84375 6.53125C6.09375 5.625 6.875 5 7.8125 5H16.1875C17.0938 5 17.9062 5.625 18.125 6.53125L19.9375 13.7812C19.9688 13.9375 20 14.0938 20 14.25V17C20 18.125 19.0938 19 18 19H6C4.875 19 4 18.125 4 17V14.25Z" fill="currentColor"/>
</svg>`,
  archive: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.5 6.5V8H18.5V6.5H5.5ZM5 5H19C19.5312 5 20 5.46875 20 6V8.5C20 9.0625 19.5312 9.5 19 9.5H5C4.4375 9.5 4 9.0625 4 8.5V6C4 5.46875 4.4375 5 5 5ZM9 11.75C9 11.3438 9.3125 11 9.75 11H14.25C14.6562 11 15 11.3438 15 11.75C15 12.1875 14.6562 12.5 14.25 12.5H9.75C9.3125 12.5 9 12.1875 9 11.75ZM5 17V10.5H6.5V17C6.5 17.2812 6.71875 17.5 7 17.5H17C17.25 17.5 17.5 17.2812 17.5 17V10.5H19V17C19 18.125 18.0938 19 17 19H7C5.875 19 5 18.125 5 17Z" fill="currentColor"/>
</svg>`,
  check: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.793 7.33203C19.0742 7.64453 19.0742 8.11328 18.793 8.39453L10.543 16.6445C10.2305 16.957 9.76172 16.957 9.48047 16.6445L5.23047 12.3945C4.91797 12.1133 4.91797 11.6445 5.23047 11.3633C5.51172 11.0508 5.98047 11.0508 6.26172 11.3633L9.98047 15.082L17.7305 7.33203C18.0117 7.05078 18.4805 7.05078 18.7617 7.33203H18.793Z" fill="currentColor"/>
</svg>`,
  filter: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 7C5 6.59375 5.3125 6.25 5.75 6.25H18.25C18.6562 6.25 19 6.59375 19 7C19 7.4375 18.6562 7.75 18.25 7.75H5.75C5.3125 7.75 5 7.4375 5 7ZM7 12C7 11.5938 7.3125 11.25 7.75 11.25H16.25C16.6562 11.25 17 11.5938 17 12C17 12.4375 16.6562 12.75 16.25 12.75H7.75C7.3125 12.75 7 12.4375 7 12ZM14 17C14 17.4375 13.6562 17.75 13.25 17.75H10.75C10.3125 17.75 10 17.4375 10 17C10 16.5938 10.3125 16.25 10.75 16.25H13.25C13.6562 16.25 14 16.5938 14 17Z" fill="currentColor"/>
</svg>`,
  right: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.75 12.547L13.25 17.797C12.9375 18.0783 12.4688 18.0783 12.1875 17.7658C11.9062 17.4533 11.9062 16.9845 12.2188 16.7033L16.375 12.7345H5.75C5.3125 12.7345 5 12.422 5 11.9845C5 11.5783 5.3125 11.2345 5.75 11.2345H16.375L12.2188 7.29703C11.9062 7.01578 11.9062 6.51578 12.1875 6.23453C12.4688 5.92203 12.9688 5.92203 13.25 6.20328L18.75 11.4533C18.9062 11.6095 19 11.797 19 11.9845C19 12.2033 18.9062 12.3908 18.75 12.547Z" fill="currentColor"/>
</svg>`,
  remove: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.7969 8.27344L13.0469 12.0234L16.7656 15.7422C17.0781 16.0234 17.0781 16.4922 16.7656 16.7734C16.4844 17.0859 16.0156 17.0859 15.7344 16.7734L11.9844 13.0547L8.26562 16.7734C7.98438 17.0859 7.51562 17.0859 7.23438 16.7734C6.92188 16.4922 6.92188 16.0234 7.23438 15.7109L10.9531 11.9922L7.23438 8.27344C6.92188 7.99219 6.92188 7.52344 7.23438 7.21094C7.51562 6.92969 7.98438 6.92969 8.29688 7.21094L12.0156 10.9609L15.7344 7.24219C16.0156 6.92969 16.4844 6.92969 16.7969 7.24219C17.0781 7.52344 17.0781 7.99219 16.7969 8.27344Z" fill="currentColor"/>
</svg>`
};

export class CourierIcon extends HTMLElement {
  private iconContainer: HTMLElement;
  static observedAttributes = ['color', 'svg'];

  constructor(color?: string, svg?: string) {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    this.iconContainer = document.createElement('div');
    shadow.appendChild(this.iconContainer);

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
    `;

    shadow.appendChild(style);

    // Set initial values from constructor
    if (color) {
      this.updateColor(color);
    }
    if (svg) {
      this.updateSVG(svg);
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'color':
        this.updateColor(newValue);
        break;
      case 'svg':
        this.updateSVG(newValue);
        break;
    }
  }

  private updateColor(color: string) {
    this.style.setProperty('--courier-icon-color', color);
  }

  private updateSVG(iconElement: string) {
    this.iconContainer.innerHTML = iconElement;
  }
}

// Register the custom element
if (!customElements.get('courier-icon')) {
  customElements.define('courier-icon', CourierIcon);
}
