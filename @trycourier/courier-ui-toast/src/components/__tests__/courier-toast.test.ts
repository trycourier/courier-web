import { InboxAction, InboxMessage } from "@trycourier/courier-js";
import { CourierToast } from "../courier-toast";
import { CourierToastItem } from "../courier-toast-item";
import { CourierToastTheme } from "../../types/courier-toast-theme";
import { CourierToastDatastore } from "../../datastore/toast-datastore";
import { TOAST_DISMISS_ANIMATION_MS } from "../../utils/animation";

let toast: CourierToast;

const INBOX_MESSAGE: InboxMessage = {
  messageId: "1",
  title: "I'm a test message",
  preview: "I'm a test message preview",
};

describe("courier-toast", () => {
  beforeEach(() => {
    toast = new CourierToast(/* props= */ {});
    document.body.appendChild(toast);
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.firstChild.remove();
    }
  });

  describe("addInboxMessage", () => {
    it("should add a <courier-toast-item> to the DOM", () => {
      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);

      const toastItem = document.querySelector("courier-toast-item");

      expect(toastItem).not.toBeNull();
      expect(toastItem?.textContent).toContain(INBOX_MESSAGE.title);
    });

    it("should add multiple <courier-toast-item>s but only have the last three added visible", () => {
      const message1 = { ...INBOX_MESSAGE, messageId: "1", title: "Message 1" };
      const message2 = { ...INBOX_MESSAGE, messageId: "2", title: "Message 2" };
      const message3 = { ...INBOX_MESSAGE, messageId: "3", title: "Message 3" };
      const message4 = { ...INBOX_MESSAGE, messageId: "4", title: "Message 4" };

      CourierToastDatastore.shared.addMessage(message1);
      CourierToastDatastore.shared.addMessage(message2);
      CourierToastDatastore.shared.addMessage(message3);
      CourierToastDatastore.shared.addMessage(message4);

      const toastItems = document.querySelectorAll("courier-toast-item");

      expect(toastItems.length).toBe(4);

      const visibleItems: CourierToastItem[] = [];
      toastItems.forEach(element => {
        const styles = window.getComputedStyle(element);
        if (styles.visibility !== "hidden") {
          visibleItems.push(element as CourierToastItem);
        }
      });

      expect(visibleItems.length).toBe(3);

      // Assert that exactly the last 3 messages added are visible
      expect(visibleItems[0]?.textContent).toContain(message2.title);
      expect(visibleItems[1]?.textContent).toContain(message3.title);
      expect(visibleItems[2]?.textContent).toContain(message4.title);
    });
  });

  describe("onToastItemClick", () => {
    it("should call the handler with the added message and element", () => {
      const clickCallback = jest.fn();

      toast.onToastItemClick(clickCallback);

      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);
      const item = document.querySelector("courier-toast-item") as CourierToastItem;
      item.click();

      expect(clickCallback).toHaveBeenCalledWith({
        message: INBOX_MESSAGE,
      });
    });
  });

  describe("onToastItemActionClick", () => {
    it("should call the handler with the added message and action", () => {
      const clickCallback = jest.fn();

      toast.onToastItemActionClick(clickCallback);

      const action: InboxAction = { content: "Click me!" };
      const messageWithAction: InboxMessage = {
        ...INBOX_MESSAGE,
        actions: [ action ],
      };
      CourierToastDatastore.shared.addMessage(messageWithAction);
      const buttonShadowRoot = document.querySelector("courier-toast-item courier-button")?.shadowRoot;
      buttonShadowRoot?.querySelector('button')?.click();

      expect(clickCallback).toHaveBeenCalledWith({
        message: messageWithAction,
        action,
      });
    });
  });

  describe("enableAutoDismiss", () => {
    it("should automatically dismiss the toast", () => {
      jest.useFakeTimers();

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);
      const item = document.querySelector("courier-toast-item") as CourierToastItem;

      // Verify the item is initially in the DOM
      expect(document.body.contains(item)).toBe(true);

      // Fast-forward time past auto-dismiss timeout
      jest.advanceTimersByTime(6000);

      // Verify the item is no longer in the DOM
      expect(document.body.contains(item)).toBe(false);

      jest.useRealTimers();
    });

    it("should automatically dismiss a custom toast item", () => {
      jest.useFakeTimers();

      const customItemFactory = () => {
        const el = document.createElement("div");
        el.id = "test-content";
        return el;
      };

      toast.setToastItemContent(customItemFactory);

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);
      const item = document.querySelector("courier-toast-item") as HTMLElement;

      // Verify the item is initially in the DOM
      expect(document.body.contains(item)).toBe(true);

      // Fast-forward time past auto-dismiss timeout
      jest.advanceTimersByTime(6000);

      // Verify the item is no longer in the DOM
      expect(document.body.contains(item)).toBe(false);

      jest.useRealTimers();
    });
  });

  describe("disableAutoDismiss", () => {
    it("should revert auto-dismiss if it were previously enabled", () => {
      jest.useFakeTimers();

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      toast.disableAutoDismiss();
      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);
      const item = document.querySelector("courier-toast-item") as CourierToastItem;

      // Verify the item is initially in the DOM
      expect(document.body.contains(item)).toBe(true);

      // Fast-forward time past auto-dismiss timeout
      jest.advanceTimersByTime(6000);

      // Verify the item is still in the DOM
      expect(document.body.contains(item)).toBe(true);

      jest.useRealTimers();
    });
  });

  describe("setAutoDismissTimeoutMs", () => {
    it("should set the auto-dismiss timeout used if auto-dismiss is enabled", () => {
      jest.useFakeTimers();

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(10_000);
      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);
      const item = document.querySelector("courier-toast-item") as CourierToastItem;

      // Verify the item is initially in the DOM
      expect(document.body.contains(item)).toBe(true);

      // Fast-forward time (still before auto-dismiss timeout)
      jest.advanceTimersByTime(5000);

      // Verify the item still in DOM
      expect(document.body.contains(item)).toBe(true);

      // Fast-forward time past auto-dismiss timeout
      jest.advanceTimersByTime(6000);

      // Verify the item is no longer in the DOM
      expect(document.body.contains(item)).toBe(false);

      jest.useRealTimers();
    });
  });

  describe("auto-dismiss hover pause", () => {
    const hover = () => toast.dispatchEvent(new MouseEvent("mouseenter"));
    const unhover = () => toast.dispatchEvent(new MouseEvent("mouseleave"));

    it("should pause the countdown while the cursor is over the toast", () => {
      jest.useFakeTimers();

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);
      const item = document.querySelector("courier-toast-item") as CourierToastItem;

      // Hover the toast, then fast-forward well past the auto-dismiss timeout.
      hover();
      jest.advanceTimersByTime(10_000);

      // Still present — the countdown is paused while hovered.
      expect(document.body.contains(item)).toBe(true);

      jest.useRealTimers();
    });

    it("should resume the countdown when the cursor leaves", () => {
      jest.useFakeTimers();

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);
      const item = document.querySelector("courier-toast-item") as CourierToastItem;

      // Pause while hovered...
      hover();
      jest.advanceTimersByTime(10_000);
      expect(document.body.contains(item)).toBe(true);

      // ...then leave: the countdown resumes and dismisses after the remaining
      // time (plus the fade-out animation).
      unhover();
      jest.advanceTimersByTime(5000 + TOAST_DISMISS_ANIMATION_MS);

      expect(document.body.contains(item)).toBe(false);

      jest.useRealTimers();
    });

    it("should resume the countdown from where it left off, not restart it", () => {
      jest.useFakeTimers();

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);
      const item = document.querySelector("courier-toast-item") as CourierToastItem;

      // 4s of the 5s countdown elapses, then the cursor arrives and parks for a while.
      jest.advanceTimersByTime(4000);
      hover();
      jest.advanceTimersByTime(60_000);
      expect(document.body.contains(item)).toBe(true);

      // On leaving, only the banked 1s is left — not another full 5s.
      unhover();
      jest.advanceTimersByTime(1000 + TOAST_DISMISS_ANIMATION_MS);
      expect(document.body.contains(item)).toBe(false);

      jest.useRealTimers();
    });

    it("should pause every item in the stack, not just the top one", () => {
      jest.useFakeTimers();

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      CourierToastDatastore.shared.addMessage({ ...INBOX_MESSAGE, messageId: "1" });
      CourierToastDatastore.shared.addMessage({ ...INBOX_MESSAGE, messageId: "2" });
      CourierToastDatastore.shared.addMessage({ ...INBOX_MESSAGE, messageId: "3" });

      // The whole stack is one hover surface: reading the top toast shouldn't
      // silently burn down the countdowns of the ones queued behind it.
      hover();
      jest.advanceTimersByTime(30_000);

      expect(document.querySelectorAll("courier-toast-item").length).toBe(3);

      jest.useRealTimers();
    });

    it("should keep a hovered toast paused when a new toast arrives on top of it", () => {
      jest.useFakeTimers();

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      CourierToastDatastore.shared.addMessage({ ...INBOX_MESSAGE, messageId: "1" });
      const firstItem = document.querySelector("courier-toast-item") as CourierToastItem;

      hover();
      jest.advanceTimersByTime(1000);

      // The new toast lands under the cursor, which pushes the first item down the
      // stack. The cursor never left the toast, so neither countdown may resume.
      CourierToastDatastore.shared.addMessage({ ...INBOX_MESSAGE, messageId: "2" });
      jest.advanceTimersByTime(30_000);

      expect(document.body.contains(firstItem)).toBe(true);
      expect(document.querySelectorAll("courier-toast-item").length).toBe(2);

      jest.useRealTimers();
    });

    it("should pause a toast that arrives while the cursor is already over the stack", () => {
      jest.useFakeTimers();

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);

      // The cursor is parked where the toast is about to appear.
      hover();
      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);
      const item = document.querySelector("courier-toast-item") as CourierToastItem;

      jest.advanceTimersByTime(30_000);
      expect(document.body.contains(item)).toBe(true);

      // The full countdown is still owed once the cursor leaves.
      unhover();
      jest.advanceTimersByTime(4999);
      expect(document.body.contains(item)).toBe(true);
      jest.advanceTimersByTime(1 + TOAST_DISMISS_ANIMATION_MS);
      expect(document.body.contains(item)).toBe(false);

      jest.useRealTimers();
    });

    it("should pause the countdown of a custom toast item", () => {
      jest.useFakeTimers();

      toast.setToastItem(() => {
        const el = document.createElement("div");
        el.id = "custom-item";
        return el;
      });
      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);
      const item = document.getElementById("custom-item") as HTMLElement;

      hover();
      jest.advanceTimersByTime(30_000);
      expect(document.body.contains(item)).toBe(true);

      unhover();
      jest.advanceTimersByTime(5000);
      expect(document.body.contains(item)).toBe(false);

      jest.useRealTimers();
    });
  });

  describe("auto-dismiss stack", () => {
    /** Time for a countdown to expire plus the exit animation before removal. */
    const DISMISS_MS = 5000 + TOAST_DISMISS_ANIMATION_MS;

    const addMessages = (count: number) => {
      for (let i = 1; i <= count; i++) {
        CourierToastDatastore.shared.addMessage({ ...INBOX_MESSAGE, messageId: `${i}`, title: `Message ${i}` });
      }

      return Array.from(document.querySelectorAll("courier-toast-item")) as CourierToastItem[];
    };

    it("should only count down the top toast, not the ones stacked behind it", () => {
      jest.useFakeTimers();

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      const [first, second, third] = addMessages(3);

      // Only the newest toast is legible, so only it is on the clock.
      jest.advanceTimersByTime(DISMISS_MS);

      expect(document.body.contains(third!)).toBe(false);
      expect(document.body.contains(second!)).toBe(true);
      expect(document.body.contains(first!)).toBe(true);

      jest.useRealTimers();
    });

    it("should dismiss a stack one toast at a time, newest first", () => {
      jest.useFakeTimers();

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      const [first, second, third] = addMessages(3);

      jest.advanceTimersByTime(DISMISS_MS);
      expect(document.querySelectorAll("courier-toast-item").length).toBe(2);

      // The second toast surfaces and gets a countdown of its own.
      jest.advanceTimersByTime(DISMISS_MS);
      expect(document.body.contains(second!)).toBe(false);
      expect(document.body.contains(first!)).toBe(true);

      jest.advanceTimersByTime(DISMISS_MS);
      expect(document.body.contains(first!)).toBe(false);
      expect(document.body.contains(third!)).toBe(false);

      jest.useRealTimers();
    });

    it("should freeze a toast's countdown where it stood when a new toast covers it", () => {
      jest.useFakeTimers();

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      CourierToastDatastore.shared.addMessage({ ...INBOX_MESSAGE, messageId: "1" });
      const first = document.querySelector("courier-toast-item") as CourierToastItem;

      // 4s of the first toast's countdown burns down before it's covered, which
      // banks the remaining 1s rather than restarting it.
      jest.advanceTimersByTime(4000);
      CourierToastDatastore.shared.addMessage({ ...INBOX_MESSAGE, messageId: "2" });

      // The new toast runs its full countdown while the first sits frozen.
      jest.advanceTimersByTime(DISMISS_MS);
      expect(document.body.contains(first)).toBe(true);

      // Back on top, the first toast owes only the banked 1s.
      jest.advanceTimersByTime(999);
      expect(document.body.contains(first)).toBe(true);
      jest.advanceTimersByTime(1 + TOAST_DISMISS_ANIMATION_MS);
      expect(document.body.contains(first)).toBe(false);

      jest.useRealTimers();
    });

    it("should freeze the progress bar of a toast that isn't on top", () => {
      jest.useFakeTimers();

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      const [first, second] = addMessages(2);

      const barPlayState = (item: CourierToastItem) =>
        (item.querySelector(".auto-dismiss") as HTMLElement).style.animationPlayState;

      // The bar is the countdown made visible, so a frozen countdown must not
      // leave a bar draining behind the top toast.
      expect(barPlayState(first!)).toBe("paused");
      expect(barPlayState(second!)).not.toBe("paused");

      jest.useRealTimers();
    });

    it("should not start the next toast's countdown while the cursor is still over the stack", () => {
      jest.useFakeTimers();

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      const [first, second] = addMessages(2);

      // The cursor arrives, so nothing counts down...
      toast.dispatchEvent(new MouseEvent("mouseenter"));
      jest.advanceTimersByTime(30_000);
      expect(document.querySelectorAll("courier-toast-item").length).toBe(2);

      // ...and dismissing the top one by hand doesn't put the toast underneath
      // on the clock while the cursor is still parked over the stack.
      second!.dismiss(/* timeoutMs= */ 0);
      jest.advanceTimersByTime(30_000);
      expect(document.body.contains(first!)).toBe(true);

      toast.dispatchEvent(new MouseEvent("mouseleave"));
      jest.advanceTimersByTime(DISMISS_MS);
      expect(document.body.contains(first!)).toBe(false);

      jest.useRealTimers();
    });

    it("should only count down the top custom toast item", () => {
      jest.useFakeTimers();

      let customItemCount = 0;
      toast.setToastItem(() => {
        const el = document.createElement("div");
        el.id = `custom-item-${++customItemCount}`;
        return el;
      });
      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      addMessages(2);

      const first = document.getElementById("custom-item-1") as HTMLElement;
      const second = document.getElementById("custom-item-2") as HTMLElement;

      // Custom items are removed without a fade-out.
      jest.advanceTimersByTime(5000);
      expect(document.body.contains(second)).toBe(false);
      expect(document.body.contains(first)).toBe(true);

      jest.advanceTimersByTime(5000);
      expect(document.body.contains(first)).toBe(false);

      jest.useRealTimers();
    });
  });

  describe("setLightTheme", () => {
    it("should set the light theme rendered if mode=light", () => {
      const lightTheme: CourierToastTheme = {
        item: {
          backgroundColor: "#fbeaea",
          title: {
            color: "#2b2727"
          }
        }
      };

      toast.setLightTheme(lightTheme);
      toast.setMode("light");

      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);

      // Check that the theme styles are applied to the DOM
      const styleElements = document.querySelectorAll("style");
      const mergedStyles = Array.from(styleElements).map(el => el.textContent).join();

      expect(mergedStyles).toContain("background-color: #fbeaea");
      expect(mergedStyles).toContain("color: #2b2727");
    });
  });

  describe("setDarkTheme", () => {
    it("should set the dark theme rendered if mode=dark", () => {
      const darkTheme: CourierToastTheme = {
        item: {
          backgroundColor: "#1a1a1a",
          title: {
            color: "#e0e0e0"
          }
        }
      };

      toast.setDarkTheme(darkTheme);
      toast.setMode("dark");

      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);

      // Check that the theme styles are applied to the DOM
      const styleElements = document.querySelectorAll("style");
      const mergedStyles = Array.from(styleElements).map(el => el.textContent).join();

      expect(mergedStyles).toContain("background-color: #1a1a1a");
      expect(mergedStyles).toContain("color: #e0e0e0");
    });
  });

  describe("setMode", () => {
    it("should switch between light and dark themes when both are set", () => {
      const lightTheme: CourierToastTheme = {
        item: {
          backgroundColor: "#fbeaea",
          title: {
            color: "#2b2727"
          }
        }
      };

      const darkTheme: CourierToastTheme = {
        item: {
          backgroundColor: "#1a1a1a",
          title: {
            color: "#e0e0e0"
          }
        }
      };

      toast.setLightTheme(lightTheme);
      toast.setDarkTheme(darkTheme);

      // Test light mode
      toast.setMode("light");
      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);

      let styleElements = document.querySelectorAll("style");
      let mergedStyles = Array.from(styleElements).map(el => el.textContent).join();

      expect(mergedStyles).toContain("background-color: #fbeaea");
      expect(mergedStyles).toContain("color: #2b2727");

      // Test dark mode
      toast.setMode("dark");
      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);

      styleElements = document.querySelectorAll("style");
      mergedStyles = Array.from(styleElements).map(el => el.textContent).join();

      expect(mergedStyles).toContain("background-color: #1a1a1a");
      expect(mergedStyles).toContain("color: #e0e0e0");
    });
  });

  describe("setToastItem", () => {
    it("should render a custom toast item instead of <courier-toast-item>", () => {
      const customItemFactory = () => {
        const el = document.createElement("div");
        el.id = "test-item";
        return el;
      };

      toast.setToastItem(customItemFactory);
      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);

      expect(document.getElementById("test-item")).not.toBeNull();
      expect(document.querySelector("courier-toast-item")).toBeNull();
    });

    it("should unset the custom toast item if called with no arguments", () => {
      const customItemFactory = () => {
        const el = document.createElement("div");
        el.id = "test-content";
        return el;
      };

      toast.setToastItemContent(customItemFactory);
      toast.setToastItemContent();

      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);

      expect(document.getElementById("test-content")).toBeNull();
      expect(document.querySelector("courier-toast-item")).not.toBeNull();
    });
  });

  describe("setToastItemContent", () => {
    it("should render custom toast item content within <courier-toast-item>", () => {
      const customItemContentFactory = () => {
        const el = document.createElement("div");
        el.id = "test-content";
        return el;
      };

      toast.setToastItemContent(customItemContentFactory);
      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);

      expect(document.querySelector("courier-toast-item #test-content")).not.toBeNull();
    });

    it("should unset the custom toast item content if called with no arguments", () => {
      const customItemContentFactory = () => {
        const el = document.createElement("div");
        el.id = "test-content";
        return el;
      };

      toast.setToastItemContent(customItemContentFactory);
      toast.setToastItemContent();

      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);

      expect(document.querySelector("courier-toast-item #test-content")).toBeNull();
    });
  });

  describe("dismissToastForMessage", () => {
    it("should dismiss the toast item matching the message's messageId", () => {
      jest.useFakeTimers()
      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);
      const added = document.querySelector("courier-toast-item") as HTMLElement;
      expect(added).not.toBeNull()
      expect(added.dataset.courierMessageId).toBe("1");

      CourierToastDatastore.shared.removeMessage(INBOX_MESSAGE);

      // Dismiss has a timer set for the item to animate out
      jest.advanceTimersByTime(1000);
      const removed = document.querySelector("courier-toast-item") as HTMLElement;
      expect(removed).toBeNull();
      jest.useRealTimers();
    });

    it("should not dismiss toast items that do not match the message's messageId", () => {
      jest.useFakeTimers()
      CourierToastDatastore.shared.addMessage(INBOX_MESSAGE);
      const elementBeforeDismiss = document.querySelector("courier-toast-item") as HTMLElement;
      expect(elementBeforeDismiss).not.toBeNull()
      expect(elementBeforeDismiss.dataset.courierMessageId).toBe("1");

      CourierToastDatastore.shared.removeMessage({ ...INBOX_MESSAGE, messageId: "2" });

      // Dismiss has a timer set for the item to animate out
      jest.advanceTimersByTime(1000);
      const elementAfterDismiss = document.querySelector("courier-toast-item") as HTMLElement;
      expect(elementAfterDismiss).not.toBeNull()
      expect(elementAfterDismiss.dataset.courierMessageId).toBe("1");
      jest.useRealTimers();
    });
  });

});
