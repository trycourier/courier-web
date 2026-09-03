import { InboxMessage } from "@trycourier/courier-js";
import { CourierInboxTheme, defaultDarkTheme, defaultLightTheme } from "../../types/courier-inbox-theme";
import { CourierInboxThemeManager } from "../../types/courier-inbox-theme-manager";
import { CourierInboxListItem } from "../courier-inbox-list-item";

/**
 * The list swaps its injected stylesheets when the theme changes, which carries everything the
 * item draws in CSS. The action buttons and the menu are not drawn in CSS — they are built in
 * JS from the theme the item is holding, so an item that never re-reads the theme keeps the one
 * it was born in and a switch to dark leaves them wearing light values.
 */
function themed(base: CourierInboxTheme, backgroundColor: string): CourierInboxTheme {
  return {
    ...base,
    inbox: {
      ...base.inbox,
      list: {
        ...base.inbox?.list,
        item: {
          ...base.inbox?.list?.item,
          actions: { backgroundColor }
        }
      }
    }
  };
}

describe('a list item follows a theme flip', () => {

  const realMatchMedia = window.matchMedia;
  let flip: (dark: boolean) => void;

  beforeEach(() => {
    const listeners: Array<(e: { matches: boolean }) => void> = [];
    let dark = false;

    (window as unknown as { matchMedia: unknown }).matchMedia = (media: string) => ({
      media,
      get matches() { return dark; },
      addEventListener: (_: string, cb: (e: { matches: boolean }) => void) => { listeners.push(cb); },
      removeEventListener: () => { },
      addListener: () => { },
      removeListener: () => { },
      dispatchEvent: () => false,
      onchange: null
    });

    flip = (toDark: boolean) => {
      dark = toDark;
      listeners.forEach(cb => cb({ matches: toDark }));
    };
  });

  afterEach(() => {
    (window as unknown as { matchMedia: unknown }).matchMedia = realMatchMedia;
    document.body.innerHTML = '';
  });

  function renderItem(): { item: CourierInboxListItem; actionFill: () => string | undefined } {
    const themeManager = new CourierInboxThemeManager(defaultLightTheme);
    themeManager.setLightTheme(themed(defaultLightTheme, '#AAAAAA'));
    themeManager.setDarkTheme(themed(defaultDarkTheme, '#BBBBBB'));

    const item = new CourierInboxListItem(themeManager, true, false);
    const message: InboxMessage = { messageId: '1', title: 'A title', actions: [{ content: 'Confirm' }] };
    item.setMessage(message);
    document.body.appendChild(item);

    const actionFill = () => {
      const styles = item.querySelector('courier-button')?.shadowRoot?.querySelector('style')?.textContent ?? '';
      return /background-color: (\S+);/.exec(styles)?.[1];
    };

    return { item, actionFill };
  }

  it('rebuilds an action with the theme the new mode brings, and back again', () => {
    const { actionFill } = renderItem();

    expect(actionFill()).toBe('#AAAAAA');

    flip(true);
    expect(actionFill()).toBe('#BBBBBB');

    flip(false);
    expect(actionFill()).toBe('#AAAAAA');
  });

  it('stops listening once it leaves the page', () => {
    const { item, actionFill } = renderItem();

    item.remove();
    flip(true);

    // Nothing to assert about the detached item's look — the point is that the flip does not
    // reach it, so a list that has scrolled an item away is not rebuilding it forever.
    expect(actionFill()).toBe('#AAAAAA');
  });

});
