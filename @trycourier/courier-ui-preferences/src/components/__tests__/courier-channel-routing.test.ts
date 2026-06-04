import { CourierUserPreferencesChannel } from "@trycourier/courier-js";
import { defaultLightTheme } from "../../types/courier-preferences-theme";
import { CourierPreferencesThemeManager } from "../../types/courier-preferences-theme-manager";
import { CourierChannelRouting } from "../courier-channel-routing";

const THEME_MANAGER = new CourierPreferencesThemeManager(defaultLightTheme);

describe("courier-channel-routing", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.firstChild.remove();
    }
  });

  function mountRouting(configure?: (routing: CourierChannelRouting) => void): CourierChannelRouting {
    const routing = new CourierChannelRouting();
    routing.themeManager = THEME_MANAGER;
    configure?.(routing);
    document.body.appendChild(routing);
    return routing;
  }

  function chips(): HTMLButtonElement[] {
    return Array.from(document.querySelectorAll<HTMLButtonElement>(".courier-channel-chip"));
  }

  it("renders a chip per routing option with default labels", () => {
    mountRouting((r) => { r.routingOptions = ["email", "push"]; });

    const labels = chips().map((c) => c.querySelector(".courier-channel-chip-label")?.textContent);
    expect(labels).toEqual(["Email", "Push"]);
  });

  it("renders nothing when there are no routing options", () => {
    mountRouting((r) => { r.routingOptions = []; });
    expect(chips()).toHaveLength(0);
  });

  it("reflects the selected channels via aria-pressed", () => {
    mountRouting((r) => {
      r.routingOptions = ["email", "push"];
      r.selectedChannels = ["email"];
    });

    const [email, push] = chips();
    expect(email.getAttribute("aria-pressed")).toBe("true");
    expect(push.getAttribute("aria-pressed")).toBe("false");
  });

  it("adds a channel on click and fires onRoutingChange", () => {
    const handler = jest.fn();
    mountRouting((r) => {
      r.routingOptions = ["email", "push"];
      r.selectedChannels = ["email"];
      r.onRoutingChange = handler;
    });

    const [, push] = chips();
    push.click();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(["email", "push"]);
    expect(push.getAttribute("aria-pressed")).toBe("true");
  });

  it("removes a selected channel on click", () => {
    const handler = jest.fn();
    mountRouting((r) => {
      r.routingOptions = ["email", "push"];
      r.selectedChannels = ["email", "push"];
      r.onRoutingChange = handler;
    });

    const [email] = chips();
    email.click();

    expect(handler).toHaveBeenCalledWith(["push"]);
    expect(email.getAttribute("aria-pressed")).toBe("false");
  });

  it("does not deselect the last channel when routing is required", () => {
    const handler = jest.fn();
    mountRouting((r) => {
      r.routingOptions = ["email", "push"];
      r.selectedChannels = ["email"];
      r.isRequired = true;
      r.onRoutingChange = handler;
    });

    const [email] = chips();
    email.click();

    expect(handler).not.toHaveBeenCalled();
    expect(email.getAttribute("aria-pressed")).toBe("true");
  });

  it("uses custom channel labels when provided", () => {
    mountRouting((r) => {
      r.channelLabels = { email: "E-mail" } as Record<CourierUserPreferencesChannel, string>;
      r.routingOptions = ["email", "push"];
    });

    const labels = chips().map((c) => c.querySelector(".courier-channel-chip-label")?.textContent);
    expect(labels).toEqual(["E-mail", "Push"]);
  });
});
