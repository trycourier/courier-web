import {
  Courier,
  CourierUserPreferencesChannel,
  CourierUserPreferencesStatus,
  CourierBrand,
  CourierPreferencePage,
  RecipientPreference,
} from "@trycourier/courier-js";
import { CourierBaseElement, CourierComponentThemeMode, registerElement, injectGlobalStyle } from "@trycourier/courier-ui-core";
import { CourierPreferencesTheme, defaultLightTheme, DEFAULT_PREFERENCES_PRIMARY_COLOR } from "../types/courier-preferences-theme";
import { CourierPreferencesThemeManager } from "../types/courier-preferences-theme-manager";
import { PreferencesSection, PreferencesTopic } from "../types/preferences";
import { CourierPreferencesSection } from "./courier-preferences-section";
import { CourierPreferencesTopic } from "./courier-preferences-topic";

const STYLE_ID = 'courier-preferences';

/** Convert a hex color (#rgb or #rrggbb) to "r, g, b" tuple. */
function hexToRgbTuple(color: string): string {
  const raw = color.trim().replace(/^#/, '');
  const expanded = raw.length === 3
    ? raw.split('').map(c => c + c).join('')
    : raw;
  if (!/^[0-9a-f]{6}$/i.test(expanded)) {
    return '0, 0, 0';
  }
  const r = parseInt(expanded.substring(0, 2), 16);
  const g = parseInt(expanded.substring(2, 4), 16);
  const b = parseInt(expanded.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function getStyles(theme: CourierPreferencesTheme): string {
  const topic = theme.topic;
  const loadingAnim = theme.loading?.animation;
  const barColor = loadingAnim?.barColor || '#E5E5E5';
  const barRgb = hexToRgbTuple(barColor);
  const barHeight = loadingAnim?.barHeight || '14px';
  const barRadius = loadingAnim?.barBorderRadius || '14px';
  const shimmerDuration = loadingAnim?.duration || '2s';

  const errorTitle = theme.error?.title?.font;
  const errorButton = theme.error?.button;
  const errorButtonFont = errorButton?.font;
  const errorButtonBg = errorButton?.backgroundColor || '#171717';
  const errorButtonHoverBg = errorButton?.hoverBackgroundColor || errorButtonBg;

  const emptyTitle = theme.empty?.title?.font;
  const emptyButton = theme.empty?.button;
  const emptyButtonFont = emptyButton?.font;
  const emptyButtonBg = emptyButton?.backgroundColor || '#171717';
  const emptyButtonHoverBg = emptyButton?.hoverBackgroundColor || emptyButtonBg;

  return `
    .courier-preferences-root {
      background: transparent;
      border: none;
      border-radius: 0;
      font-family: ${theme.container?.font?.family || 'inherit'};
      color: ${theme.container?.font?.color || '#171717'};
      min-height: 100px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0;
    }
    .courier-preferences-inner {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .courier-preferences-logo {
      display: flex;
      justify-content: flex-start;
    }
    .courier-preferences-logo img {
      max-height: 40px;
      object-fit: contain;
    }
    .courier-preferences-sections {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    /* Skeleton loading */
    .courier-preferences-skeleton {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
    }
    .courier-preferences-skeleton-card {
      background: ${topic?.backgroundColor || '#FFFFFF'};
      border: ${topic?.border || 'none'};
      border-radius: ${topic?.borderRadius || '12px'};
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-sizing: border-box;
    }
    .courier-preferences-skeleton-card:nth-child(1) { opacity: 1; }
    .courier-preferences-skeleton-card:nth-child(2) { opacity: 0.7; }
    .courier-preferences-skeleton-card:nth-child(3) { opacity: 0.4; }
    .courier-preferences-skeleton-bar {
      height: ${barHeight};
      border-radius: ${barRadius};
      background: linear-gradient(
        90deg,
        rgba(${barRgb}, 0.8) 25%,
        rgba(${barRgb}, 0.4) 50%,
        rgba(${barRgb}, 0.8) 75%
      );
      background-size: 200% 100%;
      animation: courier-preferences-shimmer ${shimmerDuration} ease-in-out infinite;
    }
    .courier-preferences-skeleton-bar--title { width: 35%; }
    .courier-preferences-skeleton-bar--body { width: 100%; }
    @keyframes courier-preferences-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Info state (error / empty) */
    .courier-preferences-info-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 48px 24px;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
    }
    .courier-preferences-info-state-title {
      margin: 0;
    }
    .courier-preferences-info-state-button {
      cursor: pointer;
      padding: 10px 20px;
      transition: background-color 150ms ease, opacity 150ms ease;
    }
    .courier-preferences-info-state-button:focus {
      outline: none;
    }

    .courier-preferences-error-title {
      color: ${errorTitle?.color || '#171717'};
      font-size: ${errorTitle?.size || '16px'};
      font-weight: ${errorTitle?.weight || '500'};
      font-family: ${errorTitle?.family || 'inherit'};
    }
    .courier-preferences-error-button {
      background-color: ${errorButtonBg};
      color: ${errorButtonFont?.color || '#FFFFFF'};
      font-size: ${errorButtonFont?.size || '14px'};
      font-weight: ${errorButtonFont?.weight || '500'};
      font-family: ${errorButtonFont?.family || 'inherit'};
      border: ${errorButton?.border || 'none'};
      border-radius: ${errorButton?.borderRadius || '8px'};
    }
    .courier-preferences-error-button:hover {
      background-color: ${errorButtonHoverBg};
    }

    .courier-preferences-empty-title {
      color: ${emptyTitle?.color || '#171717'};
      font-size: ${emptyTitle?.size || '16px'};
      font-weight: ${emptyTitle?.weight || '500'};
      font-family: ${emptyTitle?.family || 'inherit'};
    }
    .courier-preferences-empty-button {
      background-color: ${emptyButtonBg};
      color: ${emptyButtonFont?.color || '#FFFFFF'};
      font-size: ${emptyButtonFont?.size || '14px'};
      font-weight: ${emptyButtonFont?.weight || '500'};
      font-family: ${emptyButtonFont?.family || 'inherit'};
      border: ${emptyButton?.border || 'none'};
      border-radius: ${emptyButton?.borderRadius || '8px'};
    }
    .courier-preferences-empty-button:hover {
      background-color: ${emptyButtonHoverBg};
    }
  `;
}

/**
 * Root web component for Courier notification preferences.
 *
 * @example
 * ```html
 * <courier-preferences brand-id="MY_BRAND_ID"></courier-preferences>
 * ```
 *
 * @public
 */
export class CourierPreferences extends CourierBaseElement {
  static get id(): string {
    return 'courier-preferences';
  }

  static get observedAttributes() {
    return ['light-theme', 'dark-theme', 'mode', 'tenant-id', 'brand-id'];
  }

  private _themeManager = new CourierPreferencesThemeManager(defaultLightTheme);
  private _styleEl?: HTMLStyleElement;
  private _authListener?: { remove: () => void };
  private _sections: PreferencesSection[] = [];
  private _isLoading = false;
  private _error?: Error;
  private _channelLabels: Record<string, string> = {};
  private _brandId?: string;
  private _brand?: CourierBrand;
  private _primaryColor = DEFAULT_PREFERENCES_PRIMARY_COLOR;

  protected onComponentMounted(): void {
    this._readInitialThemeAttributes();
    this._styleEl = injectGlobalStyle(STYLE_ID, getStyles(this._themeManager.getTheme()));
    this._setupThemeSubscription();

    this._authListener = Courier.shared.addAuthenticationListener(() => {
      this._refresh();
    });

    if (Courier.shared.client?.options.userId) {
      this._refresh();
    }
  }

  protected onComponentUnmounted(): void {
    this._authListener?.remove();
    this._themeManager.cleanup();
    this._styleEl = undefined;
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    switch (name) {
      case 'light-theme':
        if (newValue) {
          try { this._themeManager.setLightTheme(JSON.parse(newValue)); } catch { /* skip */ }
        }
        break;
      case 'dark-theme':
        if (newValue) {
          try { this._themeManager.setDarkTheme(JSON.parse(newValue)); } catch { /* skip */ }
        }
        break;
      case 'mode':
        if (newValue) {
          this._themeManager.setMode(newValue as CourierComponentThemeMode);
        }
        break;
      case 'tenant-id':
        break;
      case 'brand-id':
        this._brandId = newValue || undefined;
        if (Courier.shared.client?.options.userId) {
          this._refresh();
        }
        break;
    }
  }

  public setLightTheme(theme: CourierPreferencesTheme) {
    this._themeManager.setLightTheme(theme);
  }

  public setDarkTheme(theme: CourierPreferencesTheme) {
    this._themeManager.setDarkTheme(theme);
  }

  public setMode(mode: CourierComponentThemeMode) {
    this._themeManager.setMode(mode);
  }

  public setChannelLabels(labels: Record<string, string>) {
    this._channelLabels = labels;
    this._render();
  }

  private _readInitialThemeAttributes() {
    const lightTheme = this.getAttribute('light-theme');
    if (lightTheme) {
      try { this._themeManager.setLightTheme(JSON.parse(lightTheme)); } catch { /* skip */ }
    }

    const darkTheme = this.getAttribute('dark-theme');
    if (darkTheme) {
      try { this._themeManager.setDarkTheme(JSON.parse(darkTheme)); } catch { /* skip */ }
    }

    const mode = this.getAttribute('mode');
    if (mode) {
      this._themeManager.setMode(mode as CourierComponentThemeMode);
    }
  }

  private _setupThemeSubscription() {
    this._themeManager.subscribe(() => {
      this._refreshTheme();
    });
    this._refreshTheme();
  }

  private _refreshTheme() {
    this._resolvePrimaryColor();
    if (this._styleEl) {
      this._styleEl.textContent = getStyles(this._themeManager.getTheme());
    }
    this.querySelectorAll<CourierPreferencesSection>('courier-preferences-section').forEach(sectionEl => {
      sectionEl.primaryColor = this._primaryColor;
    });
  }

  private async _refresh() {
    const client = Courier.shared.client;
    if (!client) return;

    this._isLoading = true;
    this._error = undefined;
    this._render();

    try {
      const pageData = await client.preferences.getPreferencePage({ brandId: this._brandId });

      if (pageData) {
        this._sections = this._mergePageWithPreferences(pageData, pageData.recipientPreferences);
        this._brand = pageData.brand as CourierBrand | undefined;
        this._resolvePrimaryColor();
      }
    } catch (error: unknown) {
      this._error = error as Error;
    } finally {
      this._isLoading = false;
      this._render();
    }
  }

  /**
   * Precedence: user theme primaryColor > brand primaryColor > default
   */
  private _resolvePrimaryColor() {
    const theme = this._themeManager.getTheme();
    const brandPrimary = this._brand?.settings?.colors?.primary;
    const themePrimary = theme.primaryColor;
    const defaultPrimary = DEFAULT_PREFERENCES_PRIMARY_COLOR;

    if (themePrimary && themePrimary !== defaultPrimary) {
      this._primaryColor = themePrimary;
    } else if (brandPrimary) {
      this._primaryColor = brandPrimary;
    } else {
      this._primaryColor = themePrimary || defaultPrimary;
    }
  }

  private _mergePageWithPreferences(
    page: CourierPreferencePage,
    recipientPrefs: RecipientPreference[]
  ): PreferencesSection[] {
    const userPrefById = new Map<string, RecipientPreference>();
    for (const pref of recipientPrefs) {
      userPrefById.set(pref.templateId, pref);
    }

    return page.sections.map(section => ({
      sectionId: section.sectionId,
      sectionName: section.name,
      hasCustomRouting: section.hasCustomRouting,
      routingOptions: section.routingOptions,
      topics: section.topics.map(topic => {
        const userPref = userPrefById.get(topic.templateId);
        const status: CourierUserPreferencesStatus =
          userPref?.status && userPref.status !== 'UNKNOWN'
            ? userPref.status as CourierUserPreferencesStatus
            : topic.defaultStatus;

        const hasUserRouting = Boolean(userPref?.hasCustomRouting) && (userPref?.routingPreferences?.length ?? 0) > 0;
        const defaultAllOn = topic.defaultStatus !== 'OPTED_OUT';
        const customRouting: CourierUserPreferencesChannel[] = hasUserRouting
          ? (userPref!.routingPreferences || []) as CourierUserPreferencesChannel[]
          : defaultAllOn
            ? [...section.routingOptions]
            : [];

        return {
          topicId: topic.templateId,
          topicName: topic.templateName,
          status,
          defaultStatus: topic.defaultStatus,
          hasCustomRouting: userPref?.hasCustomRouting ?? false,
          customRouting,
          digestSchedule: userPref?.digestSchedule,
          digestScheduleOptions: topic.digestSchedules ?? [],
        };
      }),
    }));
  }

  private _findTopicAndSnapshot(topicId: string): {
    topic: PreferencesTopic | undefined;
    snapshot: PreferencesSection[];
  } {
    const snapshot = JSON.parse(JSON.stringify(this._sections)) as PreferencesSection[];
    for (const section of this._sections) {
      const topic = section.topics.find(t => t.topicId === topicId);
      if (topic) {
        return { topic, snapshot };
      }
    }
    return { topic: undefined, snapshot };
  }

  private _restoreSnapshot(snapshot: PreferencesSection[]) {
    this._sections = snapshot;
    this._render();
  }

  private async _updateTopicStatus(topicId: string, status: CourierUserPreferencesStatus): Promise<void> {
    const { topic, snapshot } = this._findTopicAndSnapshot(topicId);
    if (!topic) return;

    topic.status = status;
    this._updateTopicInPlace(topic);

    try {
      await Courier.shared.client!.preferences.putUserPreferenceTopic({
        topicId,
        status,
        hasCustomRouting: topic.hasCustomRouting,
        customRouting: topic.customRouting,
        digestSchedule: topic.digestSchedule,
      });
    } catch (error: unknown) {
      this._restoreSnapshot(snapshot);
      this._error = error as Error;
      this._render();
    }
  }

  private async _updateDigestSchedule(topicId: string, scheduleId: string): Promise<void> {
    const { topic, snapshot } = this._findTopicAndSnapshot(topicId);
    if (!topic) return;

    topic.digestSchedule = scheduleId;
    this._updateTopicInPlace(topic);

    try {
      await Courier.shared.client!.preferences.putUserPreferenceTopic({
        topicId,
        status: topic.status,
        hasCustomRouting: topic.hasCustomRouting,
        customRouting: topic.customRouting,
        digestSchedule: scheduleId,
      });
    } catch (error: unknown) {
      this._restoreSnapshot(snapshot);
      this._error = error as Error;
      this._render();
    }
  }

  private async _updateChannelRouting(topicId: string, channels: CourierUserPreferencesChannel[]): Promise<void> {
    const { topic, snapshot } = this._findTopicAndSnapshot(topicId);
    if (!topic) return;

    topic.customRouting = channels;
    topic.hasCustomRouting = channels.length > 0;
    this._updateTopicInPlace(topic);

    try {
      await Courier.shared.client!.preferences.putUserPreferenceTopic({
        topicId,
        status: topic.status,
        hasCustomRouting: topic.hasCustomRouting,
        customRouting: channels,
        digestSchedule: topic.digestSchedule,
      });
    } catch (error: unknown) {
      this._restoreSnapshot(snapshot);
      this._error = error as Error;
      this._render();
    }
  }

  private _updateTopicInPlace(topic: PreferencesTopic) {
    const topicEl = this.querySelector(
      `courier-preferences-topic[data-topic-id="${CSS.escape(topic.topicId)}"]`
    ) as CourierPreferencesTopic | null;
    if (topicEl) {
      topicEl.topic = topic;
    } else {
      this._render();
    }
  }

  private _render() {
    if (!this.isConnected) return;
    this._resolvePrimaryColor();
    this.innerHTML = '';

    const root = document.createElement('div');
    root.className = 'courier-preferences-root';

    const inner = document.createElement('div');
    inner.className = 'courier-preferences-inner';

    // Brand logo
    if (this._brand?.logo?.image) {
      const logoContainer = document.createElement('div');
      logoContainer.className = 'courier-preferences-logo';

      if (this._brand.logo.href) {
        const logoLink = document.createElement('a');
        logoLink.href = this._brand.logo.href;
        logoLink.target = '_blank';
        logoLink.rel = 'noopener noreferrer';
        const logoImg = document.createElement('img');
        logoImg.src = this._brand.logo.image;
        logoImg.alt = 'Logo';
        logoLink.appendChild(logoImg);
        logoContainer.appendChild(logoLink);
      } else {
        const logoImg = document.createElement('img');
        logoImg.src = this._brand.logo.image;
        logoImg.alt = 'Logo';
        logoContainer.appendChild(logoImg);
      }

      inner.appendChild(logoContainer);
    }

    // Error (takes precedence)
    if (this._error && this._sections.length === 0) {
      inner.appendChild(this._buildErrorState(this._error));
      root.appendChild(inner);
      this.appendChild(root);
      return;
    }

    // Loading
    if (this._isLoading && this._sections.length === 0) {
      inner.appendChild(this._buildSkeleton());
      root.appendChild(inner);
      this.appendChild(root);
      return;
    }

    // Empty (loading complete, no error, no sections)
    if (!this._isLoading && !this._error && this._sections.length === 0) {
      inner.appendChild(this._buildEmptyState());
      root.appendChild(inner);
      this.appendChild(root);
      return;
    }

    // Sections
    const sectionsContainer = document.createElement('div');
    sectionsContainer.className = 'courier-preferences-sections';

    for (const section of this._sections) {
      const sectionEl = document.createElement('courier-preferences-section') as CourierPreferencesSection;
      sectionEl.themeManager = this._themeManager;
      sectionEl.section = section;
      sectionEl.primaryColor = this._primaryColor;
      sectionEl.channelLabels = this._channelLabels;
      sectionEl.onStatusChange = (topicId: string, status: CourierUserPreferencesStatus) => {
        this._updateTopicStatus(topicId, status);
      };
      sectionEl.onDigestChange = (topicId: string, scheduleId: string) => {
        this._updateDigestSchedule(topicId, scheduleId);
      };
      sectionEl.onRoutingChange = (topicId: string, channels: CourierUserPreferencesChannel[]) => {
        this._updateChannelRouting(topicId, channels);
      };
      sectionsContainer.appendChild(sectionEl);
    }

    inner.appendChild(sectionsContainer);

    root.appendChild(inner);
    this.appendChild(root);
  }

  private _buildSkeleton(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'courier-preferences-skeleton';

    for (let i = 0; i < 3; i++) {
      const card = document.createElement('div');
      card.className = 'courier-preferences-skeleton-card';

      const titleBar = document.createElement('div');
      titleBar.className = 'courier-preferences-skeleton-bar courier-preferences-skeleton-bar--title';
      card.appendChild(titleBar);

      const bodyBar = document.createElement('div');
      bodyBar.className = 'courier-preferences-skeleton-bar courier-preferences-skeleton-bar--body';
      card.appendChild(bodyBar);

      container.appendChild(card);
    }

    return container;
  }

  private _buildErrorState(error: Error): HTMLElement {
    const theme = this._themeManager.getTheme();
    const titleText = theme.error?.title?.text ?? error.message ?? 'Unable to load preferences';
    const buttonText = theme.error?.button?.text ?? 'Retry';

    const container = document.createElement('div');
    container.className = 'courier-preferences-info-state';

    const title = document.createElement('h2');
    title.className = 'courier-preferences-info-state-title courier-preferences-error-title';
    title.textContent = titleText;
    container.appendChild(title);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'courier-preferences-info-state-button courier-preferences-error-button';
    button.textContent = buttonText;
    button.addEventListener('click', () => {
      this._error = undefined;
      this._refresh();
    });
    container.appendChild(button);

    return container;
  }

  private _buildEmptyState(): HTMLElement {
    const theme = this._themeManager.getTheme();
    const titleText = theme.empty?.title?.text ?? 'No preferences available';
    const buttonText = theme.empty?.button?.text ?? 'Refresh';

    const container = document.createElement('div');
    container.className = 'courier-preferences-info-state';

    const title = document.createElement('h2');
    title.className = 'courier-preferences-info-state-title courier-preferences-empty-title';
    title.textContent = titleText;
    container.appendChild(title);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'courier-preferences-info-state-button courier-preferences-empty-button';
    button.textContent = buttonText;
    button.addEventListener('click', () => {
      this._refresh();
    });
    container.appendChild(button);

    return container;
  }
}

registerElement(CourierPreferences);
