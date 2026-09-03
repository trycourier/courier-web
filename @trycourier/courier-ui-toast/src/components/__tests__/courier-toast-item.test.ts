import { InboxAction, InboxMessage } from "@trycourier/courier-js";
import { defaultLightTheme } from "../../types/courier-toast-theme";
import { CourierToastThemeManager } from "../../types/courier-toast-theme-manager";
import { CourierToastItem } from "../courier-toast-item";
import { CourierToastItemFactoryProps } from "../../types/toast";

const THEME_MANAGER = new CourierToastThemeManager(defaultLightTheme);
const INBOX_MESSAGE: InboxMessage = {
  messageId: "1",
  title: "title",
  preview: "preview",
};

/** Mount a toast carrying `actions` and return it, so a test can read the button it rendered. */
function renderWithActions(actions: InboxAction[], themeManager = THEME_MANAGER): CourierToastItem {
  const item = new CourierToastItem({
    message: { ...INBOX_MESSAGE, actions },
    autoDismiss: false,
    autoDismissTimeoutMs: 1000,
    themeManager,
  });

  document.body.appendChild(item);
  return item;
}

/** The stylesheet of the first action button on the page. */
function actionStyles(): string {
  return document.querySelector('courier-button')?.shadowRoot?.querySelector('style')?.textContent ?? '';
}

describe('courier-toast-item', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.firstChild.remove();
    }
  });

  describe('onComponentMounted', () => {
    it('should render a component', () => {
      const item = new CourierToastItem({
        message: INBOX_MESSAGE,
        autoDismiss: false,
        autoDismissTimeoutMs: 1000,
        themeManager: THEME_MANAGER,
      });

      document.body.appendChild(item);

      expect(document.querySelector('courier-toast-item')).not.toBeNull();
      expect(document.querySelector('courier-button')).toBeNull();
    });

    it('should render action buttons if the message includes actions', () => {
      const action: InboxAction = { content: "Click me!" };
      const messageWithAction: InboxMessage = {
        ...INBOX_MESSAGE,
        actions: [ action ],
      };
      const item = new CourierToastItem({
        message: messageWithAction,
        autoDismiss: false,
        autoDismissTimeoutMs: 1000,
        themeManager: THEME_MANAGER,
      });

      document.body.appendChild(item);

      expect(document.querySelector('courier-toast-item')).not.toBeNull();
      expect(document.querySelector('courier-button')).not.toBeNull();
    });

    it('should style an action button the way the action asks to be styled', () => {
      const messageWithAction: InboxMessage = {
        ...INBOX_MESSAGE,
        actions: [{ content: "Click me!", background_color: "#9D3789" }],
      };
      const item = new CourierToastItem({
        message: messageWithAction,
        autoDismiss: false,
        autoDismissTimeoutMs: 1000,
        themeManager: THEME_MANAGER,
      });

      document.body.appendChild(item);

      const styles = actionStyles();
      expect(styles).toContain('background-color: #9D3789;');
      // Readable on the fill, since Elemental actions carry no text color of their own.
      expect(styles).toContain('color: #FFFFFF;');
    });

    it('should outline an action that asks for the secondary style', () => {
      renderWithActions([{ content: "Maybe later", background_color: "#9D3789", style: "secondary" }]);

      const styles = actionStyles();
      // The colour becomes the outline and the label rather than a fill — the whole difference
      // between the two looks, and the reason a toast has to read `style` at all.
      expect(styles).toContain('border: 1px solid #9D3789;');
      expect(styles).toContain('color: #9D3789;');
      expect(styles).not.toContain('background-color: #9D3789;');
    });

    it('should render a link-style action as a link rather than a button', () => {
      renderWithActions([{ content: "Learn more", style: "link" }]);

      const styles = actionStyles();
      expect(styles).toContain('text-decoration: underline;');
      expect(styles).toContain('background-color: transparent;');
      expect(styles).toContain('padding: 0px;');
    });

    // The toast theme merges the actions block and its variants; a value that never reaches the
    // button reads as supported and silently does nothing.
    it('should apply the theme actions block, variants included', () => {
      const themeManager = new CourierToastThemeManager(defaultLightTheme);
      themeManager.setLightTheme({
        item: {
          actions: {
            borderRadius: '2px',
            secondary: { border: '2px solid #00FF00' },
            link: { font: { color: '#FF00FF' } }
          }
        }
      });
      themeManager.setMode('light');

      renderWithActions([{ content: "Confirm", background_color: "#9D3789" }], themeManager);
      expect(actionStyles()).toContain('border-radius: 2px;');

      document.body.firstChild?.remove();
      renderWithActions([{ content: "Later", background_color: "#9D3789", style: "secondary" }], themeManager);
      expect(actionStyles()).toContain('border: 2px solid #00FF00;');

      document.body.firstChild?.remove();
      renderWithActions([{ content: "Learn more", style: "link" }], themeManager);
      expect(actionStyles()).toContain('color: #FF00FF;');
    });

    it('should render the icon by default', () => {
      const item = new CourierToastItem({
        message: INBOX_MESSAGE,
        autoDismiss: false,
        autoDismissTimeoutMs: 1000,
        themeManager: THEME_MANAGER,
      });

      document.body.appendChild(item);

      expect(document.querySelector('courier-icon.icon')).not.toBeNull();
    });

    it('should leave the icon out when the theme hides it', () => {
      const hiddenIconTheme = {
        ...defaultLightTheme,
        item: {
          ...defaultLightTheme.item,
          icon: { ...defaultLightTheme.item?.icon, visible: false },
        },
      };
      // The manager resets to the defaults on construction, so the theme has to
      // be applied afterwards — for both modes, whichever the environment reports.
      const themeManager = new CourierToastThemeManager(hiddenIconTheme);
      themeManager.setLightTheme(hiddenIconTheme);
      themeManager.setDarkTheme(hiddenIconTheme);
      const item = new CourierToastItem({
        message: INBOX_MESSAGE,
        autoDismiss: false,
        autoDismissTimeoutMs: 1000,
        themeManager,
      });

      document.body.appendChild(item);

      expect(document.querySelector('courier-icon.icon')).toBeNull();
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
      item.onToastItemClick(handler);
      document.body.appendChild(item);

      (document.querySelector('courier-toast-item') as HTMLElement).click();

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('onItemActionClicked', () => {
    it('should call the handler when the action button is clicked', () => {
      const handler = jest.fn();
      const action: InboxAction = { content: "Click me!" };
      const messageWithAction: InboxMessage = {
        ...INBOX_MESSAGE,
        actions: [ action ],
      };
      const item = new CourierToastItem({
        message: messageWithAction,
        autoDismiss: false,
        autoDismissTimeoutMs: 1000,
        themeManager: THEME_MANAGER,
      });
      item.onToastItemActionClick(handler);
      document.body.appendChild(item);

      const buttonSelector = 'courier-toast-item .actions-container courier-button';
      const buttonShadowRoot = document.querySelector(buttonSelector)?.shadowRoot;
      (buttonShadowRoot?.querySelector('button') as HTMLElement).click();

      expect(handler).toHaveBeenCalledWith({ action, message: messageWithAction })
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
