// During SSR there is no HTMLElement, so fall back to a no-op class
type HTMLElementCtor = {
  new(): HTMLElement;
  prototype: HTMLElement;
};

/**
 * During SSR we fall back to a zero-cost dummy constructor, **but**
 * we still cast it to `HTMLElementCtor` so the *type* remains correct.
 */
export const BaseElement: HTMLElementCtor = (typeof window === 'undefined'
  ? class {
    constructor() {
      // No-op constructor for SSR
    }
  }
  : class extends HTMLElement {
    constructor() {
      super();
    }
  }) as HTMLElementCtor;