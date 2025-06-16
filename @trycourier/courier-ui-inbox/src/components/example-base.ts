import { CourierBaseElement, registerElement } from "@trycourier/courier-ui-core";

export type ExampleBaseListItem = { index: number };

export class ExampleBase extends CourierBaseElement {

  static get id(): string {
    return 'example-base';
  }

  /** User-supplied factory for a single list item */
  private _renderListItem?: (index: number) => HTMLElement;
  private _initialized = false;

  constructor() {
    super();

    // Inject component-scoped styles just once per document
    if (!document.querySelector("style[data-example-base]")) {
      const style = document.createElement("style");
      style.setAttribute("data-example-base", "");
      style.textContent = `
        example-base ul {
          padding: 16px;
          margin: 0;
          list-style: none;
          border: 1px solid blue;
        }

        example-base .list-item {
          padding: 8px;
          margin: 4px 0;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `;
      document.head.appendChild(style);
    }

  }

  connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;
    this.renderList();
  }

  /* ---------- public API ---------- */

  /** Provide a custom list-item renderer */
  public setListItem(factory: (index: number) => HTMLElement) {
    this._renderListItem = factory;
    this.renderList();
  }

  public getDefaultItem(index: number): HTMLElement {
    const li = document.createElement("li");
    li.className = "list-item";
    li.textContent = `Item ${index}`;
    return li;
  }

  /* ---------- rendering ---------- */

  private renderList(): void {
    // Clear previous children
    while (this.firstChild) this.removeChild(this.firstChild);

    const ul = document.createElement("ul");

    // Always create five items
    for (let i = 1; i <= 5; i++) {
      ul.appendChild(this.renderListItem(i));
    }

    this.appendChild(ul);
  }

  private renderListItem(index: number): HTMLElement {
    return this._renderListItem
      ? this._renderListItem(index)
      : this.getDefaultItem(index);
  }

}

registerElement(ExampleBase);