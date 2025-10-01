import { InboxMessage } from "@trycourier/courier-js";
import { defaultLightTheme } from "../../types/courier-inbox-theme";
import { CourierInboxThemeManager } from "../../types/courier-inbox-theme-manager";
import { CourierToastItem } from "../courier-toast-item";
import { CourierToastItemFactoryProps } from "../../types/toast";

const THEME_MANAGER = new CourierInboxThemeManager(defaultLightTheme);
const INBOX_MESSAGE: InboxMessage = {
  messageId: "1",
  title: "title",
  preview: "preview",
};

describe('courier-toast-item', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.firstChild.remove();
    }
  });

  describe('constructor', () => {
    it('should render a component', () => {
      const item = new CourierToastItem({
        message: INBOX_MESSAGE,
        autoDismiss: false,
        autoDismissTimeoutMs: 1000,
        themeManager: THEME_MANAGER,
      });

      document.body.appendChild(item);

      expect(document.querySelector('courier-toast-item')).not.toBeNull();
    });
  });

  describe('setMessage', () => {
    it('should render the message content', () => {
      const item = new CourierToastItem({
        message: INBOX_MESSAGE,
        autoDismiss: false,
        autoDismissTimeoutMs: 1000,
        themeManager: THEME_MANAGER,
      });

      document.body.appendChild(item);

      const el = document.querySelector('courier-toast-item');
      expect(el).not.toBeNull();
      expect(el?.textContent).toContain(INBOX_MESSAGE.title);
      expect(el?.textContent).toContain(INBOX_MESSAGE.preview);
    });
  });

  describe('onItemDismissed', () => {
    it('should call the handler when the item is dismissed if there is a message', () => {
      jest.useFakeTimers();
      const handler = jest.fn();
      const item = new CourierToastItem({
        message: INBOX_MESSAGE,
        autoDismiss: false,
        autoDismissTimeoutMs: 1000,
        themeManager: THEME_MANAGER,
      });

      item.onItemDismissed(handler);

      document.body.appendChild(item);
      item.dismiss();

      // Dismiss doesn't remove the element and call the handler
      // until after the item animates out.
      jest.advanceTimersByTime(1000);
      expect(handler).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });

    it('should not call the handler when the item is dismissed if there is not a message', () => {
      jest.useFakeTimers();
      const handler = jest.fn();
      const item = new CourierToastItem({
        message: INBOX_MESSAGE,
        autoDismiss: false,
        autoDismissTimeoutMs: 1000,
        themeManager: THEME_MANAGER,
      });
      item.onItemDismissed(handler);
      document.body.appendChild(item);

      item.dismiss();

      // Dismiss doesn't remove the element and call the handler
      // until after the item animates out.
      jest.advanceTimersByTime(1000);
      expect(handler).not.toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  describe('onItemClicked', () => {
    it('should call the handler when the item is clicked', () => {
      const handler = jest.fn();
      const item = new CourierToastItem({
        message: INBOX_MESSAGE,
        autoDismiss: false,
        autoDismissTimeoutMs: 1000,
        themeManager: THEME_MANAGER,
      });
      item.onItemClicked(handler);
      document.body.appendChild(item);

      (document.querySelector('courier-toast-item') as HTMLElement).click();

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('setToastItemContent', () => {
    it('should set the toast item content factory', () => {
      const CUSTOM_CONTENT_CLASS = 'my-custom-content';
      const factory = (props: CourierToastItemFactoryProps) => {
        const div = document.createElement('div');
        div.classList.add(CUSTOM_CONTENT_CLASS);
        div.textContent = props.message.title ?? 'no message title';
        return div;
      };

      const item = new CourierToastItem({
        message: INBOX_MESSAGE,
        autoDismiss: false,
        autoDismissTimeoutMs: 1000,
        themeManager: THEME_MANAGER,
      });

      item.setToastItemContent(factory);
      document.body.appendChild(item);

      const contentEls = document.getElementsByClassName(CUSTOM_CONTENT_CLASS);
      expect(contentEls.length).toBe(1);
      expect(contentEls[0].textContent).toBe(INBOX_MESSAGE.title);
    });

    it('should unset the toast item content factory if undefined is passed', () => {
      const CUSTOM_CONTENT_CLASS = 'my-custom-content';
      const factory = (props: CourierToastItemFactoryProps) => {
        const div = document.createElement('div');
        div.classList.add(CUSTOM_CONTENT_CLASS);
        div.textContent = props.message.title ?? 'no message title';
        return div;
      };

      const item = new CourierToastItem({
        message: INBOX_MESSAGE,
        autoDismiss: false,
        autoDismissTimeoutMs: 1000,
        themeManager: THEME_MANAGER,
      });

      item.setToastItemContent(factory);
      item.setToastItemContent();
      document.body.appendChild(item);

      const contentEls = document.getElementsByClassName(CUSTOM_CONTENT_CLASS);
      expect(contentEls.length).toBe(0);
      expect(document.querySelector('courier-toast-item')).not.toBeNull();
    });
  });

  describe('dismiss', () => {
    it('should remove the toast item after a timeout and call onDismiss callback', () => {
      jest.useFakeTimers();
      const handler = jest.fn();
      const item = new CourierToastItem({
        message: INBOX_MESSAGE,
        autoDismiss: false,
        autoDismissTimeoutMs: 1000,
        themeManager: THEME_MANAGER,
      });

      item.onItemDismissed(handler);

      document.body.appendChild(item);
      item.dismiss();

      // Handler should not be called immediately.
      expect(handler).toHaveBeenCalledTimes(0);
      expect(document.querySelector('courier-toast-item')).not.toBeNull();

      // After a timeout the handler should have been called
      // and the item should be removed.
      jest.advanceTimersByTime(1000);
      expect(handler).toHaveBeenCalledTimes(1);
      expect(document.querySelector('courier-toast-item')).toBeNull();

      jest.useRealTimers();
    });
  });
});
