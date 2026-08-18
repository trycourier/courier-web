import { CourierUnreadCountBadge } from "../courier-unread-count-badge";
import { CourierInboxOptionMenu } from "../courier-inbox-option-menu";
import { CourierInboxThemeManager } from "../../types/courier-inbox-theme-manager";
import { defaultLightTheme } from "../../types/courier-inbox-theme";

/**
 * Every component's shadow root is open. A closed root cannot be read back from
 * the DOM, so screenshot and snapshot tooling drops whatever it contains — which
 * silently lost the unread badge from captured images.
 */
describe("Shadow root mode", () => {

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

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.firstChild.remove();
    }
  });

  function themeManager(): CourierInboxThemeManager {
    return new CourierInboxThemeManager(defaultLightTheme);
  }

  it("exposes the unread count badge's shadow root", () => {
    const badge = new CourierUnreadCountBadge({
      themeBus: themeManager(),
      location: 'inbox',
    });

    document.body.appendChild(badge);

    expect(badge.shadowRoot).not.toBeNull();
  });

  it("exposes the option menu's shadow root", () => {
    const menu = new CourierInboxOptionMenu(themeManager(), false, [], 'inbox');

    document.body.appendChild(menu);

    expect(menu.shadowRoot).not.toBeNull();
  });

});
