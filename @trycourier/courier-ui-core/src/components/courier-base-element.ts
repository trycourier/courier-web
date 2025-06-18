/**
 * Resolve the class we can safely `extends`.
 * • In the browser → the real `HTMLElement`.
 * • During SSR / Node → a no-op stub so `class … extends …` is still valid.
 */
const HTMLElementBase: typeof HTMLElement = ((): any => {
  // `typeof HTMLElement` throws in some bundlers, so wrap in try/catch.
  try {
    // Will be `undefined` under Node.
    return typeof HTMLElement === 'undefined' ? class { } : HTMLElement;
  } catch {
    return class { };
  }
})();

/**
 * Universal base class for Courier web-components.
 *
 * ⚠️  IMPORTANT:  When you create a concrete element, extend **this**
 *     (or `HTMLElementBase`) instead of `HTMLElement` directly.
 */
export class CourierBaseElement extends HTMLElementBase {
  /** Tag-name you’ll use in `customElements.define()` */
  static get id(): string {
    return 'courier-base-element';
  }

  /** Prevents double-initialisation when the node is re-inserted. */
  #isInitialised = false;

  /* ------------------------------------------------------------------ */
  /*  Custom-elements lifecycle hooks                                   */
  /* ------------------------------------------------------------------ */

  connectedCallback() {
    if (this.#isInitialised) return;
    this.#isInitialised = true;
    this.onComponentMounted?.();
  }

  disconnectedCallback() {
    this.#isInitialised = false;
    this.onComponentUnmounted?.();
  }

  /* ------------------------------------------------------------------ */
  /*  Overridable hooks                                                 */
  /* ------------------------------------------------------------------ */

  /** Called **once** when the element first becomes part of the DOM. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onComponentMounted(): void { }

  /** Called when the element is removed from the DOM. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onComponentUnmounted(): void { }
}