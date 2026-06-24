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
