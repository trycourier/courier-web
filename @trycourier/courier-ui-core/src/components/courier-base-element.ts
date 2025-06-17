export class CourierBaseElement extends HTMLElement {

  static get id(): string {
    return 'courier-base-element';
  }

  private _isInitialized = false;

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

}