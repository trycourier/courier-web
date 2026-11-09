import { Courier, InboxMessage } from "@trycourier/courier-js";
import { CourierInbox } from "../courier-inbox";
import { CourierInboxListItem } from "../courier-inbox-list-item";
import { CourierInboxDatastore } from "../../datastore/inbox-datastore";
import { CourierInboxDataStoreListener } from "../../datastore/datastore-listener";

/**
 * Loading the next page notifies listeners twice: once with the whole dataset
 * (`onDataSetChange`) and once with just the new page (`onPageAdded`). The list
 * already holds the new page after the first, so applying the second as well
 * rendered every message past the first page twice.
 */
describe("Inbox pagination", () => {

  const PAGE_SIZE = 24;
  const TOTAL = 25;

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

    // The list's pagination trigger watches itself with one; jsdom has none.
    if (!window.IntersectionObserver) {
      Object.defineProperty(window, "IntersectionObserver", {
        writable: true,
        value: class {
          observe() {}
          unobserve() {}
          disconnect() {}
        },
      });
    }
  });

  afterEach(() => {
    jest.restoreAllMocks();
    while (document.body.firstChild) {
      document.body.firstChild.remove();
    }
  });

  function allMessages(total = TOTAL): InboxMessage[] {
    return Array.from({ length: total }, (_, i) => ({
      messageId: `message-${i}`,
      title: `Message ${i}`,
      created: new Date(Date.UTC(2026, 0, 1, 0, total - i)).toISOString(),
    }));
  }

  // Serves `allMessages(total)` in pages of PAGE_SIZE, using the offset as the cursor.
  // Next-page requests wait for `nextPageGate` when one is given, so a test can act while they're in flight.
  function signInWithServer(total = TOTAL, nextPageGate?: Promise<void>) {
    const messages = allMessages(total);
    Courier.shared.paginationLimit = PAGE_SIZE;
    const getMessages = jest.fn(async (props: { paginationLimit?: number, startCursor?: string }) => {
      if (props.startCursor && nextPageGate) {
        await nextPageGate;
      }
      const start = props.startCursor ? Number(props.startCursor) : 0;
      const end = start + (props.paginationLimit ?? PAGE_SIZE);
      return {
        data: {
          count: messages.length,
          unreadCount: messages.length,
          messages: {
            nodes: messages.slice(start, end),
            pageInfo: {
              hasNextPage: end < messages.length,
              startCursor: end < messages.length ? String(end) : null,
            },
          },
        },
      };
    });

    jest.spyOn(Courier.shared, "client", "get").mockReturnValue({
      options: { userId: "user", logger: { info: () => {}, warn: () => {}, error: () => {} } },
      inbox: { getMessages, socket: undefined },
    } as any);
    return getMessages;
  }

  function gate(): { opened: Promise<void>, open: () => void } {
    let open = () => {};
    const opened = new Promise<void>(resolve => { open = resolve; });
    return { opened, open };
  }

  function renderedTitles(inbox: CourierInbox): string[] {
    return Array.from(inbox.querySelectorAll(`${CourierInboxListItem.id} .title`))
      .map(title => title.textContent ?? "");
  }

  async function mountLoadedInbox(): Promise<CourierInbox> {
    const inbox = new CourierInbox();
    document.body.appendChild(inbox);
    await CourierInboxDatastore.shared.load({ canUseCache: false });
    return inbox;
  }

  it("renders each message once after loading the next page", async () => {
    signInWithServer();
    const inbox = await mountLoadedInbox();
    expect(renderedTitles(inbox)).toHaveLength(PAGE_SIZE);

    await CourierInboxDatastore.shared.fetchNextPageOfMessages({ datasetId: "all_messages" });

    expect(renderedTitles(inbox)).toEqual(allMessages().map(message => message.title));
  });

  it("renders each message once across several pages", async () => {
    const total = PAGE_SIZE * 2 + 2;
    signInWithServer(total);
    const inbox = await mountLoadedInbox();

    await CourierInboxDatastore.shared.fetchNextPageOfMessages({ datasetId: "all_messages" });
    expect(renderedTitles(inbox)).toEqual(allMessages(total).slice(0, PAGE_SIZE * 2).map(message => message.title));

    await CourierInboxDatastore.shared.fetchNextPageOfMessages({ datasetId: "all_messages" });
    expect(renderedTitles(inbox)).toEqual(allMessages(total).map(message => message.title));
  });

  it("fetches the next page once when it's requested again before the first request returns", async () => {
    const nextPage = gate();
    const getMessages = signInWithServer(TOTAL, nextPage.opened);
    const inbox = await mountLoadedInbox();

    const first = CourierInboxDatastore.shared.fetchNextPageOfMessages({ datasetId: "all_messages" });
    const second = CourierInboxDatastore.shared.fetchNextPageOfMessages({ datasetId: "all_messages" });
    nextPage.open();
    await Promise.all([first, second]);

    expect(getMessages.mock.calls.filter(([props]) => props.startCursor)).toHaveLength(1);
    expect(renderedTitles(inbox)).toEqual(allMessages().map(message => message.title));
  });

  it("drops a next page that was still loading when the inbox reloaded", async () => {
    const nextPage = gate();
    signInWithServer(TOTAL, nextPage.opened);
    const inbox = await mountLoadedInbox();

    const stalePage = CourierInboxDatastore.shared.fetchNextPageOfMessages({ datasetId: "all_messages" });
    await CourierInboxDatastore.shared.load({ canUseCache: false });
    nextPage.open();
    await stalePage;
    expect(renderedTitles(inbox)).toEqual(allMessages().slice(0, PAGE_SIZE).map(message => message.title));

    await CourierInboxDatastore.shared.fetchNextPageOfMessages({ datasetId: "all_messages" });
    expect(renderedTitles(inbox)).toEqual(allMessages().map(message => message.title));
  });

  it("leaves the selected tab's list alone when another tab loads a page", async () => {
    signInWithServer();
    const inbox = await mountLoadedInbox();

    await CourierInboxDatastore.shared.fetchNextPageOfMessages({ datasetId: "archived_messages" });

    expect(renderedTitles(inbox)).toEqual(allMessages().slice(0, PAGE_SIZE).map(message => message.title));
  });

  it("still sends custom listeners the new page through onPageAdded", async () => {
    signInWithServer();
    await mountLoadedInbox();

    const pages: string[][] = [];
    const datasets: string[][] = [];
    const listener = new CourierInboxDataStoreListener({
      onPageAdded: dataset => pages.push(dataset.messages.map(message => message.messageId)),
      onDataSetChange: dataset => datasets.push(dataset.messages.map(message => message.messageId)),
    });
    CourierInboxDatastore.shared.addDataStoreListener(listener);

    await CourierInboxDatastore.shared.fetchNextPageOfMessages({ datasetId: "all_messages" });
    listener.remove();

    expect(pages).toEqual([[`message-${TOTAL - 1}`]]);
    expect(datasets).toEqual([allMessages().map(message => message.messageId)]);
  });

});
