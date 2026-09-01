import { InboxMessage } from "@trycourier/courier-js";
import { defaultLightTheme } from "../../types/courier-inbox-theme";
import { CourierInboxThemeManager } from "../../types/courier-inbox-theme-manager";
import { CourierInboxListItem } from "../courier-inbox-list-item";

/**
 * The unread dot marks the title, so it has to sit against the title's own box. Pinning it to a
 * fixed offset from the top of the row only lines up at one font size.
 */
function renderItem(message: InboxMessage): CourierInboxListItem {
  const themeManager = new CourierInboxThemeManager(defaultLightTheme);
  themeManager.setMode('light');

  const item = new CourierInboxListItem(themeManager, true, false);
  item.setMessage(message);
  document.body.appendChild(item);

  return item;
}

describe('inbox list item unread indicator', () => {

  // jsdom does not implement matchMedia, which the theme manager relies on.
  beforeAll(() => {
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

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('sits in the title row, immediately before the title', () => {
    const item = renderItem({ messageId: '1', title: 'A title' });

    const indicator = item.querySelector('.unread-indicator');
    const titleRow = item.querySelector('.title-row');

    expect(indicator?.parentElement).toBe(titleRow);
    expect(indicator?.nextElementSibling).toBe(item.querySelector('.title'));
  });

  it('centers on the title rather than a fixed offset from the top of the row', () => {
    const styles = CourierInboxListItem.getStyles(defaultLightTheme);

    expect(styles).toContain('top: 50%;');
    expect(styles).toContain('transform: translateY(-50%);');
    expect(styles).not.toContain('top: 28px;');
  });

  it('hangs in the item padding so read and unread titles start at the same place', () => {
    const styles = CourierInboxListItem.getStyles(defaultLightTheme);

    expect(styles).toContain('left: -14px;');
  });

  it('survives a title rewritten as markdown', () => {
    // The title is written with innerHTML, which is why the dot cannot live inside it.
    const item = renderItem({ messageId: '1', title: '**Bold** title' });

    expect(item.querySelector('.title-row .unread-indicator')).not.toBeNull();
  });

  it('shows only while the message is unread', () => {
    const unread = renderItem({ messageId: '1', title: 'A title' });
    expect(unread.classList.contains('unread')).toBe(true);

    const read = renderItem({ messageId: '2', title: 'A title', read: new Date().toISOString() });
    expect(read.classList.contains('unread')).toBe(false);
  });

});
