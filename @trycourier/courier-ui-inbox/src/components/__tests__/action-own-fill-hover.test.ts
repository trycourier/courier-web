import { InboxAction } from "@trycourier/courier-js";
import { defaultDarkTheme, defaultLightTheme } from "../../types/courier-inbox-theme";
import { CourierInboxThemeManager } from "../../types/courier-inbox-theme-manager";
import { CourierInboxListItem } from "../courier-inbox-list-item";

/**
 * An action that carries its own color has no variant hover to fall back on, and dimming is not
 * feedback when the fill is already near-black — the case every designer-authored action hits in
 * dark mode, since the color is baked into the template at whatever the author picked.
 */
function hoverRule(action: InboxAction, mode: 'light' | 'dark'): string {
  const themeManager = new CourierInboxThemeManager(mode === 'dark' ? defaultDarkTheme : defaultLightTheme);
  themeManager.setMode(mode);

  const item = new CourierInboxListItem(themeManager, true, false);
  item.setMessage({ messageId: '1', title: 'A title', actions: [action] });
  document.body.appendChild(item);

  const styles = item.querySelector('courier-button')?.shadowRoot?.querySelector('style')?.textContent ?? '';
  return /button:hover \{([^}]*)\}/.exec(styles)?.[1].replace(/\s+/g, ' ').trim() ?? '';
}

describe('an action that brings its own fill', () => {

  beforeAll(() => {
    if (!window.matchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: false, media: query, onchange: null,
          addEventListener: () => { }, removeEventListener: () => { },
          addListener: () => { }, removeListener: () => { }, dispatchEvent: () => false
        })
      });
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('lightens a dark fill on hover rather than dimming it into the background', () => {
    // A near-black fill on a near-black surface: brightness(0.9) left the button inert. Light
    // mode, because in dark the plain button is already filled #171717 and there would be a
    // matching variant hover to use instead of deriving one.
    const hover = hoverRule({ content: 'Confirm', background_color: '#171717' }, 'light');

    expect(hover).toBe('background-color: #333333;');
    expect(hover).not.toContain('brightness');
  });

  it('darkens a light fill on hover', () => {
    const hover = hoverRule({ content: 'Confirm', background_color: '#FFFFFF' }, 'dark');

    expect(hover).toBe('background-color: #E0E0E0;');
  });

  it('leaves a fill that matches the variant on the variant hover', () => {
    // In dark mode the template's color happens to be the plain button's own face, so there is
    // a matching hover to use and nothing has to be derived.
    expect(hoverRule({ content: 'Confirm', background_color: '#171717' }, 'dark'))
      .toBe('background-color: #2E2E2E;');
  });

  it('falls back to dimming when the fill is not a color it can read', () => {
    expect(hoverRule({ content: 'Confirm', background_color: 'var(--brand)' }, 'dark'))
      .toBe('filter: brightness(0.9);');
  });

});
