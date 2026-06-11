import { CourierInboxList } from "../courier-inbox-list";
import { CourierInboxHeader } from "../courier-inbox-header";
import { CourierInboxPaginationListItem } from "../courier-inbox-pagination-list-item";

/**
 * Regression tests for https://github.com/trycourier/courier-web/issues/150
 *
 * These components are registered as Custom Elements, so the browser may invoke
 * their constructors with no arguments (for example, during `cloneNode()` from a
 * DOM snapshot library). Previously the constructors destructured `props`
 * unconditionally and threw `TypeError: Cannot read properties of undefined`.
 */
describe("Custom Element parameterless construction (issue #150)", () => {

  // jsdom does not implement matchMedia, which a base-class constructor relies on.
  beforeAll(() => {
    if (!window.matchMedia) {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: (query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          addListener: () => {},
          removeListener: () => {},
          dispatchEvent: () => false,
        }),
      });
    }
  });

  it("CourierInboxList does not throw when constructed without props", () => {
    expect(() => new CourierInboxList()).not.toThrow();
  });

  it("CourierInboxHeader does not throw when constructed without props", () => {
    expect(() => new CourierInboxHeader()).not.toThrow();
  });

  it("CourierInboxPaginationListItem does not throw when constructed without props", () => {
    expect(() => new CourierInboxPaginationListItem()).not.toThrow();
  });

  it("cloneNode on a tree containing these elements does not throw", () => {
    const container = document.createElement("div");
    container.appendChild(document.createElement(CourierInboxList.id));
    container.appendChild(document.createElement(CourierInboxHeader.id));
    container.appendChild(document.createElement(CourierInboxPaginationListItem.id));

    expect(() => container.cloneNode(true)).not.toThrow();
  });

});
