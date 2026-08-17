import { CourierInbox } from "../courier-inbox";
import { InboxMessage } from "@trycourier/courier-js";

/**
 * Preview mode is detached from the datastore, so the header's unread counts
 * have to come from the injected preview data. Custom headers read those counts
 * off the factory props, which previously always reported zero in preview.
 */
describe("Header unread count in preview mode", () => {

  beforeAll(() => {
    // jsdom ships neither of these, and mounting the element relies on both.
    if (!globalThis.crypto?.getRandomValues) {
      Object.defineProperty(globalThis, "crypto", {
        writable: true,
        value: require("node:crypto").webcrypto,
      });
    }

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

  function messages(): InboxMessage[] {
    return [
      { messageId: "unread-1", title: "Unread one" },
      { messageId: "unread-2", title: "Unread two" },
      { messageId: "read-1", title: "Read one", read: new Date().toISOString() },
    ];
  }

  function mountInbox(): CourierInbox {
    const inbox = new CourierInbox();
    document.body.appendChild(inbox);
    return inbox;
  }

  function selectedTabUnreadCount(inbox: CourierInbox): number | undefined {
    const feed = inbox.getHeaderFeeds().find(f => f.isSelected);
    return feed?.tabs.find(tab => tab.isSelected)?.unreadCount;
  }

  it("reports the unread messages in the preview data", () => {
    const inbox = mountInbox();
    inbox.setPreviewData(messages());
    expect(selectedTabUnreadCount(inbox)).toBe(2);
  });

  it("prefers an explicit preview unread count", () => {
    const inbox = mountInbox();
    inbox.setPreviewData(messages(), { unreadCount: 9 });
    expect(selectedTabUnreadCount(inbox)).toBe(9);
  });

  it("returns to datastore counts once preview is cleared", () => {
    const inbox = mountInbox();
    inbox.setPreviewData(messages(), { unreadCount: 9 });
    inbox.setPreviewData(null);
    expect(selectedTabUnreadCount(inbox)).toBe(0);
  });

});
