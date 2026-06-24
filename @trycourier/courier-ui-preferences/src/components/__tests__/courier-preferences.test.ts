// The root only references the child elements via `as` casts, so TS elides
// those imports and their `registerElement` side-effects never run on their own.
// Import them explicitly so the custom elements upgrade (and render) under jsdom.
import "../courier-preferences-section";
import "../courier-preferences-topic";
import "../courier-channel-routing";
import "../courier-digest-schedule";
import "../courier-preference-toggle";

import { CourierPreferencePage } from "@trycourier/courier-js";
import { CourierPreferences } from "../courier-preferences";

/**
 * A preview page with one custom-routing, opted-in topic — enough for the
 * channel-routing chips to render so we can assert their labels.
 */
function previewPage(
  channelLabels?: { channel: string; name: string }[]
): CourierPreferencePage {
  return {
    showCourierFooter: false,
    heading: "",
    description: "",
    channelConfigs: channelLabels ? { channelLabels } : undefined,
    sections: [
      {
        sectionId: "s1",
        name: "Marketing",
        hasCustomRouting: true,
        routingOptions: ["email", "push"],
        topics: [
          {
            templateId: "t1",
            templateName: "Promotions",
            defaultStatus: "OPTED_IN",
          },
        ],
      },
    ],
    recipientPreferences: [],
  } as CourierPreferencePage;
}

describe("courier-preferences channel labels", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.firstChild.remove();
    }
  });

  function mount(): CourierPreferences {
    const el = new CourierPreferences();
    document.body.appendChild(el);
    return el;
  }

  function chipLabels(): (string | null | undefined)[] {
    return Array.from(
      document.querySelectorAll<HTMLElement>(".courier-channel-chip-label")
    ).map((c) => c.textContent);
  }

  it("renders custom channel names from the page's channelConfigs", () => {
    const el = mount();
    el.setPreviewData(previewPage([{ channel: "email", name: "Work email" }]));

    expect(chipLabels()).toEqual(["Work email", "Push"]);
  });

  it("falls back to default labels when no channelConfigs are provided", () => {
    const el = mount();
    el.setPreviewData(previewPage());

    expect(chipLabels()).toEqual(["Email", "Push"]);
  });

  it("drops an empty custom name, falling back to the default label", () => {
    const el = mount();
    el.setPreviewData(
      previewPage([
        { channel: "email", name: "" },
        { channel: "push", name: "Mobile" },
      ])
    );

    expect(chipLabels()).toEqual(["Email", "Mobile"]);
  });
});

describe("courier-preferences preview state preservation", () => {
  // jsdom doesn't implement CSS.escape, which the in-place topic update uses to
  // build a selector. A minimal pass-through keeps the topic ids in this suite
  // (no special characters) valid.
  beforeAll(() => {
    const g = globalThis as unknown as { CSS?: { escape(value: string): string } };
    if (typeof g.CSS === "undefined") {
      g.CSS = { escape: (value: string) => value };
    }
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.firstChild.remove();
    }
  });

  function mount(): CourierPreferences {
    const el = new CourierPreferences();
    document.body.appendChild(el);
    return el;
  }

  /** Same single-topic preview page, but with caller-controlled routing channels. */
  function pageWithChannels(routingOptions: string[]): CourierPreferencePage {
    const page = previewPage();
    page.sections[0].routingOptions =
      routingOptions as CourierPreferencePage["sections"][number]["routingOptions"];
    return page;
  }

  function customizeButton(): HTMLButtonElement | null {
    return document.querySelector<HTMLButtonElement>(
      ".courier-channel-customize-button"
    );
  }

  function routingContainer(): HTMLElement | null {
    return document.querySelector<HTMLElement>(".courier-channel-routing");
  }

  it("keeps the recipient's expanded 'Customize channels' section across a re-render", () => {
    const el = mount();
    el.setPreviewData(pageWithChannels(["email", "push"]));

    // Starts collapsed.
    expect(customizeButton()?.getAttribute("aria-expanded")).toBe("false");
    expect(routingContainer()?.style.display).toBe("none");

    // Recipient expands the section in the live preview.
    customizeButton()?.click();
    expect(customizeButton()?.getAttribute("aria-expanded")).toBe("true");
    expect(routingContainer()?.style.display).toBe("flex");

    // Editor ADDS a channel -> host recreates the injected page and calls
    // setPreviewData again. The expanded state must survive the re-render.
    el.setPreviewData(pageWithChannels(["email", "push", "sms"]));

    expect(customizeButton()?.getAttribute("aria-expanded")).toBe("true");
    expect(routingContainer()?.style.display).toBe("flex");

    // Editor REMOVES a channel -> same path; must still stay expanded.
    el.setPreviewData(pageWithChannels(["email"]));

    expect(customizeButton()?.getAttribute("aria-expanded")).toBe("true");
    expect(routingContainer()?.style.display).toBe("flex");
  });
});
