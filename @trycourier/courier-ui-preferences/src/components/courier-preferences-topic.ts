import { CourierBaseElement, registerElement, injectGlobalStyle } from "@trycourier/courier-ui-core";
import { CourierUserPreferencesChannel, CourierUserPreferencesStatus, CourierDigestScheduleOption } from "@trycourier/courier-js";
import { CourierPreferencesTheme, DEFAULT_PREFERENCES_PRIMARY_COLOR } from "../types/courier-preferences-theme";
import { CourierPreferencesThemeManager, CourierPreferencesThemeSubscription } from "../types/courier-preferences-theme-manager";
import { PreferencesTopic } from "../types/preferences";
import { CourierPreferenceToggle } from "./courier-preference-toggle";
import { CourierDigestSchedule } from "./courier-digest-schedule";
import { CourierChannelRouting } from "./courier-channel-routing";
import { isInstantSchedule } from "../utils/format-digest";

const STYLE_ID = 'courier-preferences-topic';

function getStyles(theme: CourierPreferencesTheme): string {
  const t = theme.topic;
  return `
    .courier-pref-topic {
      background: ${t?.backgroundColor || '#FFFFFF'};
      border: ${t?.border || 'none'};
      border-radius: ${t?.borderRadius || '12px'};
      padding: 20px 0;
      overflow: hidden;
    }
    .courier-pref-topic--has-routing {
      padding-bottom: 0;
    }
    .courier-pref-topic-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 0 24px;
      min-width: 0;
    }
    .courier-pref-topic-info {
      flex: 1;
      min-width: 0;
    }
    .courier-pref-topic-name {
      font-size: ${t?.title?.size || '16px'};
      font-weight: ${t?.title?.weight || '400'};
      color: ${t?.title?.color || '#171717'};
      font-family: ${t?.title?.family || 'inherit'};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
      display: block;
    }
    .courier-pref-topic-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .courier-pref-topic-status {
      font-size: ${t?.statusLabel?.size || '14px'};
      font-weight: ${t?.statusLabel?.weight || '300'};
      color: ${t?.statusLabel?.color || '#737373'};
      font-family: ${t?.statusLabel?.family || 'inherit'};
      white-space: nowrap;
      margin: 0;
    }
  `;
}

/** @public */
export class CourierPreferencesTopic extends CourierBaseElement {
  static get id(): string {
    return 'courier-preferences-topic';
  }

  private _topic!: PreferencesTopic;
  private _themeManager?: CourierPreferencesThemeManager;
  private _themeSubscription?: CourierPreferencesThemeSubscription;
  private _styleEl?: HTMLStyleElement;
  private _primaryColor = DEFAULT_PREFERENCES_PRIMARY_COLOR;
  private _hasCustomRouting = false;
  private _routingOptions: CourierUserPreferencesChannel[] = [];
  private _channelLabels: Record<string, string> = {};
  private _digestSchedules: CourierDigestScheduleOption[] = [];

  private _onStatusChange?: (topicId: string, status: CourierUserPreferencesStatus) => void;
  private _onDigestChange?: (topicId: string, scheduleId: string) => void;
  private _onRoutingChange?: (topicId: string, channels: CourierUserPreferencesChannel[]) => void;
  private _onCustomizeChange?: (topicId: string, enabled: boolean) => void;

  private _cardEl?: HTMLDivElement;
  private _headerEl?: HTMLDivElement;
  private _infoEl?: HTMLDivElement;
  private _controlsEl?: HTMLDivElement;
  private _statusEl?: HTMLSpanElement;
  private _toggleEl?: CourierPreferenceToggle;
  private _digestEl?: CourierDigestSchedule;
  private _routingEl?: CourierChannelRouting;
  private _built = false;
  private _mounted = false;

  set topic(val: PreferencesTopic) {
    this._topic = val;
    if (!this.isConnected) return;
    if (!this._built) {
      this._render();
    } else {
      this._reconcile();
    }
  }

  set themeManager(val: CourierPreferencesThemeManager) {
    this._themeManager = val;
    if (this._mounted) this._setupThemeSubscription();
  }

  set primaryColor(val: string) {
    this._primaryColor = val;
    if (this._built) {
      if (this._toggleEl) this._toggleEl.primaryColor = this._primaryColor;
      if (this._digestEl) this._digestEl.primaryColor = this._primaryColor;
      if (this._routingEl) this._routingEl.primaryColor = this._primaryColor;
    }
  }
  set hasCustomRouting(val: boolean) { this._hasCustomRouting = val; }
  set routingOptions(val: CourierUserPreferencesChannel[]) { this._routingOptions = val; }
  set channelLabels(val: Record<string, string>) { this._channelLabels = val; }
  set digestSchedules(val: CourierDigestScheduleOption[]) { this._digestSchedules = val; }

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
    this._built = false;
    this._themeSubscription?.unsubscribe();
    this._themeSubscription = undefined;
    this._styleEl = undefined;
    this._cardEl = undefined;
    this._headerEl = undefined;
    this._infoEl = undefined;
    this._controlsEl = undefined;
    this._statusEl = undefined;
    this._toggleEl = undefined;
    this._digestEl = undefined;
    this._routingEl = undefined;
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
    if (!this.isConnected || !this._topic) return;
    this.innerHTML = '';

    this.setAttribute('data-topic-id', this._topic.topicId);

    const isRequired = this._topic.defaultStatus === 'REQUIRED';
    const isOptedIn = this._topic.status === 'OPTED_IN' || isRequired;

    const card = document.createElement('div');
    card.className = 'courier-pref-topic';

    const header = document.createElement('div');
    header.className = 'courier-pref-topic-header';

    const info = document.createElement('div');
    info.className = 'courier-pref-topic-info';

    const name = document.createElement('div');
    name.className = 'courier-pref-topic-name';
    name.textContent = this._topic.topicName;
    info.appendChild(name);

    header.appendChild(info);

    const controls = document.createElement('div');
    controls.className = 'courier-pref-topic-controls';

    if (isRequired) {
      const status = document.createElement('span');
      status.className = 'courier-pref-topic-status';
      status.textContent = 'Required';
      controls.appendChild(status);
      this._statusEl = status;
    }

    const toggle = document.createElement('courier-preference-toggle') as CourierPreferenceToggle;
    if (this._themeManager) toggle.themeManager = this._themeManager;
    toggle.primaryColor = this._primaryColor;
    toggle.checked = isOptedIn;
    toggle.disabled = isRequired;
    toggle.onChange = (checked: boolean) => {
      const newStatus: CourierUserPreferencesStatus = checked ? 'OPTED_IN' : 'OPTED_OUT';
      this._onStatusChange?.(this._topic.topicId, newStatus);
    };
    controls.appendChild(toggle);
    header.appendChild(controls);
    card.appendChild(header);

    this._cardEl = card;
    this._headerEl = header;
    this._infoEl = info;
    this._controlsEl = controls;
    this._toggleEl = toggle;

    this.appendChild(card);

    this._built = true;
    this._updateExpandedContent();
    this._updateHeaderPadding();
  }

  private _reconcile() {
    if (!this._cardEl || !this._toggleEl || !this._headerEl || !this._infoEl || !this._controlsEl) {
      this._render();
      return;
    }

    const isRequired = this._topic.defaultStatus === 'REQUIRED';
    const isOptedIn = this._topic.status === 'OPTED_IN' || isRequired;

    this.setAttribute('data-topic-id', this._topic.topicId);

    if (isRequired) {
      if (!this._statusEl) {
        const status = document.createElement('span');
        status.className = 'courier-pref-topic-status';
        status.textContent = 'Required';
        this._controlsEl.insertBefore(status, this._toggleEl);
        this._statusEl = status;
      }
    } else if (this._statusEl) {
      this._statusEl.remove();
      this._statusEl = undefined;
    }

    this._toggleEl.checked = isOptedIn;
    this._toggleEl.disabled = isRequired;

    this._updateExpandedContent();
    this._updateHeaderPadding();
  }

  private _updateExpandedContent() {
    if (!this._cardEl) return;

    const isRequired = this._topic.defaultStatus === 'REQUIRED';
    const isOptedIn = this._topic.status === 'OPTED_IN' || isRequired;

    const onlyInstant = this._digestSchedules.length > 0 && this._digestSchedules.every(isInstantSchedule);
    const hasDigest = isOptedIn && this._digestSchedules.length > 0 && !onlyInstant;
    const hasRouting = isOptedIn && this._hasCustomRouting && this._routingOptions.length > 0;

    if (hasDigest) {
      if (!this._digestEl) {
        const digest = document.createElement('courier-digest-schedule') as CourierDigestSchedule;
        if (this._themeManager) digest.themeManager = this._themeManager;
        digest.primaryColor = this._primaryColor;
        digest.schedules = this._digestSchedules;
        digest.selectedScheduleId = this._topic.digestSchedule;
        digest.onScheduleChange = (scheduleId: string) => {
          this._onDigestChange?.(this._topic.topicId, scheduleId);
        };
        this._cardEl.appendChild(digest);
        this._digestEl = digest;
      } else {
        this._digestEl.schedules = this._digestSchedules;
        this._digestEl.selectedScheduleId = this._topic.digestSchedule;
      }
    } else if (this._digestEl) {
      this._digestEl.remove();
      this._digestEl = undefined;
    }

    if (hasRouting) {
      if (!this._routingEl) {
        const routing = document.createElement('courier-channel-routing') as CourierChannelRouting;
        if (this._themeManager) routing.themeManager = this._themeManager;
        routing.primaryColor = this._primaryColor;
        routing.isRequired = isRequired;
        routing.channelLabels = this._channelLabels;
        routing.routingOptions = this._routingOptions;
        routing.selectedChannels = this._topic.customRouting;
        routing.customizeEnabled = this._topic.hasCustomRouting;
        routing.onRoutingChange = (channels: CourierUserPreferencesChannel[]) => {
          this._onRoutingChange?.(this._topic.topicId, channels);
        };
        routing.onCustomizeChange = (enabled: boolean) => {
          this._onCustomizeChange?.(this._topic.topicId, enabled);
        };
        this._cardEl.appendChild(routing);
        this._routingEl = routing;
      } else {
        this._routingEl.isRequired = isRequired;
        this._routingEl.routingOptions = this._routingOptions;
        this._routingEl.selectedChannels = this._topic.customRouting;
        this._routingEl.customizeEnabled = this._topic.hasCustomRouting;
      }
    } else if (this._routingEl) {
      this._routingEl.remove();
      this._routingEl = undefined;
    }
  }

  private _updateHeaderPadding() {
    if (!this._cardEl) return;
    this._cardEl.classList.toggle('courier-pref-topic--has-routing', !!this._routingEl);
  }
}

registerElement(CourierPreferencesTopic);
