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

  // The plain button, and what an action with no style renders as: transparent over the row,
  // edged with the divider hairline. This is the look that shipped before any of these styles
  // existed, and it does not move.
  describe('the plain button', () => {
    it("keeps the hairline edge on white", () => {
      const styles = render({ content: 'Confirm' });
      expect(styles).toContain('border: 1px solid #E5E5E5;');
      expect(styles).toContain('color: #171717;');
    });

    it("keeps the hairline edge on black", () => {
      const styles = render({ content: 'Confirm' }, 'dark');
      expect(styles).toContain('border: 1px solid #3A3A3A;');
      expect(styles).toContain('color: #FFFFFF;');
    });

    it('renders the same whether the style is absent or spelled out', () => {
      expect(render({ content: 'Confirm', style: 'button' })).toEqual(render({ content: 'Confirm' }));
    });

    it('floats', () => {
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

    // The outline sits on the surface, not the ink: it is the quieter of the two.
    it('keeps the mode\'s surface behind it', () => {
      expect(render({ content: 'Maybe later', style: 'secondary' })).toContain('background-color: #FFFFFF;');
      expect(render({ content: 'Maybe later', style: 'secondary' }, 'dark')).toContain('background-color: #171717;');
    });
  });

  describe('the solid one, and the link', () => {
    it('draws a solid, high-contrast button for tertiary', () => {
      const styles = render({ content: 'Not now', style: 'tertiary' });
      expect(styles).toContain('background-color: #171717;');
      expect(styles).toContain('color: #FFFFFF;');
      // No edge of its own, but it still reserves the border box so it lines up with an
      // outlined sibling in the same row.
      expect(styles).toContain('border: 1px solid transparent;');
    });

    it('flips the solid button with the mode', () => {
      const styles = render({ content: 'Not now', style: 'tertiary' }, 'dark');
      expect(styles).toContain('background-color: #FFFFFF;');
      expect(styles).toContain('color: #171717;');
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
