import { CourierBaseElement, registerElement, injectGlobalStyle, CourierCheckbox } from "@trycourier/courier-ui-core";
import { CourierUserPreferencesChannel } from "@trycourier/courier-js";
import { CourierPreferencesTheme } from "../types/courier-preferences-theme";
import { CourierPreferencesThemeManager, CourierPreferencesThemeSubscription } from "../types/courier-preferences-theme-manager";

const STYLE_ID = 'courier-channel-routing';

// Bottom padding added below the "Customize channels" row while collapsed, so
// the card doesn't end flush against the arrow row (the chip list supplies this
// breathing room when expanded).
const COLLAPSED_ROW_PADDING_BOTTOM = '12px';

const DEFAULT_CHANNEL_LABELS: Record<string, string> = {
  direct_message: 'Chat',
  email: 'Email',
  push: 'Push',
  sms: 'SMS',
  webhook: 'Webhook',
  inbox: 'Inbox',
};

// Right-pointing chevron; rotated 90deg (via CSS) when the section is expanded.
const CHEVRON_SVG = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M4.5 2.5 8 6l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const STYLES = `
  courier-channel-routing .courier-channel-routing-wrapper {
    margin-top: 20px;
  }
  courier-channel-routing .courier-channel-routing-divider {
    border: none;
    border-top: 1px solid #E5E5E5;
    margin: 0 24px;
  }
  courier-channel-routing .courier-channel-customize {
    margin-top: 8px;
    padding: 0 12px;
  }
  courier-channel-routing .courier-channel-customize-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border: none;
    border-radius: 9999px;
    background: transparent;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    font-family: inherit;
    color: inherit;
    line-height: 1;
    white-space: nowrap;
    transition: opacity 150ms ease, background-color 150ms ease;
  }
  courier-channel-routing .courier-channel-customize-button:hover {
    opacity: 0.8;
  }
  courier-channel-routing .courier-channel-customize-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    line-height: 0;
  }
  courier-channel-routing .courier-channel-customize-button[aria-expanded="true"] .courier-channel-customize-arrow {
    transform: rotate(90deg);
  }
  courier-channel-routing .courier-channel-routing {
    display: flex;
    flex-wrap: wrap;
    margin-top: 0;
    padding: 0 12px 8px;
  }
  courier-channel-routing .courier-channel-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border: none;
    border-radius: 9999px;
    background: transparent;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    font-family: inherit;
    color: inherit;
    line-height: 1;
    white-space: nowrap;
    transition: opacity 150ms ease, background-color 150ms ease;
  }
  courier-channel-routing .courier-channel-chip:hover {
    opacity: 0.8;
  }
`;

interface ChipEntry {
  channel: CourierUserPreferencesChannel;
  button: HTMLButtonElement;
  checkbox: CourierCheckbox;
}

/** @public */
export class CourierChannelRouting extends CourierBaseElement {
  static get id(): string {
    return 'courier-channel-routing';
  }

  private _routingOptions: CourierUserPreferencesChannel[] = [];
  private _selectedChannels: CourierUserPreferencesChannel[] = [];
  private _channelLabels: Record<string, string> = {};
  private _isRequired = false;
  private _customizeEnabled = false;
  private _customizeLabel = 'Customize channels';
  // Label when expanded/active. Defaults to the collapsed `customizeLabel`
  // (i.e. the text doesn't change on expand unless explicitly overridden).
  private _customizeActiveLabel?: string;
  private _themeManager?: CourierPreferencesThemeManager;
  private _themeSubscription?: CourierPreferencesThemeSubscription;
  private _onRoutingChange?: (channels: CourierUserPreferencesChannel[]) => void;
  private _onCustomizeChange?: (enabled: boolean) => void;

  private _wrapperEl?: HTMLDivElement;
  private _dividerEl?: HTMLHRElement;
  private _customizeRowEl?: HTMLDivElement;
  private _customizeButtonEl?: HTMLButtonElement;
  private _customizeLabelEl?: HTMLSpanElement;
  private _containerEl?: HTMLDivElement;
  private _chips: ChipEntry[] = [];
  private _mounted = false;

  set routingOptions(val: CourierUserPreferencesChannel[]) {
    const same = val.length === this._chips.length &&
      val.every((c, i) => this._chips[i].channel === c);
    this._routingOptions = val;
    if (!this._mounted) return;
    if (same) {
      this._applyTheme();
      this._applySelection();
    } else {
      this._build();
    }
  }

  set selectedChannels(val: CourierUserPreferencesChannel[]) {
    this._selectedChannels = val;
    if (this._mounted) this._applySelection();
  }

  set channelLabels(val: Record<string, string>) {
    this._channelLabels = val;
    if (this._mounted) this._refreshLabels();
  }

  set isRequired(val: boolean) {
    this._isRequired = val;
  }

  /**
   * Whether the user has expanded the section to enable per-channel
   * customization. Expanded === custom routing enabled; collapsed reveals no
   * chips and falls back to the topic's default routing.
   */
  set customizeEnabled(val: boolean) {
    this._customizeEnabled = val;
    if (this._mounted) this._applyCustomizeState();
  }

  set customizeLabel(val: string) {
    this._customizeLabel = val;
    if (this._mounted) this._applyCustomizeState();
  }

  /** Optional label for the expanded/active state; defaults to `customizeLabel`. */
  set customizeActiveLabel(val: string) {
    this._customizeActiveLabel = val;
    if (this._mounted) this._applyCustomizeState();
  }

  set themeManager(val: CourierPreferencesThemeManager) {
    this._themeManager = val;
    if (this._mounted) this._setupThemeSubscription();
  }

  set primaryColor(_val: string) {
    // Reserved for future use
  }

  set onRoutingChange(fn: (channels: CourierUserPreferencesChannel[]) => void) {
    this._onRoutingChange = fn;
  }

  set onCustomizeChange(fn: (enabled: boolean) => void) {
    this._onCustomizeChange = fn;
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
    this._wrapperEl = undefined;
    this._dividerEl = undefined;
    this._customizeRowEl = undefined;
    this._customizeButtonEl = undefined;
    this._customizeLabelEl = undefined;
    this._containerEl = undefined;
    this._chips = [];
  }

  private _setupThemeSubscription() {
    if (!this._themeManager) return;
    this._themeSubscription?.unsubscribe();
    this._themeSubscription = this._themeManager.subscribe(() => this._refreshTheme());
  }

  private _refreshTheme() {
    if (!this._wrapperEl) return;
    this._applyTheme();
    this._applySelection();
  }

  private _theme(): CourierPreferencesTheme {
    return this._themeManager?.getTheme() ?? {};
  }

  private _getLabel(channel: CourierUserPreferencesChannel): string {
    return this._channelLabels[channel] || DEFAULT_CHANNEL_LABELS[channel] || channel.charAt(0).toUpperCase() + channel.slice(1);
  }

  private _build() {
    if (!this.isConnected) return;
    this.innerHTML = '';
    this._chips = [];

    if (this._routingOptions.length === 0) {
      this._wrapperEl = undefined;
      this._customizeRowEl = undefined;
      this._customizeButtonEl = undefined;
      this._customizeLabelEl = undefined;
      this._containerEl = undefined;
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'courier-channel-routing-wrapper';

    const divider = document.createElement('hr');
    divider.className = 'courier-channel-routing-divider';
    this._dividerEl = divider;
    wrapper.appendChild(divider);

    wrapper.appendChild(this._buildCustomizeRow());

    const container = document.createElement('div');
    container.className = 'courier-channel-routing';

    for (const channel of this._routingOptions) {
      container.appendChild(this._buildChip(channel));
    }

    wrapper.appendChild(container);
    this._containerEl = container;
    this.appendChild(wrapper);
    this._wrapperEl = wrapper;

    this._applyTheme();
    this._applySelection();
    this._applyCustomizeState();
  }

  private _buildCustomizeRow(): HTMLElement {
    const row = document.createElement('div');
    row.className = 'courier-channel-customize';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'courier-channel-customize-button';

    const arrow = document.createElement('span');
    arrow.className = 'courier-channel-customize-arrow';
    arrow.innerHTML = CHEVRON_SVG;
    btn.appendChild(arrow);

    const label = document.createElement('span');
    label.className = 'courier-channel-customize-label';
    label.textContent = this._customizeLabel;
    btn.appendChild(label);

    btn.addEventListener('click', () => {
      this._customizeEnabled = !this._customizeEnabled;
      this._applyCustomizeState();
      this._onCustomizeChange?.(this._customizeEnabled);
    });

    row.appendChild(btn);
    this._customizeRowEl = row;
    this._customizeButtonEl = btn;
    this._customizeLabelEl = label;
    return row;
  }

  private _buildChip(channel: CourierUserPreferencesChannel): HTMLElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'courier-channel-chip';

    const checkbox = document.createElement('courier-checkbox') as CourierCheckbox;
    btn.appendChild(checkbox);

    const label = document.createElement('span');
    label.className = 'courier-channel-chip-label';
    label.textContent = this._getLabel(channel);
    btn.appendChild(label);

    btn.addEventListener('click', () => {
      const isSelected = this._selectedChannels.includes(channel);
      if (isSelected) {
        if (this._isRequired && this._selectedChannels.length <= 1) return;
        this._selectedChannels = this._selectedChannels.filter(c => c !== channel);
      } else {
        this._selectedChannels = [...this._selectedChannels, channel];
      }
      this._applySelection();
      this._onRoutingChange?.(this._selectedChannels);
    });

    this._chips.push({ channel, button: btn, checkbox });
    return btn;
  }

  private _refreshLabels() {
    for (const chip of this._chips) {
      const label = chip.button.querySelector<HTMLElement>('.courier-channel-chip-label');
      if (label) label.textContent = this._getLabel(chip.channel);
    }
  }

  private _resolvedColors() {
    const theme = this._theme();
    const chip = theme.channelChip;
    const font = chip?.font;
    const selectedFont = chip?.selectedFont;
    const checkbox = chip?.checkbox;
    const checkboxFont = checkbox?.font;
    const checkboxSelectedFont = checkbox?.selectedFont;

    const unselectedText = checkboxFont?.color ?? font?.color ?? theme.topic?.statusLabel?.color ?? '#737373';
    const selectedText = checkboxSelectedFont?.color ?? selectedFont?.color ?? theme.container?.font?.color ?? '#171717';
    const unselectedSize = checkboxFont?.size ?? font?.size ?? '14px';
    const selectedSize = checkboxSelectedFont?.size ?? selectedFont?.size ?? unselectedSize;
    const unselectedWeight = checkboxFont?.weight ?? font?.weight ?? '400';
    const selectedWeight = checkboxSelectedFont?.weight ?? selectedFont?.weight ?? '500';
    const fontFamily = checkboxFont?.family ?? font?.family ?? theme.container?.font?.family;
    const selectedFontFamily = checkboxSelectedFont?.family ?? selectedFont?.family ?? fontFamily;

    const checkedColor = checkbox?.checkedColor || theme.container?.font?.color || '#171717';

    const divider = chip?.divider;

    return {
      unselectedText, selectedText,
      unselectedSize, selectedSize,
      unselectedWeight, selectedWeight,
      fontFamily, selectedFontFamily,
      checkedColor,
      divider,
    };
  }

  private _applyTheme() {
    if (!this._wrapperEl) return;
    const colors = this._resolvedColors();

    if (this._dividerEl && colors.divider) {
      this._dividerEl.style.borderTop = colors.divider;
    }

    for (const chip of this._chips) {
      chip.checkbox.checkedColor = colors.checkedColor;
    }

    this._applySelection();
    this._applyCustomizeState();
  }

  private _applySelection() {
    if (this._chips.length === 0) return;
    const colors = this._resolvedColors();
    for (const chip of this._chips) {
      const isSelected = this._selectedChannels.includes(chip.channel);
      chip.checkbox.checked = isSelected;
      chip.button.setAttribute('aria-pressed', String(isSelected));
      chip.button.style.color = isSelected ? colors.selectedText : colors.unselectedText;
      chip.button.style.fontSize = isSelected ? colors.selectedSize : colors.unselectedSize;
      chip.button.style.fontWeight = isSelected ? colors.selectedWeight : colors.unselectedWeight;
      const family = isSelected ? colors.selectedFontFamily : colors.fontFamily;
      if (family) {
        chip.button.style.fontFamily = family;
      } else {
        chip.button.style.removeProperty('font-family');
      }
    }
  }

  private _applyCustomizeState() {
    if (this._customizeLabelEl) {
      this._customizeLabelEl.textContent = this._customizeEnabled
        ? (this._customizeActiveLabel ?? this._customizeLabel)
        : this._customizeLabel;
    }
    if (this._customizeButtonEl) {
      const colors = this._resolvedColors();
      this._customizeButtonEl.setAttribute('aria-expanded', String(this._customizeEnabled));
      this._customizeButtonEl.style.color = this._customizeEnabled ? colors.selectedText : colors.unselectedText;
      this._customizeButtonEl.style.fontSize = this._customizeEnabled ? colors.selectedSize : colors.unselectedSize;
      this._customizeButtonEl.style.fontWeight = this._customizeEnabled ? colors.selectedWeight : colors.unselectedWeight;
      const family = this._customizeEnabled ? colors.selectedFontFamily : colors.fontFamily;
      if (family) {
        this._customizeButtonEl.style.fontFamily = family;
      } else {
        this._customizeButtonEl.style.removeProperty('font-family');
      }
    }
    // Collapsed: the chip list is hidden, so pad below the arrow row to keep the
    // card from ending flush against it. Expanded: the chip list owns the gap.
    if (this._customizeRowEl) {
      this._customizeRowEl.style.paddingBottom = this._customizeEnabled ? '' : COLLAPSED_ROW_PADDING_BOTTOM;
    }
    if (this._containerEl) {
      this._containerEl.style.display = this._customizeEnabled ? 'flex' : 'none';
    }
  }
}

registerElement(CourierChannelRouting);
