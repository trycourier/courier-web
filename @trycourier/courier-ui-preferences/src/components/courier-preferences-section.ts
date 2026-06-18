import { CourierBaseElement, registerElement, injectGlobalStyle } from "@trycourier/courier-ui-core";
import { CourierUserPreferencesChannel, CourierUserPreferencesStatus } from "@trycourier/courier-js";
import { CourierPreferencesTheme, DEFAULT_PREFERENCES_PRIMARY_COLOR } from "../types/courier-preferences-theme";
import { CourierPreferencesThemeManager, CourierPreferencesThemeSubscription } from "../types/courier-preferences-theme-manager";
import { PreferencesSection } from "../types/preferences";
import { CourierPreferencesTopic } from "./courier-preferences-topic";

const STYLE_ID = 'courier-preferences-section';

function getStyles(theme: CourierPreferencesTheme): string {
  const s = theme.section;
  return `
    courier-preferences-section .courier-pref-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: ${s?.backgroundColor || 'transparent'};
    }
    courier-preferences-section .courier-pref-section-title {
      font-size: ${s?.title?.size || '18px'};
      font-weight: ${s?.title?.weight || '600'};
      color: ${s?.title?.color || '#171717'};
      font-family: ${s?.title?.family || 'inherit'};
      padding: 0;
      margin: 0;
    }
    courier-preferences-section .courier-pref-section-topics {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  `;
}

/** @public */
export class CourierPreferencesSection extends CourierBaseElement {
  static get id(): string {
    return 'courier-preferences-section';
  }

  private _section!: PreferencesSection;
  private _themeManager?: CourierPreferencesThemeManager;
  private _themeSubscription?: CourierPreferencesThemeSubscription;
  private _styleEl?: HTMLStyleElement;
  private _primaryColor = DEFAULT_PREFERENCES_PRIMARY_COLOR;
  private _channelLabels: Record<string, string> = {};
  private _mounted = false;

  private _onStatusChange?: (topicId: string, status: CourierUserPreferencesStatus) => void;
  private _onDigestChange?: (topicId: string, scheduleId: string) => void;
  private _onRoutingChange?: (topicId: string, channels: CourierUserPreferencesChannel[]) => void;
  private _onCustomizeChange?: (topicId: string, enabled: boolean) => void;

  set section(val: PreferencesSection) {
    this._section = val;
    if (this._mounted) this._render();
  }

  set themeManager(val: CourierPreferencesThemeManager) {
    this._themeManager = val;
    if (this._mounted) this._setupThemeSubscription();
  }

  set primaryColor(val: string) {
    this._primaryColor = val;
    if (this._mounted) {
      this.querySelectorAll<CourierPreferencesTopic>('courier-preferences-topic').forEach(t => {
        t.primaryColor = this._primaryColor;
      });
    }
  }

  set channelLabels(val: Record<string, string>) { this._channelLabels = val; }

  set onStatusChange(fn: (topicId: string, status: CourierUserPreferencesStatus) => void) {
    this._onStatusChange = fn;
  }

  set onDigestChange(fn: (topicId: string, scheduleId: string) => void) {
    this._onDigestChange = fn;
  }

  set onRoutingChange(fn: (topicId: string, channels: CourierUserPreferencesChannel[]) => void) {
    this._onRoutingChange = fn;
  }

  set onCustomizeChange(fn: (topicId: string, enabled: boolean) => void) {
    this._onCustomizeChange = fn;
  }

  protected onComponentMounted(): void {
    this._mounted = true;
    this._setupThemeSubscription();
    this._render();
  }

  protected onComponentUnmounted(): void {
    this._mounted = false;
    this._themeSubscription?.unsubscribe();
    this._themeSubscription = undefined;
    this._styleEl = undefined;
  }

  private _setupThemeSubscription() {
    if (!this._themeManager) return;
    this._themeSubscription?.unsubscribe();
    this._styleEl = injectGlobalStyle(STYLE_ID, getStyles(this._themeManager.getTheme()));
    this._themeSubscription = this._themeManager.subscribe(() => this._refreshTheme());
    this._refreshTheme();
  }

  private _refreshTheme() {
    if (!this._themeManager || !this._styleEl) return;
    this._styleEl.textContent = getStyles(this._themeManager.getTheme());
  }

  private _render() {
    if (!this.isConnected || !this._section) return;
    this.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'courier-pref-section';

    if (this._section.sectionName) {
      const title = document.createElement('h2');
      title.className = 'courier-pref-section-title';
      title.textContent = this._section.sectionName;
      container.appendChild(title);
    }

    const topicsList = document.createElement('div');
    topicsList.className = 'courier-pref-section-topics';

    for (const topic of this._section.topics) {
      const topicEl = document.createElement('courier-preferences-topic') as CourierPreferencesTopic;
      if (this._themeManager) topicEl.themeManager = this._themeManager;
      topicEl.topic = topic;
      topicEl.primaryColor = this._primaryColor;
      topicEl.hasCustomRouting = this._section.hasCustomRouting;
      topicEl.routingOptions = this._section.routingOptions;
      topicEl.channelLabels = this._channelLabels;
      topicEl.digestSchedules = topic.digestScheduleOptions ?? [];
      topicEl.onStatusChange = (topicId, status) => this._onStatusChange?.(topicId, status);
      topicEl.onDigestChange = (topicId, scheduleId) => this._onDigestChange?.(topicId, scheduleId);
      topicEl.onRoutingChange = (topicId, channels) => this._onRoutingChange?.(topicId, channels);
      topicEl.onCustomizeChange = (topicId, enabled) => this._onCustomizeChange?.(topicId, enabled);
      topicsList.appendChild(topicEl);
    }

    container.appendChild(topicsList);
    this.appendChild(container);
  }
}

registerElement(CourierPreferencesSection);
