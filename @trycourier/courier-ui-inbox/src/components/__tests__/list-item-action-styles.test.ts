import { InboxAction, InboxMessage } from "@trycourier/courier-js";
import { CourierInboxTheme, defaultDarkTheme, defaultLightTheme } from "../../types/courier-inbox-theme";
import { CourierInboxThemeManager } from "../../types/courier-inbox-theme-manager";
import { CourierInboxListItem } from "../courier-inbox-list-item";

/**
 * The styling a template author puts on an Elemental action has to survive the trip to the
 * rendered button — a filled button in the template preview cannot come out outlined here.
 */
function renderAction(action: InboxAction, theme?: CourierInboxTheme, mode: 'light' | 'dark' = 'light'): string {
  const themeManager = new CourierInboxThemeManager(mode === 'dark' ? defaultDarkTheme : defaultLightTheme);
  if (theme) {
    themeManager.setLightTheme(theme);
    themeManager.setDarkTheme(theme);
  }
  themeManager.setMode(mode);

  const item = new CourierInboxListItem(themeManager, true, false);
  const message: InboxMessage = { messageId: '1', title: 'title', actions: [action] };
  item.setMessage(message);
  document.body.appendChild(item);

  const button = item.querySelector('courier-button');
  if (!button?.shadowRoot) {
    throw new Error('action button did not render');
  }

  return button.shadowRoot.querySelector('style')?.textContent ?? '';
}

describe('inbox list item action styles', () => {

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
    while (document.body.firstChild) {
      document.body.firstChild.remove();
    }
  });

  it('fills the button with the color the action carries', () => {
    const styles = renderAction({ content: 'Confirm', background_color: '#9D3789' });

    expect(styles).toContain('background-color: #9D3789;');
    // A fill replaces the default outlined look rather than layering on top of it — but still
    // reserves the border box, so it lines up with an outlined sibling.
    expect(styles).toContain('border: 1px solid transparent;');
    expect(styles).toContain('box-shadow: none;');
  });

  it('picks a readable text color for the fill', () => {
    expect(renderAction({ content: 'Confirm', background_color: '#000000' })).toContain('color: #FFFFFF;');
    expect(renderAction({ content: 'Confirm', background_color: '#FFEB00' })).toContain('color: #171717;');
  });

  it('outlines the button when the action asks for the secondary style', () => {
    const styles = renderAction({
      content: 'Maybe later',
      style: 'secondary',
      background_color: '#9D3789',
      border_size: '2px',
      border_radius: '9999px'
    });

    // The outline and the label both come from the action's color, as in email — and crucially
    // it is not used as a fill, which is the whole difference from the filled look.
    expect(styles).toContain('border: 2px solid #9D3789;');
    expect(styles).toContain('color: #9D3789;');
    expect(styles).not.toContain('background-color: #9D3789;');
    expect(styles).toContain('border-radius: 9999px;');
  });

  describe('the tertiary style', () => {

    it('draws a borderless button — the label and nothing else', () => {
      const styles = renderAction({ content: 'Maybe later', style: 'tertiary', background_color: '#9D3789' });

      // Neither a fill nor an outline, so the action's color has only the label left to land on.
      expect(styles).toContain('color: #9D3789;');
      expect(styles).toContain('background-color: transparent;');
      expect(styles).not.toContain('background-color: #9D3789;');
      expect(styles).not.toContain('border: 1px solid #9D3789;');
    });

    it('keeps the border box so it lines up with an outlined sibling', () => {
      const borderless = renderAction({ content: 'Maybe later', style: 'tertiary', background_color: '#9D3789' });
      const outlined = renderAction({ content: 'Maybe later', style: 'secondary', background_color: '#9D3789' });

      expect(borderless).toContain('border: 1px solid transparent;');
      expect(outlined).toContain('border: 1px solid #9D3789;');
      expect(borderless).toContain('padding: 6px 10px;');
      expect(outlined).toContain('padding: 6px 10px;');
    });

    it('is not an outlined button — the two are distinct looks now', () => {
      const borderless = renderAction({ content: 'Maybe later', style: 'tertiary', background_color: '#9D3789' });
      const outlined = renderAction({ content: 'Maybe later', style: 'secondary', background_color: '#9D3789' });

      expect(borderless).not.toEqual(outlined);
    });

    it('gives hover and active a wash, since there is no fill to darken', () => {
      const styles = renderAction({ content: 'Maybe later', style: 'tertiary', background_color: '#9D3789' });
      const hover = styles.slice(styles.indexOf('button:hover'), styles.indexOf('button:disabled'));

      // The brightness fallback other buttons rely on does nothing to a transparent background,
      // so without an explicit wash the button would look inert on hover.
      expect(hover).toContain('background-color: #1717171A;');
      expect(hover).toContain('background-color: #17171733;');
      expect(hover).not.toContain('filter: brightness');
    });

    it('washes in the other direction in dark mode', () => {
      const styles = renderAction(
        { content: 'Maybe later', style: 'tertiary', background_color: '#9D3789' },
        undefined,
        'dark'
      );
      const hover = styles.slice(styles.indexOf('button:hover'), styles.indexOf('button:disabled'));

      expect(hover).toContain('background-color: #FFFFFF1A;');
    });

    it('reads as a button rather than a link — no underline, and it keeps its padding', () => {
      const styles = renderAction({ content: 'Maybe later', style: 'tertiary', background_color: '#9D3789' });

      expect(styles).not.toContain('text-decoration: underline;');
      expect(styles).toContain('padding: 6px 10px;');
    });

    it('takes a borderless theme block over the action styling', () => {
      const themed: CourierInboxTheme = {
        inbox: {
          ...defaultLightTheme.inbox,
          list: {
            ...defaultLightTheme.inbox?.list,
            item: {
              ...defaultLightTheme.inbox?.list?.item,
              actions: {
                tertiary: { font: { color: '#123456' } }
              }
            }
          }
        }
      };
      const styles = renderAction(
        { content: 'Maybe later', style: 'tertiary', background_color: '#9D3789' },
        themed
      );

      expect(styles).toContain('color: #123456;');
    });
  });

  it('reads the legacy nested border older templates still send', () => {
    const styles = renderAction({
      content: 'Maybe later',
      border: { enabled: true, color: '#000000', radius: 4, size: '1px' }
    });

    expect(styles).toContain('border: 1px solid #000000;');
    expect(styles).toContain('border-radius: 4px;');
  });

  it('honors the font size and padding the action asks for', () => {
    const styles = renderAction({ content: 'Confirm', font_size: '16px', padding: '8px 16px' });

    expect(styles).toContain('font-size: 16px;');
    expect(styles).toContain('padding: 8px 16px;');
  });

  it('treats an unrecognized style as a plain filled button', () => {
    // Nothing validates `style` in transit, so an unknown value must not strand the button
    // between looks — it falls back to the fill.
    const styles = renderAction({ content: 'Confirm', style: 'totally-made-up', background_color: '#000000' });

    expect(styles).toContain('background-color: #000000;');
    expect(styles).toContain('color: #FFFFFF;');
  });

  it('matches the style regardless of how the sender cased it', () => {
    const styles = renderAction({ content: 'Maybe later', style: 'SECONDARY', background_color: '#9D3789' });

    expect(styles).toContain('border: 1px solid #9D3789;');
    expect(styles).not.toContain('background-color: #9D3789;');
  });

  it('renders a link-style action as an underlined link, not a button', () => {
    const styles = renderAction({ content: 'Learn more', style: 'link' });

    expect(styles).toContain('text-decoration: underline;');
    expect(styles).toContain('background-color: transparent;');
    expect(styles).toContain('padding: 0px;');
  });

  it('rests at the link color rather than the label color the buttons use', () => {
    expect(renderAction({ content: 'Learn more', style: 'link' })).toContain('color: #2563EB;');
    expect(renderAction({ content: 'Learn more', style: 'link' }, undefined, 'dark')).toContain('color: #60A5FA;');
  });

  it('answers a hover by moving the link color rather than drawing a box behind it', () => {
    const light = renderAction({ content: 'Learn more', style: 'link' });

    // The wash a button uses for feedback would read as a box on text, so the link names its
    // hover fill transparent and moves its color instead.
    expect(light).toContain('color: #1D4ED8;');
    expect(light).not.toContain('background-color: #1717171A;');
    expect(light).not.toContain('background-color: #17171733;');

    const dark = renderAction({ content: 'Learn more', style: 'link' }, undefined, 'dark');

    expect(dark).toContain('color: #93C5FD;');
    expect(dark).not.toContain('background-color: #FFFFFF1A;');
    expect(dark).not.toContain('background-color: #FFFFFF33;');
  });

  it('leaves a press to the brightness fallback, which needs no box either', () => {
    expect(renderAction({ content: 'Learn more', style: 'link' })).toContain('filter: brightness(0.8);');
  });

  it('leaves the buttons their own hover wash', () => {
    // Only the link changed; a borderless button still has nothing but a wash to show with.
    const styles = renderAction({ content: 'Confirm', style: 'tertiary' });

    expect(styles).toContain('background-color: #1717171A;');
  });

  it('falls back to the action when the theme is silent about that value', () => {
    const themeWithFont = (actions: Record<string, unknown>): CourierInboxTheme => ({
      ...defaultLightTheme,
      inbox: {
        ...defaultLightTheme.inbox,
        list: {
          ...defaultLightTheme.inbox?.list,
          item: { ...defaultLightTheme.inbox?.list?.item, actions }
        }
      }
    });

    // The theme names a fill, so an action with nothing of its own wears it.
    const unstyled = renderAction({ content: 'Confirm' }, themeWithFont({ backgroundColor: '#123456', font: { color: '#abcdef' } }));
    expect(unstyled).toContain('background-color: #123456;');
    expect(unstyled).toContain('color: #abcdef;');

    // This theme says nothing about a fill, so the action's own colour comes through and the
    // label is derived from it.
    const styled = renderAction({ content: 'Confirm', background_color: '#9D3789' }, themeWithFont({ borderRadius: '3px' }));
    expect(styled).toContain('background-color: #9D3789;');
    expect(styled).toContain('color: #FFFFFF;');
    expect(styled).toContain('border-radius: 3px;');
  });

  it('themes the outlined look separately from the filled one', () => {
    const themed: CourierInboxTheme = {
      ...defaultLightTheme,
      inbox: {
        ...defaultLightTheme.inbox,
        list: {
          ...defaultLightTheme.inbox?.list,
          item: {
            ...defaultLightTheme.inbox?.list?.item,
            actions: {
              backgroundColor: '#123456',
              borderRadius: '2px',
              secondary: { borderRadius: '16px', shadow: 'none' }
            }
          }
        }
      }
    };

    // The filled action takes the base block...
    expect(renderAction({ content: 'Confirm' }, themed)).toContain('border-radius: 2px;');
    // ...and the outlined one takes the override layered on top of it.
    const outlined = renderAction({ content: 'Maybe later', style: 'secondary', background_color: '#9D3789' }, themed);
    expect(outlined).toContain('border-radius: 16px;');
    expect(outlined).toContain('border: 1px solid #9D3789;');
  });

  it('themes the link look separately, without inheriting the button fill', () => {
    const themed: CourierInboxTheme = {
      ...defaultLightTheme,
      inbox: {
        ...defaultLightTheme.inbox,
        list: {
          ...defaultLightTheme.inbox?.list,
          item: {
            ...defaultLightTheme.inbox?.list?.item,
            actions: {
              backgroundColor: '#123456',
              link: { font: { color: '#FF0000' }, textDecoration: 'none' }
            }
          }
        }
      }
    };

    const styles = renderAction({ content: 'Learn more', style: 'link' }, themed);

    expect(styles).toContain('color: #FF0000;');
    expect(styles).toContain('text-decoration: none;');
    // The button's fill must not leak onto a link.
    expect(styles).not.toContain('background-color: #123456;');
  });

  // A themable property that never reaches the button is worse than no property at all: it
  // reads as supported and silently does nothing. Every field on the variant type is asserted.
  it.each([
    ['button', { content: 'A', style: 'button', background_color: '#9D3789' } as InboxAction],
    ['secondary', { content: 'A', style: 'secondary', background_color: '#9D3789' } as InboxAction],
    ['tertiary', { content: 'A', style: 'tertiary', background_color: '#9D3789' } as InboxAction],
    ['link', { content: 'A', style: 'link' } as InboxAction],
  ])('honors every %s theme property', (block, action) => {
    const variant = {
      backgroundColor: '#010203',
      hoverBackgroundColor: '#040506',
      activeBackgroundColor: '#070809',
      border: '3px solid #0A0B0C',
      borderRadius: '11px',
      shadow: '0 0 9px #0D0E0F',
      textDecoration: 'overline',
      padding: '13px 17px',
      font: { family: 'Courier', size: '19px', weight: '800', color: '#101112' }
    };
    const themed: CourierInboxTheme = {
      ...defaultLightTheme,
      inbox: {
        ...defaultLightTheme.inbox,
        list: {
          ...defaultLightTheme.inbox?.list,
          item: {
            ...defaultLightTheme.inbox?.list?.item,
            actions: { [block]: variant }
          }
        }
      }
    };

    const styles = renderAction(action, themed);
    const rule = (selector: string) => new RegExp(`${selector} \\{([^}]*)\\}`).exec(styles)?.[1] ?? '';

    expect(styles).toContain('background-color: #010203;');
    expect(styles).toContain('border: 3px solid #0A0B0C;');
    expect(styles).toContain('border-radius: 11px;');
    expect(styles).toContain('box-shadow: 0 0 9px #0D0E0F;');
    expect(styles).toContain('text-decoration: overline;');
    expect(styles).toContain('padding: 13px 17px;');
    expect(styles).toContain('color: #101112;');
    expect(styles).toContain('font-family: Courier;');
    expect(styles).toContain('font-size: 19px;');
    expect(styles).toContain('font-weight: 800;');
    // Landing in the wrong rule is the same defect as not landing at all.
    expect(rule('button:hover')).toContain('background-color: #040506;');
    expect(rule('button:active')).toContain('background-color: #070809;');
  });

  it('lets a theme value override what the action asks for', () => {
    const themed: CourierInboxTheme = {
      ...defaultLightTheme,
      inbox: {
        ...defaultLightTheme.inbox,
        list: {
          ...defaultLightTheme.inbox?.list,
          item: {
            ...defaultLightTheme.inbox?.list?.item,
            actions: {
              backgroundColor: '#123456',
              font: { color: '#ABCDEF' },
              secondary: { border: '2px solid #00FF00' }
            }
          }
        }
      }
    };

    // Set on the theme, so it wins over the fill the action asks for.
    const filled = renderAction({ content: 'Confirm', background_color: '#9D3789' }, themed);
    expect(filled).toContain('background-color: #123456;');
    expect(filled).toContain('color: #ABCDEF;');
    expect(filled).not.toContain('#9D3789');

    // Not set on the theme, so the action still decides the radius.
    expect(renderAction({ content: 'Confirm', border_radius: '9999px' }, themed)).toContain('border-radius: 9999px;');

    // `style` picks the block, and the outlined block's border outranks the action's colour.
    const outlined = renderAction({ content: 'Later', style: 'secondary', background_color: '#9D3789' }, themed);
    expect(outlined).toContain('border: 2px solid #00FF00;');
  });

  it.each([
    ['unstyled', {}],
    ['filled', { background_color: '#9D3789' }],
    ['outlined', { background_color: '#9D3789', style: 'secondary' }],
    ['link', { style: 'link' }],
  ])('gives a %s action hover and active feedback', (_name, action) => {
    const styles = renderAction({ content: 'Confirm', ...action } as InboxAction);

    const hover = /button:hover \{([^}]*)\}/.exec(styles)?.[1] ?? '';
    const active = /button:active \{([^}]*)\}/.exec(styles)?.[1] ?? '';

    expect(hover.trim()).not.toBe('');
    expect(active.trim()).not.toBe('');
    expect(hover).not.toBe(active);
  });

  describe('dark mode', () => {

    // The shipped defaults intentionally say nothing about actions — CourierButton owns them —
    // so the dark defaults have to come from its variants, not from the theme.
    it('uses the button variant defaults for the mode', () => {
      const light = renderAction({ content: 'Confirm' }, undefined, 'light');
      const dark = renderAction({ content: 'Confirm' }, undefined, 'dark');

      // A styleless action is the plain button, the `secondary` variant: the mode's own surface
      // rather than its ink. This is the look already in the wild, and adding a style for
      // someone else is not a reason to restyle it.
      expect(light).toContain('background-color: #FFFFFF;');
      expect(dark).toContain('background-color: #171717;');
      expect(light).not.toBe(dark);
    });

    // The outline used to be `colors.border`, the hairline rows are separated with, which is
    // ~1.3:1 against the face this button is filled with in either mode — an outlined action was
    // indistinguishable from a borderless one. The replacements are per-mode because one value
    // cannot read the same on both: 600 is a quiet 4.7:1 on white but a loud 3.8:1 on black,
    // so dark steps down to 650.
    it('outlines a secondary action visibly, pitched to the mode', () => {
      expect(renderAction({ content: 'Later', style: 'secondary' }, undefined, 'light'))
        .toContain('border: 1px solid #737373;');
      expect(renderAction({ content: 'Later', style: 'secondary' }, undefined, 'dark'))
        .toContain('border: 1px solid #585858;');
    });

    it('still fills and labels a secondary action against the mode', () => {
      const light = renderAction({ content: 'Later', style: 'secondary' }, undefined, 'light');
      const dark = renderAction({ content: 'Later', style: 'secondary' }, undefined, 'dark');

      expect(light).toContain('background-color: #FFFFFF;');
      expect(light).toContain('color: #171717;');
      expect(dark).toContain('background-color: #171717;');
      expect(dark).toContain('color: #FFFFFF;');
    });

    it('applies an integrator dark theme, variant blocks included', () => {
      const themed: CourierInboxTheme = {
        ...defaultDarkTheme,
        inbox: {
          ...defaultDarkTheme.inbox,
          list: {
            ...defaultDarkTheme.inbox?.list,
            item: {
              ...defaultDarkTheme.inbox?.list?.item,
              actions: {
                backgroundColor: '#111111',
                secondary: { border: '2px solid #00FF00' },
                link: { font: { color: '#00FFFF' } }
              }
            }
          }
        }
      };

      expect(renderAction({ content: 'a' }, themed, 'dark')).toContain('background-color: #111111;');
      expect(renderAction({ content: 'a', style: 'secondary', background_color: '#9D3789' }, themed, 'dark'))
        .toContain('border: 2px solid #00FF00;');
      expect(renderAction({ content: 'a', style: 'link' }, themed, 'dark')).toContain('color: #00FFFF;');
    });

    it('keeps hover and active feedback in dark mode', () => {
      // Opaque grays rather than a translucent wash: an action can sit on a floating surface
      // where page content would otherwise show through.
      const styles = renderAction({ content: 'Confirm' }, undefined, 'dark');

      expect(styles).toContain('background-color: #2E2E2E;');
      expect(styles).toContain('background-color: #454545;');
    });

  });

  it('leaves an action with no styling on the plain button default', () => {
    // The default theme deliberately says nothing about actions, so CourierButton's own look
    // applies rather than a theme value that would outrank the template. An action naming no
    // style is the plain button, the `secondary` variant: the mode's surface, the divider
    // hairline for an edge, and the shadow that lifts it off the row.
    const styles = renderAction({ content: 'Confirm' });

    expect(styles).toContain('background-color: #FFFFFF;');
    expect(styles).toContain('border: 1px solid #E5E5E5;');
    expect(styles).toContain('box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.06);');
  });
});
