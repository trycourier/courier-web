// During SSR there is no HTMLElement, so fall back to a no-op class
type HTMLElementCtor = {
  new(): HTMLElement;
  prototype: HTMLElement;
};

/**
 * During SSR we fall back to a zero-cost dummy constructor, **but**
 * we still cast it to `HTMLElementCtor` so the *type* remains correct.
 */
export const CourierBaseElement: HTMLElementCtor = (typeof window === 'undefined'
  ? class {
    constructor() {
      // No-op constructor for SSR
    }
  }
  : class extends HTMLElement {

    static get id(): string {
      return 'courier-base-element';
    }

    private _isInitialized = false;

    constructor() {
      super();
    }

    connectedCallback() {
      if (this._isInitialized) return;
      this._isInitialized = true;
      this.onComponentMounted();
    }

    disconnectedCallback() {
      this._isInitialized = false;
      this.onComponentUnmounted();
    }

    protected onComponentMounted() {
      // Empty. Meant to be overridden.
    }

    protected onComponentUnmounted() {
      // Empty. Meant to be overridden.
    }

    protected getStyles(): string {
      return `
        :host {
          background-color: red;
        }
      `;
    }

  }) as unknown as HTMLElementCtor;