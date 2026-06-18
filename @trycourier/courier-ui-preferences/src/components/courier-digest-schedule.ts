import { CourierBaseElement, registerElement, injectGlobalStyle, CourierRadio } from "@trycourier/courier-ui-core";
import { CourierDigestScheduleOption } from "@trycourier/courier-js";
import { CourierPreferencesTheme } from "../types/courier-preferences-theme";
import { CourierPreferencesThemeManager, CourierPreferencesThemeSubscription } from "../types/courier-preferences-theme-manager";
import { DigestSchedule } from "../types/preferences";
import { formatDigest } from "../utils/format-digest";

const STYLE_ID = 'courier-digest-schedule';

const STYLES = `
  courier-digest-schedule .courier-digest-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 20px;
    padding: 0 24px;
  }
  courier-digest-schedule .courier-digest-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.2;
  }
  courier-digest-schedule .courier-digest-option {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    border: none;
    background: transparent;
    padding: 0;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    line-height: 1.2;
    transition: opacity 150ms ease;
    align-self: flex-start;
  }
  courier-digest-schedule .courier-digest-option:hover {
    opacity: 0.8;
  }
  courier-digest-schedule .courier-digest-option-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  courier-digest-schedule .courier-digest-calendar {
    display: inline-flex;
    flex-shrink: 0;
    line-height: 0;
  }
`;

const CALENDAR_SVG = `<svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.75 0.75V2H9.25V0.75C9.25 0.34375 9.5625 0 10 0C10.4062 0 10.75 0.34375 10.75 0.75V2H12C13.0938 2 14 2.90625 14 4V4.5V6V14C14 15.125 13.0938 16 12 16H2C0.875 16 0 15.125 0 14V6V4.5V4C0 2.90625 0.875 2 2 2H3.25V0.75C3.25 0.34375 3.5625 0 4 0C4.40625 0 4.75 0.34375 4.75 0.75ZM1.5 6V14C1.5 14.2812 1.71875 14.5 2 14.5H12C12.25 14.5 12.5 14.2812 12.5 14V6H1.5Z" fill="currentColor"/></svg>`;

interface OptionEntry {
  scheduleId: string;
  button: HTMLButtonElement;
  radio: CourierRadio;
}

/** @public */
export class CourierDigestSchedule extends CourierBaseElement {
  static get id(): string {
    return 'courier-digest-schedule';
  }

  private _schedules: CourierDigestScheduleOption[] = [];
  private _selectedScheduleId?: string;
  private _themeManager?: CourierPreferencesThemeManager;
  private _themeSubscription?: CourierPreferencesThemeSubscription;
  private _onScheduleChange?: (scheduleId: string) => void;

  private _container?: HTMLDivElement;
  private _options: OptionEntry[] = [];
  private _mounted = false;

  set schedules(val: CourierDigestScheduleOption[]) {
    const sameOptions = this._sameSchedules(val);
    this._schedules = val;
    if (!this._mounted) return;
    if (sameOptions) {
      this._applyTheme();
      this._applySelection();
    } else {
      this._build();
    }
  }

  set selectedScheduleId(val: string | undefined) {
    this._selectedScheduleId = val;
    if (this._mounted) this._applySelection();
  }

  set themeManager(val: CourierPreferencesThemeManager) {
    this._themeManager = val;
    if (this._mounted) this._setupThemeSubscription();
  }

  set primaryColor(_val: string) {
    // Reserved for future use
  }

  set onScheduleChange(fn: (scheduleId: string) => void) {
    this._onScheduleChange = fn;
  }

  protected onComponentMounted(): void {
    injectGlobalStyle(STYLE_ID, STYLES);
    this._mounted = true;
    this._setupThemeSubscription();
    this._build();
  }

  protected onComponentUnmounted(): void {
    this._mounted = false;
    this._themeSubscription?.unsubscribe();
    this._themeSubscription = undefined;
    this._container = undefined;
    this._options = [];
  }

  private _setupThemeSubscription() {
    if (!this._themeManager) return;
    this._themeSubscription?.unsubscribe();
    this._themeSubscription = this._themeManager.subscribe(() => this._refreshTheme());
  }

  private _refreshTheme() {
    if (!this._container) return;
    this._applyTheme();
    this._applySelection();
  }

  private _theme(): CourierPreferencesTheme {
    return this._themeManager?.getTheme() ?? {};
  }

  private _sameSchedules(next: CourierDigestScheduleOption[]): boolean {
    if (next.length !== this._options.length) return false;
    for (let i = 0; i < next.length; i++) {
      if (next[i].scheduleId !== this._options[i].scheduleId) return false;
    }
    return true;
  }

  private _resolvedSelectedId(): string | undefined {
    if (this._selectedScheduleId) return this._selectedScheduleId;
    const def = this._schedules.find(s => s.default === true);
    return def?.scheduleId;
  }

  private _build() {
    if (!this.isConnected) return;
    this.innerHTML = '';
    this._options = [];

    if (this._schedules.length === 0) {
      this._container = undefined;
      return;
    }

    const container = document.createElement('div');
    container.className = 'courier-digest-container';

    if (this._schedules.length === 1) {
      container.appendChild(this._buildSingleLabel(this._schedules[0]));
    } else {
      for (const schedule of this._schedules) {
        container.appendChild(this._buildOptionRow(schedule));
      }
    }

    this.appendChild(container);
    this._container = container;

    this._applyTheme();
    this._applySelection();
  }

  private _buildSingleLabel(schedule: CourierDigestScheduleOption): HTMLElement {
    const label = document.createElement('div');
    label.className = 'courier-digest-label';

    const text = document.createElement('span');
    text.textContent = formatDigest(schedule as unknown as DigestSchedule);
    label.appendChild(text);

    const icon = document.createElement('span');
    icon.className = 'courier-digest-calendar';
    icon.innerHTML = CALENDAR_SVG;
    label.appendChild(icon);

    return label;
  }

  private _buildOptionRow(schedule: CourierDigestScheduleOption): HTMLElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'courier-digest-option';
    btn.setAttribute('role', 'radio');

    const radio = document.createElement('courier-radio') as CourierRadio;
    btn.appendChild(radio);

    const labelWrap = document.createElement('span');
    labelWrap.className = 'courier-digest-option-label';

    const text = document.createElement('span');
    text.textContent = formatDigest(schedule as unknown as DigestSchedule);
    labelWrap.appendChild(text);

    const icon = document.createElement('span');
    icon.className = 'courier-digest-calendar';
    icon.innerHTML = CALENDAR_SVG;
    labelWrap.appendChild(icon);

    btn.appendChild(labelWrap);

    btn.addEventListener('click', () => {
      if (this._selectedScheduleId === schedule.scheduleId) return;
      this._selectedScheduleId = schedule.scheduleId;
      this._applySelection();
      this._onScheduleChange?.(schedule.scheduleId);
    });

    this._options.push({ scheduleId: schedule.scheduleId, button: btn, radio });
    return btn;
  }

  private _resolvedFonts() {
    const digest = this._theme().digest;
    const radio = digest?.radio;
    const digestFont = digest?.font;
    const digestSelectedFont = digest?.selectedFont;
    return {
      unselectedFamily: radio?.font?.family ?? digestFont?.family,
      selectedFamily: radio?.selectedFont?.family ?? digestSelectedFont?.family ?? radio?.font?.family ?? digestFont?.family,
      unselectedColor: radio?.font?.color ?? digestFont?.color ?? '#525252',
      selectedColor: radio?.selectedFont?.color ?? digestSelectedFont?.color ?? '#171717',
      unselectedSize: radio?.font?.size ?? digestFont?.size ?? '14px',
      selectedSize: radio?.selectedFont?.size ?? digestSelectedFont?.size ?? radio?.font?.size ?? digestFont?.size ?? '14px',
      unselectedWeight: radio?.font?.weight ?? digestFont?.weight ?? '400',
      selectedWeight: radio?.selectedFont?.weight ?? digestSelectedFont?.weight ?? '500',
    };
  }

  private _applyTheme() {
    if (!this._container) return;
    const digest = this._theme().digest;
    const digestFont = digest?.font;
    const selectedFont = digest?.selectedFont;

    if (digestFont?.family) {
      this._container.style.fontFamily = digestFont.family;
    } else {
      this._container.style.removeProperty('font-family');
    }

    const ringColor = digest?.radio?.ringColor || '#D4D4D4';
    const checkedColor = digest?.radio?.checkedColor || selectedFont?.color || '#171717';
    const calendarColor = digest?.iconColor || '#A3A3A3';

    // Single-schedule label shares the unselected font.
    const labelEl = this._container.querySelector<HTMLElement>('.courier-digest-label');
    if (labelEl) {
      labelEl.style.color = digestFont?.color || '#525252';
      labelEl.style.fontSize = digestFont?.size || '14px';
      labelEl.style.fontWeight = digestFont?.weight || '400';
    }

    for (const opt of this._options) {
      opt.radio.ringColor = ringColor;
      opt.radio.checkedColor = checkedColor;
    }

    this._container.querySelectorAll<HTMLElement>('.courier-digest-calendar').forEach(el => {
      el.style.color = calendarColor;
    });

    this._applySelection();
  }

  private _applySelection() {
    if (this._options.length === 0) return;
    const fonts = this._resolvedFonts();
    const selectedId = this._resolvedSelectedId();

    for (const opt of this._options) {
      const isSelected = opt.scheduleId === selectedId;
      opt.radio.checked = isSelected;
      opt.button.setAttribute('aria-checked', String(isSelected));
      opt.button.style.color = isSelected ? fonts.selectedColor : fonts.unselectedColor;
      opt.button.style.fontSize = isSelected ? fonts.selectedSize : fonts.unselectedSize;
      opt.button.style.fontWeight = isSelected ? fonts.selectedWeight : fonts.unselectedWeight;
      const family = isSelected ? fonts.selectedFamily : fonts.unselectedFamily;
      if (family) {
        opt.button.style.fontFamily = family;
      } else {
        opt.button.style.removeProperty('font-family');
      }
    }
  }
}

registerElement(CourierDigestSchedule);
