import { CourierBaseElement, CourierIconButton, registerElement } from '@trycourier/courier-ui-core';
import { CourierInboxIconTheme, CourierInboxTheme } from '../types/courier-inbox-theme';

export type CourierInboxListItemActionMenuOption = {
  id: string;
  icon: CourierInboxIconTheme;
  onClick: () => void;
};

export class CourierInboxListItemMenu extends CourierBaseElement {

  static get id(): string {
    return 'courier-inbox-list-item-menu';
  }

  // State
  private _theme!: CourierInboxTheme;
  private _isConfigured = false;
  private _options: CourierInboxListItemActionMenuOption[] = [];

  constructor(theme?: CourierInboxTheme) {
    super();
    if (!theme) {
      return;
    }
    this._isConfigured = true;
    this._theme = theme;
  }

  onComponentMounted() {
    if (!this._isConfigured) {
      return;
    }
    const menu = document.createElement('ul');
    menu.className = 'menu';
    this.appendChild(menu);
  }

  static getStyles(theme: CourierInboxTheme): string {

    const menu = theme.inbox?.list?.item?.menu;
    const transition = menu?.animation;
    const initialTransform = transition?.initialTransform ?? 'translate3d(0, 0, 0)';
    const visibleTransform = transition?.visibleTransform ?? 'translate3d(0, 0, 0)';

    return `
      ${CourierInboxListItemMenu.id} {
        display: none;
        position: absolute;
        background: ${menu?.backgroundColor ?? 'red'};
        border: ${menu?.border ?? '1px solid red'};
        border-radius: ${menu?.borderRadius ?? '0px'};
        box-shadow: ${menu?.shadow ?? '0 2px 8px red'};
        user-select: none;
        opacity: 0;
        pointer-events: none;
        transition: ${transition?.transition ?? 'all 0.2s ease'};
        overflow: hidden;
        transform: ${initialTransform};
        will-change: transform, opacity;
      }

      ${CourierInboxListItemMenu.id}.visible {
        opacity: 1;
        pointer-events: auto;
        transform: ${visibleTransform};
      }

      ${CourierInboxListItemMenu.id} ul.menu {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
      }

      ${CourierInboxListItemMenu.id} li.menu-item {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-bottom: none;
        background: transparent;
        touch-action: none;
      }
    `;
  }

  setOptions(options: CourierInboxListItemActionMenuOption[]) {
    if (!this._isConfigured) {
      return;
    }
    this._options = options;
    this.renderMenu();
  }

  private renderMenu() {
    // Clear existing menu items
    const menu = this.querySelector('ul.menu');
    if (!menu) return;
    menu.innerHTML = '';
    const menuTheme = this._theme.inbox?.list?.item?.menu;

    // Prevent click events from propagating outside of this menu
    const cancelEvent = (e: Event) => {
      e.stopPropagation();
      // Only preventDefault on touchstart to prevent context menu and other default behaviors
      // touchmove doesn't need preventDefault since CSS touch-action handles scrolling
      if (e.type === 'touchstart' || e.type === 'mousedown') {
        e.preventDefault();
      }
    };

    // Create new menu items
    this._options.forEach((opt) => {
      const icon = new CourierIconButton(opt.icon.svg, opt.icon.color, menuTheme?.backgroundColor, menuTheme?.item?.hoverBackgroundColor, menuTheme?.item?.activeBackgroundColor, menuTheme?.item?.borderRadius);

      // Handle both click and touch events
      const handleInteraction = (e: Event) => {
        e.stopPropagation();
        opt.onClick();
      };

      // Add click handler for desktop
      icon.addEventListener('click', handleInteraction);

      // Add touch handlers for mobile
      // touchstart needs preventDefault for context menu prevention, so use passive: false
      icon.addEventListener('touchstart', cancelEvent, { passive: false });
      icon.addEventListener('touchend', handleInteraction, { passive: true });

      // touchmove can be passive since CSS touch-action: none prevents scrolling
      icon.addEventListener('touchmove', (e: Event) => {
        e.stopPropagation();
      }, { passive: true });

      // Prevent mouse events from interfering
      icon.addEventListener('mousedown', cancelEvent);
      icon.addEventListener('mouseup', cancelEvent);

      menu.appendChild(icon);
    });
  }

  show() {
    // Set display first
    this.style.display = 'block';
    this.classList.remove('visible');

    // Trigger transition on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.classList.add('visible');
      });
    });
  }

  hide() {
    // Remove visible class to trigger transition
    this.classList.remove('visible');

    // Wait for transition to complete, then set display none
    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.target !== this) return;
      if (!this.classList.contains('visible')) {
        this.style.display = 'none';
        this.removeEventListener('transitionend', handleTransitionEnd);
      }
    };

    this.addEventListener('transitionend', handleTransitionEnd);
  }
}

registerElement(CourierInboxListItemMenu);