import { InboxAction, InboxMessage } from "@trycourier/courier-js";
import { defaultDarkTheme, defaultLightTheme } from "../../types/courier-inbox-theme";
import { CourierInboxThemeManager } from "../../types/courier-inbox-theme-manager";
import { CourierInboxListItem } from "../courier-inbox-list-item";

/**
 * What each style looks like when the action carries no color of its own.
 *
 * Every test elsewhere hands the action a `background_color`, which is how actions used to
 * arrive: the send pipeline substituted the brand's primary into every one. Now that they can
 * come through bare, the defaults are what most actions will actually render as, and nothing
 * pinned them.
 *
 * The plain button is the important one. It is the look already in the wild, so it has to stay
 * exactly where it was — a new style being added is not a reason for every existing action to
 * change appearance.
 */
function render(action: InboxAction, mode: 'light' | 'dark' = 'light'): string {
  const themeManager = new CourierInboxThemeManager(mode === 'dark' ? defaultDarkTheme : defaultLightTheme);
  themeManager.setMode(mode);

  const item = new CourierInboxListItem(themeManager, true, false);
  const message: InboxMessage = { messageId: '1', title: 'title', actions: [action] };
  item.setMessage(message);
  document.body.appendChild(item);

  const styles = item.querySelector('courier-button')?.shadowRoot?.querySelector('style')?.textContent;
  if (!styles) {
    throw new Error('action button did not render');
  }
  return styles;
}

describe('an action carrying no color of its own', () => {

  beforeAll(() => {
    if (!window.matchMedia) {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: (query: string) => ({
          matches: false, media: query, onchange: null,
          addEventListener: () => {}, removeEventListener: () => {},
          addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
        }),
      });
    }
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.firstChild.remove();
    }
  });

  // `colors.border` — the divider hairline. Quiet on purpose: the shape and the fill carry the
  // button, and this is the edge every action in the wild already has.
  describe('the plain button, which must not move', () => {
    it('keeps the hairline edge on white', () => {
      const styles = render({ content: 'Confirm' });
      expect(styles).toContain('border: 1px solid #E5E5E5;');
      expect(styles).toContain('background-color: #FFFFFF;');
      expect(styles).toContain('color: #171717;');
    });

    it('keeps the hairline edge on black', () => {
      const styles = render({ content: 'Confirm' }, 'dark');
      expect(styles).toContain('border: 1px solid #3A3A3A;');
      expect(styles).toContain('background-color: #171717;');
    });

    it('renders the same whether the style is absent or spelled out', () => {
      expect(render({ content: 'Confirm', style: 'button' })).toEqual(render({ content: 'Confirm' }));
    });

    it('still floats', () => {
      expect(render({ content: 'Confirm' })).toContain('box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.06);');
    });
  });

  // The new look. One gray cannot read the same on both faces: 600 is a quiet edge on white and
  // a loud one on near-black, so dark steps down to 650.
  describe('the outlined button', () => {
    it('draws an edge you can see on white', () => {
      const styles = render({ content: 'Maybe later', style: 'secondary' });
      expect(styles).toContain('border: 1px solid #737373;');
      expect(styles).toContain('background-color: #FFFFFF;');
    });

    it('draws an edge you can see on black', () => {
      expect(render({ content: 'Maybe later', style: 'secondary' }, 'dark')).toContain('border: 1px solid #585858;');
    });

    // An outline is the whole statement; a shadow underneath it would be a second one.
    it('sits flat', () => {
      expect(render({ content: 'Maybe later', style: 'secondary' })).toContain('box-shadow: none;');
    });

    it('is visibly not the plain button', () => {
      expect(render({ content: 'Maybe later', style: 'secondary' })).not.toEqual(render({ content: 'Maybe later' }));
    });
  });

  describe('the quieter two, unchanged', () => {
    it('draws a borderless button for tertiary', () => {
      const styles = render({ content: 'Not now', style: 'tertiary' });
      expect(styles).toContain('border: 1px solid transparent;');
      expect(styles).toContain('background-color: transparent;');
      // It is still a button: it keeps the padding and the hit area a link gives up.
      expect(styles).toContain('padding: 6px 10px;');
    });

    it('draws inline text for link', () => {
      const styles = render({ content: 'Learn more', style: 'link' });
      expect(styles).toContain('text-decoration: underline;');
      expect(styles).toContain('padding: 0px;');
    });

    it('keeps all four looks distinct', () => {
      const looks = ['button', 'secondary', 'tertiary', 'link'].map((style) =>
        render({ content: 'Go', style })
      );
      expect(new Set(looks).size).toBe(4);
    });
  });
});
