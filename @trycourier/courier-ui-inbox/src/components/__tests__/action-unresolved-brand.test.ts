import { InboxAction, InboxMessage } from "@trycourier/courier-js";
import { defaultDarkTheme, defaultLightTheme } from "../../types/courier-inbox-theme";
import { CourierInboxThemeManager } from "../../types/courier-inbox-theme-manager";
import { CourierInboxListItem } from "../courier-inbox-list-item";

/**
 * The send pipeline fills `background_color` with `{brand.colors.primary}` whenever a template
 * names no color of its own, and that token becomes a color only if a brand is configured and
 * resolves. When it does not, the literal string arrives at the kit.
 *
 * It is neither empty nor a color, so it used to read as an accent the author had picked:
 * `secondary` built `1px solid {brand.colors.primary}`, the browser dropped it as invalid, and
 * an outlined action rendered with no outline and no label color at all.
 */
function render(action: InboxAction, mode: 'light' | 'dark' = 'dark'): string {
  const themeManager = new CourierInboxThemeManager(mode === 'dark' ? defaultDarkTheme : defaultLightTheme);
  themeManager.setMode(mode);
  const item = new CourierInboxListItem(themeManager, true, false);
  item.setMessage({ messageId: '1', title: 't', actions: [action] } as InboxMessage);
  document.body.appendChild(item);
  const styles = item.querySelector('courier-button')?.shadowRoot?.querySelector('style')?.textContent;
  if (!styles) throw new Error('action button did not render');
  return styles;
}

describe('an action whose brand token never resolved', () => {

  beforeAll(() => {
    if (!window.matchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: false, media: query, onchange: null,
          addEventListener: () => {}, removeEventListener: () => {},
          addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false
        })
      });
    }
  });

  afterEach(() => { document.body.innerHTML = ''; });

  const TOKEN = '{brand.colors.primary}';

  it('outlines a secondary action with the kit edge, not the token', () => {
    const styles = render({ content: 'Enter text', style: 'secondary', background_color: TOKEN });
    expect(styles).toContain('border: 1px solid #585858;');
    expect(styles).not.toContain(TOKEN);
  });

  it('labels it so it can be read', () => {
    expect(render({ content: 'Enter text', style: 'secondary', background_color: TOKEN }))
      .toContain('color: #FFFFFF;');
  });

  it('renders the same as an action that carried no color at all', () => {
    const withToken = render({ content: 'Enter text', style: 'secondary', background_color: TOKEN });
    const without = render({ content: 'Enter text', style: 'secondary' });
    expect(withToken).toEqual(without);
  });

  it.each(['button', 'secondary', 'tertiary', 'link'])('never emits the raw token for %s', (style) => {
    expect(render({ content: 'Go', style, background_color: TOKEN })).not.toContain('brand.colors');
  });

  // A handlebars variable that outlived interpolation is the same problem.
  it('ignores an unresolved handlebars value too', () => {
    expect(render({ content: 'Go', style: 'secondary', background_color: '{{brand_color}}' }))
      .toContain('border: 1px solid #585858;');
  });

  // A real color still wins — this guard must not swallow what an author chose.
  it('still honors a color the template actually named', () => {
    expect(render({ content: 'Go', style: 'secondary', background_color: '#9D3789' }))
      .toContain('border: 1px solid #9D3789;');
  });
});
