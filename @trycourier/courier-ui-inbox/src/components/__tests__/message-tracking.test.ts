import { InboxMessage } from "@trycourier/courier-js";
import { CourierInboxListItem } from "../courier-inbox-list-item";
import { CourierInboxList } from "../courier-inbox-list";
import { CourierInboxThemeManager } from "../../types/courier-inbox-theme-manager";

/**
 * Click and open tracking both run off list item callbacks:
 *  - a click on an item reports the click, which tracks the click and marks the message opened
 *  - an item scrolling into view reports visibility, which marks the message opened
 *
 * Both were silently dropped: clicks only fired when the host app registered its own
 * click handler, and visibility only fired on an exact `intersectionRatio === 1`.
 */

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly callback: IntersectionObserverCallback;
  readonly options?: IntersectionObserverInit;
  readonly observed: Element[] = [];
  disconnected = false;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
    MockIntersectionObserver.instances.push(this);
  }

  observe(element: Element) {
    this.observed.push(element);
  }

  unobserve() { }

  disconnect() {
    this.disconnected = true;
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  /** Report an intersection to the observed element. */
  emit(entry: Partial<IntersectionObserverEntry>) {
    this.callback(
      [{ isIntersecting: true, intersectionRatio: 1, ...entry } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }

  static get latest(): MockIntersectionObserver {
    return MockIntersectionObserver.instances[MockIntersectionObserver.instances.length - 1];
  }
}

/** A root (scroll viewport) 800px tall. */
const rootBounds = { height: 800, width: 400, top: 0, left: 0, right: 400, bottom: 800, x: 0, y: 0 } as DOMRectReadOnly;

const rect = (height: number) => ({ height, width: 400, top: 0, left: 0, right: 400, bottom: height, x: 0, y: 0 }) as DOMRectReadOnly;

const message = (overrides?: Partial<InboxMessage>): InboxMessage => ({
  messageId: crypto.randomUUID(),
  title: "Test Message",
  preview: "Test Preview",
  created: "2021-01-01T00:00:00.000Z",
  ...overrides,
});

const buildItem = (canClick: boolean) => {
  const item = new CourierInboxListItem(new CourierInboxThemeManager({}), canClick, false);
  item.setMessage(message());
  document.body.appendChild(item);
  return item;
};

describe("Inbox list item click and open tracking", () => {

  // jsdom implements neither matchMedia (used by the theme manager) nor IntersectionObserver.
  beforeAll(() => {
    if (!window.matchMedia) {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: (query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: () => { },
          removeEventListener: () => { },
          addListener: () => { },
          removeListener: () => { },
          dispatchEvent: () => false,
        }),
      });
    }
  });

  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      configurable: true,
      value: MockIntersectionObserver,
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("clicks", () => {

    it("reports a click when the host app has no click handler", () => {
      // The hover affordance is off, but the click still has to be tracked.
      const item = buildItem(false);
      const onItemClick = jest.fn();
      item.setOnItemClick(onItemClick);

      item.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      expect(onItemClick).toHaveBeenCalledTimes(1);
    });

    it("reports a click when the item is clickable", () => {
      const item = buildItem(true);
      const onItemClick = jest.fn();
      item.setOnItemClick(onItemClick);

      item.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      expect(onItemClick).toHaveBeenCalledTimes(1);
    });

    it("shows the click affordance only when the item is clickable", () => {
      expect(buildItem(true).classList.contains("clickable")).toBe(true);
      expect(buildItem(false).classList.contains("clickable")).toBe(false);
    });

    it("does not report a click from the item's action menu", () => {
      const item = buildItem(false);
      const onItemClick = jest.fn();
      item.setOnItemClick(onItemClick);

      const menu = item.querySelector("courier-inbox-list-item-menu");
      menu?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      expect(onItemClick).not.toHaveBeenCalled();
    });

    it("does not report a click from a link inside the message body", () => {
      const item = buildItem(false);
      const onItemClick = jest.fn();
      item.setOnItemClick(onItemClick);

      const link = document.createElement("a");
      link.href = "https://www.courier.com";
      item.querySelector(".subtitle")?.appendChild(link);
      link.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      expect(onItemClick).not.toHaveBeenCalled();
    });

  });

  describe("visibility", () => {

    it("reports a fully visible item whose ratio is rounded below 1", () => {
      // Browsers report fractional ratios for a fully visible item because of subpixel layout.
      const item = buildItem(false);
      const onItemVisible = jest.fn();
      item.setOnItemVisible(onItemVisible);

      MockIntersectionObserver.latest.emit({
        intersectionRatio: 0.9999847412109375,
        intersectionRect: rect(120),
        rootBounds,
      });

      expect(onItemVisible).toHaveBeenCalledTimes(1);
    });

    it("reports an item that is half visible", () => {
      const item = buildItem(false);
      const onItemVisible = jest.fn();
      item.setOnItemVisible(onItemVisible);

      MockIntersectionObserver.latest.emit({
        intersectionRatio: 0.5,
        intersectionRect: rect(60),
        rootBounds,
      });

      expect(onItemVisible).toHaveBeenCalledTimes(1);
    });

    it("reports an item taller than the viewport, whose ratio can never reach the threshold", () => {
      const item = buildItem(false);
      const onItemVisible = jest.fn();
      item.setOnItemVisible(onItemVisible);

      // A 3000px message filling the whole 800px viewport: only 27% of it is on screen.
      MockIntersectionObserver.latest.emit({
        intersectionRatio: 0.2666,
        intersectionRect: rect(800),
        rootBounds,
      });

      expect(onItemVisible).toHaveBeenCalledTimes(1);
    });

    it("does not report an item that is barely peeking into view", () => {
      const item = buildItem(false);
      const onItemVisible = jest.fn();
      item.setOnItemVisible(onItemVisible);

      MockIntersectionObserver.latest.emit({
        intersectionRatio: 0.05,
        intersectionRect: rect(6),
        rootBounds,
      });

      expect(onItemVisible).not.toHaveBeenCalled();
    });

    it("does not report an item that is off screen", () => {
      const item = buildItem(false);
      const onItemVisible = jest.fn();
      item.setOnItemVisible(onItemVisible);

      MockIntersectionObserver.latest.emit({
        isIntersecting: false,
        intersectionRatio: 0,
        intersectionRect: rect(0),
        rootBounds,
      });

      expect(onItemVisible).not.toHaveBeenCalled();
    });

    it("observes with a partial threshold so tall items still produce entries", () => {
      buildItem(false);

      const threshold = MockIntersectionObserver.latest.options?.threshold as number[];
      expect(threshold).toContain(0);
      expect(Math.max(...threshold)).toBeLessThan(1);
    });

    it("stops observing when the item leaves the DOM", () => {
      const item = buildItem(false);
      const observer = MockIntersectionObserver.latest;

      item.remove();

      expect(observer.disconnected).toBe(true);
    });

  });

  describe("CourierInboxList affordance updates", () => {

    const buildList = (onMessageClick: (message: InboxMessage, index: number) => void = () => { }) => {
      const list = new CourierInboxList({
        themeManager: new CourierInboxThemeManager({}),
        canClickListItems: false,
        canLongPressListItems: false,
        onRefresh: () => { },
        onPaginationTrigger: () => { },
        onMessageClick,
        onMessageActionClick: () => { },
        onMessageLongPress: () => { },
      });
      document.body.appendChild(list);
      list.setDataSet({
        id: 'inbox',
        messages: [message()],
        unreadCount: 0,
        canPaginate: false,
        paginationCursor: null,
      });
      return list;
    };

    it("re-renders already rendered items when the click handler is registered later", () => {
      const list = buildList();
      expect(list.querySelector(CourierInboxListItem.id)?.classList.contains("clickable")).toBe(false);

      // A host app typically registers its handler after the first render (e.g. a React effect).
      list.setCanClickListItems(true);

      expect(list.querySelector(CourierInboxListItem.id)?.classList.contains("clickable")).toBe(true);
    });

    it("reports clicks on rendered items", () => {
      const onMessageClick = jest.fn();
      const list = buildList(onMessageClick);

      list.querySelector(CourierInboxListItem.id)?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      expect(onMessageClick).toHaveBeenCalledTimes(1);
    });

  });

});
