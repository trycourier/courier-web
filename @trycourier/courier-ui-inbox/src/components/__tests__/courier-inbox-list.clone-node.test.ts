import { InboxMessage } from "@trycourier/courier-js";
import { CourierInboxList } from "../courier-inbox-list";
import { defaultLightTheme } from "../../types/courier-inbox-theme";
import { CourierInboxThemeManager } from "../../types/courier-inbox-theme-manager";

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = "0px";
  readonly thresholds: ReadonlyArray<number> = [];

  disconnect(): void { }
  observe(_target: Element): void { }
  takeRecords(): IntersectionObserverEntry[] { return []; }
  unobserve(_target: Element): void { }
}

describe("CourierInboxList cloneNode safety", () => {
  beforeAll(() => {
    (globalThis as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver = MockIntersectionObserver;

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => false,
      })),
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("does not throw when constructed without props", () => {
    expect(() => {
      Reflect.construct(CourierInboxList, []);
    }).not.toThrow();
  });

  it("does not throw when deep-cloning a rendered list", () => {
    const themeManager = new CourierInboxThemeManager(defaultLightTheme);
    const list = new CourierInboxList({
      themeManager,
      canClickListItems: true,
      canLongPressListItems: true,
      onRefresh: () => { },
      onPaginationTrigger: () => { },
      onMessageClick: () => { },
      onMessageActionClick: () => { },
      onMessageLongPress: () => { },
    });

    const message: InboxMessage = {
      messageId: crypto.randomUUID(),
      title: "Hello",
      body: "World",
      preview: "World",
      actions: [],
      data: {},
      created: "2026-01-01T00:00:00.000Z",
    };

    document.body.appendChild(list);
    list.setDataSet({
      id: "all_messages",
      messages: [message],
      unreadCount: 1,
      canPaginate: true,
      paginationCursor: "cursor-1",
    });

    expect(() => list.cloneNode(true)).not.toThrow();
    themeManager.cleanup();
  });
});
