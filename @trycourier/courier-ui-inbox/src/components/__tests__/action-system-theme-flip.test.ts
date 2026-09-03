import { CourierButton } from "@trycourier/courier-ui-core";

/**
 * An action has to follow the OS when the viewer flips it.
 *
 * Everything else in the inbox re-reads its theme through the theme manager's subscription. A
 * button styles itself once, in its constructor, resolving `mode: 'system'` against the theme
 * in force at that moment — and `themeManager.mode` is the *user's* setting, which is
 * `'system'` unless an integrator pinned it. Without a hook of its own the button was the one
 * thing left wearing the mode that had just ended: a near-black filled action on a dark list,
 * or a white outlined one.
 */
describe('an action follows a system theme flip', () => {

  let flip: (dark: boolean) => void;
  const realMatchMedia = window.matchMedia;

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

  const stylesOf = (button: CourierButton): string =>
    button.shadowRoot?.querySelector('style')?.textContent ?? '';

  it('restyles a filled action when the OS turns dark, and back again', () => {
    // `tertiary` is the solid fill — the one with a face to repaint when the mode flips.
    const button = new CourierButton({ mode: 'system', text: 'Confirm', variant: 'tertiary' });
    document.body.appendChild(button);

    expect(stylesOf(button)).toContain('background-color: #171717;');

    flip(true);
    expect(stylesOf(button)).toContain('background-color: #FFFFFF;');

    flip(false);
    expect(stylesOf(button)).toContain('background-color: #171717;');
  });

  it('leaves a button alone that was pinned to a mode', () => {
    // Pinning is the integrator saying the OS does not get a vote.
    const button = new CourierButton({ mode: 'light', text: 'Confirm', variant: 'tertiary' });
    document.body.appendChild(button);

    flip(true);
    expect(stylesOf(button)).toContain('background-color: #171717;');
  });
});
