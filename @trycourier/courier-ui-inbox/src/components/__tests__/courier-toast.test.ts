import { InboxMessage } from "@trycourier/courier-js";
import { CourierToast } from "../courier-toast";
import { CourierToastItem } from "../courier-toast-item";
import { CourierInboxTheme } from "../../types/courier-inbox-theme";

const INBOX_MESSAGE: InboxMessage = {
  messageId: "1",
  title: "I'm a test message",
  preview: "I'm a test message preview",
};

describe("courier-toast", () => {
  let toast: CourierToast;

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
      toast.addInboxMessage(INBOX_MESSAGE);

      const toastItem = document.querySelector("courier-toast-item");

      expect(toastItem).not.toBeNull();
      expect(toastItem?.textContent).toContain(INBOX_MESSAGE.title);
    });

    it("should add multiple <courier-toast-item>s but only have the last three added visible", () => {
      const message1 = { ...INBOX_MESSAGE, messageId: "1", title: "Message 1" };
      const message2 = { ...INBOX_MESSAGE, messageId: "2", title: "Message 2" };
      const message3 = { ...INBOX_MESSAGE, messageId: "3", title: "Message 3" };
      const message4 = { ...INBOX_MESSAGE, messageId: "4", title: "Message 4" };

      toast.addInboxMessage(message1);
      toast.addInboxMessage(message2);
      toast.addInboxMessage(message3);
      toast.addInboxMessage(message4);

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

  describe("onToastItemDismissed", () => {
    it("should call the handler with the dismissed message", () => {
      jest.useFakeTimers()
      const dismissedCallback = jest.fn();
      toast.onToastItemDismissed(dismissedCallback);

      const item = toast.addInboxMessage(INBOX_MESSAGE) as CourierToastItem;
      item.dismiss();

      // Dismiss has a timer set for the item to animate out
      jest.advanceTimersByTime(1000);
      expect(dismissedCallback).toHaveBeenCalledWith({ message: INBOX_MESSAGE });
      jest.useRealTimers()
    });
  });

  describe("onToastItemAdded", () => {
    it("should call the handler with the added message and element", () => {
      const addedCallback = jest.fn();
      toast.onToastItemAdded(addedCallback);

      toast.addInboxMessage(INBOX_MESSAGE);

      expect(addedCallback).toHaveBeenCalledWith({
        message: INBOX_MESSAGE,
        toastItem: expect.any(CourierToastItem)
      });
    });
  });

  describe("onToastItemClick", () => {
    it("should call the handler with the added message and element", () => {
      const clickCallback = jest.fn();

      toast.onToastItemClick(clickCallback);

      const item = toast.addInboxMessage(INBOX_MESSAGE) as CourierToastItem;
      item.click();

      expect(clickCallback).toHaveBeenCalledWith({
        message: INBOX_MESSAGE,
        toastItem: expect.any(CourierToastItem)
      });
    });
  });

  describe("enableAutoDismiss", () => {
    it("should automatically dismiss the toast and call onToastItemDismissed", () => {
      jest.useFakeTimers();

      const dismissedCallback = jest.fn();
      toast.onToastItemDismissed(dismissedCallback);

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      const item = toast.addInboxMessage(INBOX_MESSAGE) as CourierToastItem;

      // Verify the item is initially in the DOM
      expect(document.body.contains(item)).toBe(true);

      // Fast-forward time past auto-dismiss timeout
      jest.advanceTimersByTime(6000);

      // Verify the item is no longer in the DOM
      expect(dismissedCallback).toHaveBeenCalledWith({ message: INBOX_MESSAGE });
      expect(document.body.contains(item)).toBe(false);

      jest.useRealTimers();
    });
  });

  describe("disableAutoDismiss", () => {
    it("should revert auto-dismiss if it were previously enabled", () => {
      jest.useFakeTimers();

      const dismissedCallback = jest.fn();
      toast.onToastItemDismissed(dismissedCallback);

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(5000);
      toast.disableAutoDismiss();
      const item = toast.addInboxMessage(INBOX_MESSAGE) as CourierToastItem;

      // Verify the item is initially in the DOM
      expect(document.body.contains(item)).toBe(true);

      // Fast-forward time past auto-dismiss timeout
      jest.advanceTimersByTime(6000);

      // Verify the item is still in the DOM
      expect(dismissedCallback).not.toHaveBeenCalled();
      expect(document.body.contains(item)).toBe(true);

      jest.useRealTimers();
    });
  });

  describe("setAutoDismissTimeoutMs", () => {
    it("should set the auto-dismiss timeout used if auto-dismiss is enabled", () => {
      jest.useFakeTimers();

      const dismissedCallback = jest.fn();
      toast.onToastItemDismissed(dismissedCallback);

      toast.enableAutoDismiss();
      toast.setAutoDismissTimeoutMs(10_000);
      const item = toast.addInboxMessage(INBOX_MESSAGE) as CourierToastItem;

      // Verify the item is initially in the DOM
      expect(document.body.contains(item)).toBe(true);

      // Fast-forward time (still before auto-dismiss timeout)
      jest.advanceTimersByTime(5000);

      // Verify the item still in DOM
      expect(document.body.contains(item)).toBe(true);

      // Fast-forward time past auto-dismiss timeout
      jest.advanceTimersByTime(6000);

      // Verify the item is no longer in the DOM
      expect(dismissedCallback).toHaveBeenCalledWith({ message: INBOX_MESSAGE });
      expect(document.body.contains(item)).toBe(false);

      jest.useRealTimers();
    });
  });

  describe("setLightTheme", () => {
    it("should set the light theme rendered if mode=light", () => {
      const lightTheme: CourierInboxTheme = {
        toast: {
          item: {
            backgroundColor: "#fbeaea",
            title: {
              color: "#2b2727"
            }
          }
        }
      };

      toast.setLightTheme(lightTheme);
      toast.setMode("light");

      toast.addInboxMessage(INBOX_MESSAGE);

      // Check that the theme styles are applied to the DOM
      const styleElements = document.querySelectorAll("style");
      const mergedStyles = Array.from(styleElements).map(el => el.textContent).join();

      expect(mergedStyles).toContain("background-color: #fbeaea");
      expect(mergedStyles).toContain("color: #2b2727");
    });
  });

  describe("setDarkTheme", () => {
    it("should set the dark theme rendered if mode=dark", () => {
      const darkTheme: CourierInboxTheme = {
        toast: {
          item: {
            backgroundColor: "#1a1a1a",
            title: {
              color: "#e0e0e0"
            }
          }
        }
      };

      toast.setDarkTheme(darkTheme);
      toast.setMode("dark");

      toast.addInboxMessage(INBOX_MESSAGE);

      // Check that the theme styles are applied to the DOM
      const styleElements = document.querySelectorAll("style");
      const mergedStyles = Array.from(styleElements).map(el => el.textContent).join();

      expect(mergedStyles).toContain("background-color: #1a1a1a");
      expect(mergedStyles).toContain("color: #e0e0e0");
    });
  });

  describe("setMode", () => {
    it("should switch between light and dark themes when both are set", () => {
      const lightTheme: CourierInboxTheme = {
        toast: {
          item: {
            backgroundColor: "#fbeaea",
            title: {
              color: "#2b2727"
            }
          }
        }
      };

      const darkTheme: CourierInboxTheme = {
        toast: {
          item: {
            backgroundColor: "#1a1a1a",
            title: {
              color: "#e0e0e0"
            }
          }
        }
      };

      toast.setLightTheme(lightTheme);
      toast.setDarkTheme(darkTheme);

      // Test light mode
      toast.setMode("light");
      toast.addInboxMessage(INBOX_MESSAGE);

      let styleElements = document.querySelectorAll("style");
      let mergedStyles = Array.from(styleElements).map(el => el.textContent).join();

      expect(mergedStyles).toContain("background-color: #fbeaea");
      expect(mergedStyles).toContain("color: #2b2727");

      // Test dark mode
      toast.setMode("dark");
      toast.addInboxMessage(INBOX_MESSAGE);

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
      toast.addInboxMessage(INBOX_MESSAGE);

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

      toast.addInboxMessage(INBOX_MESSAGE);

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
      toast.addInboxMessage(INBOX_MESSAGE);

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

      toast.addInboxMessage(INBOX_MESSAGE);

      expect(document.querySelector("courier-toast-item #test-content")).toBeNull();
    });
  });

  describe("dismissToastForMessage", () => {
    it("should dismiss the toast item matching the message's messageId", () => {
      jest.useFakeTimers()
      toast.addInboxMessage(INBOX_MESSAGE);
      const added = document.querySelector("courier-toast-item") as HTMLElement;
      expect(added).not.toBeNull()
      expect(added.dataset.courierMessageId).toBe("1");

      toast.dismissToastForMessage(INBOX_MESSAGE);

      // Dismiss has a timer set for the item to animate out
      jest.advanceTimersByTime(1000);
      const removed = document.querySelector("courier-toast-item") as HTMLElement;
      expect(removed).toBeNull();
      jest.useRealTimers();
    });

    it("should not dismiss toast items that do not match the message's messageId", () => {
      jest.useFakeTimers()
      toast.addInboxMessage(INBOX_MESSAGE);
      const elementBeforeDismiss = document.querySelector("courier-toast-item") as HTMLElement;
      expect(elementBeforeDismiss).not.toBeNull()
      expect(elementBeforeDismiss.dataset.courierMessageId).toBe("1");

      toast.dismissToastForMessage({...INBOX_MESSAGE, messageId: "2"});

      // Dismiss has a timer set for the item to animate out
      jest.advanceTimersByTime(1000);
      const elementAfterDismiss = document.querySelector("courier-toast-item") as HTMLElement;
      expect(elementAfterDismiss).not.toBeNull()
      expect(elementAfterDismiss.dataset.courierMessageId).toBe("1");
      jest.useRealTimers();
    });
  });

});
