import { CourierBaseElement, registerElement, injectGlobalStyle } from "@trycourier/courier-ui-core";
import { CourierPreferencesTheme, DEFAULT_PREFERENCES_PRIMARY_COLOR } from "../types/courier-preferences-theme";
import { CourierPreferencesThemeManager, CourierPreferencesThemeSubscription } from "../types/courier-preferences-theme-manager";

const STYLE_ID = 'courier-preference-toggle';

const STYLES = `
  courier-preference-toggle {
    display: inline-flex;
    line-height: 0;
  }
  .courier-pref-toggle {
    position: relative;
    display: inline-flex;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
    padding: 0;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background-color 200ms ease;
    outline: none;
  }
  .courier-pref-toggle[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .courier-pref-toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #FFFFFF;
    transition: transform 200ms ease;
    pointer-events: none;
  }
  .courier-pref-toggle[aria-checked="true"] .courier-pref-toggle-thumb {
    transform: translateX(20px);
  }
`;

/** @public */
export class CourierPreferenceToggle extends CourierBaseElement {
  static get id(): string {
    return 'courier-preference-toggle';
  }

  private _checked = false;
  private _disabled = false;
  private _themeManager?: CourierPreferencesThemeManager;
  private _themeSubscription?: CourierPreferencesThemeSubscription;
  private _primaryColor = DEFAULT_PREFERENCES_PRIMARY_COLOR;
  private _onChange?: (checked: boolean) => void;

  private _buttonEl?: HTMLButtonElement;
  private _thumbEl?: HTMLSpanElement;
  private _mounted = false;

  set checked(val: boolean) {
    this._checked = val;
    if (this._mounted) {
      this._update();
    }
  }

  get checked(): boolean {
    return this._checked;
  }

  set disabled(val: boolean) {
    this._disabled = val;
    if (this._mounted) {
      this._update();
    }
  }

  set themeManager(val: CourierPreferencesThemeManager) {
    this._themeManager = val;
    if (this._mounted) this._setupThemeSubscription();
  }

  set primaryColor(val: string) {
    this._primaryColor = val;
    if (this._mounted) {
      this._update();
    }
  }

  set onChange(fn: (checked: boolean) => void) {
    this._onChange = fn;
  }

  protected onComponentMounted(): void {
    injectGlobalStyle(STYLE_ID, STYLES);
    this._buildDom();
    this._mounted = true;
    this._setupThemeSubscription();
  }

  protected onComponentUnmounted(): void {
    this._mounted = false;
    this._themeSubscription?.unsubscribe();
    this._themeSubscription = undefined;
    this._buttonEl = undefined;
    this._thumbEl = undefined;
  }

  private _setupThemeSubscription() {
    if (!this._themeManager) return;
    this._themeSubscription?.unsubscribe();
    this._themeSubscription = this._themeManager.subscribe(() => this._update());
    this._update();
  }

  private _theme(): CourierPreferencesTheme {
    return this._themeManager?.getTheme() ?? {};
  }

  private _getTrackColor(): string {
    const themeToggle = this._theme().topic?.toggle;
    if (this._checked) {
      return themeToggle?.trackActiveColor || this._primaryColor;
    }
    return themeToggle?.trackColor || '#D4D4D4';
  }

  private _buildDom() {
    this.innerHTML = '';

    const button = document.createElement('button');
    button.type = 'button';
    button.role = 'switch';
    button.className = 'courier-pref-toggle';
    button.addEventListener('click', () => {
      if (this._disabled) return;
      this._checked = !this._checked;
      this._update();
      this._onChange?.(this._checked);
    });

    const thumb = document.createElement('span');
    thumb.className = 'courier-pref-toggle-thumb';

    button.appendChild(thumb);
    this.appendChild(button);

    this._buttonEl = button;
    this._thumbEl = thumb;

    this._update();
  }

  private _update() {
    const btn = this._buttonEl;
    if (!btn) return;

    btn.setAttribute('aria-checked', String(this._checked));
    btn.setAttribute('aria-disabled', String(this._disabled));
    btn.style.backgroundColor = this._getTrackColor();

    const toggle = this._theme().topic?.toggle;
    btn.style.borderRadius = toggle?.borderRadius || '12px';

    const thumbColor = toggle?.thumbColor || '#FFFFFF';
    if (this._thumbEl) {
      this._thumbEl.style.backgroundColor = thumbColor;
    }
  }
}

registerElement(CourierPreferenceToggle);
