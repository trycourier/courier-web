import { CourierInfoState } from "@trycourier/courier-ui-core";

/**
 * Regression test for C-18926.
 *
 * The inbox empty / error state is rendered by `CourierInfoState`, which mounts
 * into the light DOM (no Shadow DOM). It previously injected a `<style>` with a
 * bare, global `.container { ... }` rule. That rule leaked out of the component
 * and clobbered any `.container` class in the host app, breaking page layouts.
 *
 * All selectors must be scoped to the `courier-info-state` tag so the styles
 * cannot match elements outside the component.
 */
describe("CourierInfoState style scoping (C-18926)", () => {

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

  function getInjectedCss(): string {
    const state = new CourierInfoState({
      title: { text: "No messages" },
      button: { mode: "light", text: "Retry" },
    });
    const element = state.defaultElement();
    const style = element.querySelector("style");
    expect(style).not.toBeNull();
    return style!.textContent ?? "";
  }

  it("scopes every rule to the courier-info-state tag", () => {
    const css = getInjectedCss();

    expect(css).toContain(`${CourierInfoState.id} .container`);
    expect(css).toContain(`${CourierInfoState.id} .container h2`);
  });

  it("does not emit a global (unscoped) .container rule", () => {
    const css = getInjectedCss();

    // Sanity check: the rules genuinely reference `.container`.
    expect(css).toContain(".container");

    // Remove every properly-scoped occurrence; if a bare `.container` (the
    // leaking selector) remains, the styles can still escape the component.
    const stripped = css.split(`${CourierInfoState.id} .container`).join("");
    expect(stripped).not.toContain(".container");
  });

  it("does not rely on :host, which never matches in the light DOM", () => {
    const css = getInjectedCss();
    expect(css).not.toContain(":host");
  });

});
