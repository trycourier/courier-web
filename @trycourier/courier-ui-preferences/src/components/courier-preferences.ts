import { Courier, CourierUserPreferencesChannel, CourierUserPreferencesStatus, CourierDigestScheduleOption, CourierBrand } from "@trycourier/courier-js";
import { CourierBaseElement, CourierComponentThemeMode, registerElement, injectGlobalStyle } from "@trycourier/courier-ui-core";
import { CourierPreferencesTheme, defaultLightTheme, DEFAULT_PREFERENCES_PRIMARY_COLOR } from "../types/courier-preferences-theme";
import { CourierPreferencesThemeManager } from "../types/courier-preferences-theme-manager";
import { CourierPreferencesDatastore } from "../datastore/preferences-datastore";
import { CourierPreferencesDatastoreListener } from "../datastore/preferences-datastore-listener";
import { PreferencesSection } from "../types/preferences";
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
  private _datastoreListener!: CourierPreferencesDatastoreListener;
  private _authListener?: { remove: () => void };
  private _sections: PreferencesSection[] = [];
  private _isLoading = false;
  private _error?: Error;
  private _digestScheduleMap = new Map<string, CourierDigestScheduleOption[]>();
  private _channelLabels: Record<string, string> = {};
  private _brandId?: string;
  private _brand?: CourierBrand;
  private _primaryColor = DEFAULT_PREFERENCES_PRIMARY_COLOR;

  protected onComponentMounted(): void {
    this._readInitialThemeAttributes();
    this._styleEl = injectGlobalStyle(STYLE_ID, getStyles(this._themeManager.getTheme()));
    this._setupThemeSubscription();

    this._datastoreListener = new CourierPreferencesDatastoreListener({
      onSectionsChange: (sections) => {
        this._sections = sections;
        this._loadDigestSchedules();
        this._render();
      },
      onTopicUpdate: (topic) => {
        this._updateTopicInPlace(topic);
      },
      onLoading: (isLoading) => {
        this._isLoading = isLoading;
        this._render();
      },
      onError: (error) => {
        this._error = error;
        this._render();
      },
    });
    CourierPreferencesDatastore.shared.addDatastoreListener(this._datastoreListener);

    this._authListener = Courier.shared.addAuthenticationListener(() => {
      this._refresh();
    });

    if (Courier.shared.client?.options.userId) {
      this._refresh();
    }
  }

  protected onComponentUnmounted(): void {
    this._datastoreListener?.remove();
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
    await Promise.all([
      CourierPreferencesDatastore.shared.load({ brandId: this._brandId }),
      this._brandId ? this._loadBrand() : Promise.resolve(),
    ]);
  }

  private async _loadBrand() {
    if (!this._brandId || !Courier.shared.client) return;

    try {
      this._brand = await CourierPreferencesDatastore.shared.loadBrand(this._brandId);
      this._resolvePrimaryColor();
      this._render();
    } catch {
      // Brand fetch failure is non-fatal
    }
  }

  /**
   * Precedence: user theme primaryColor > brand primaryColor > default
   * (`DEFAULT_PREFERENCES_PRIMARY_COLOR`, which matches the inbox accent).
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

  private async _loadDigestSchedules() {
    for (const section of this._sections) {
      for (const topic of section.topics) {
        if (!this._digestScheduleMap.has(topic.topicId)) {
          const schedules = await CourierPreferencesDatastore.shared.getDigestSchedules(topic.topicId);
          if (schedules.length > 0) {
            this._digestScheduleMap.set(topic.topicId, schedules);
          }
        }
      }
    }
    this._render();
  }

  private _updateTopicInPlace(topic: { topicId: string }) {
    const topicEl = this.querySelector(
      `courier-preferences-topic[data-topic-id="${CSS.escape(topic.topicId)}"]`
    ) as CourierPreferencesTopic | null;
    if (!topicEl) {
      this._render();
      return;
    }
    for (const section of this._sections) {
      const match = section.topics.find(t => t.topicId === topic.topicId);
      if (match) {
        topicEl.topic = match;
        return;
      }
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
      sectionEl.digestScheduleMap = this._digestScheduleMap;
      sectionEl.onStatusChange = (topicId: string, status: CourierUserPreferencesStatus) => {
        CourierPreferencesDatastore.shared.updateTopicStatus(topicId, status);
      };
      sectionEl.onDigestChange = (topicId: string, scheduleId: string) => {
        CourierPreferencesDatastore.shared.updateDigestSchedule(topicId, scheduleId);
      };
      sectionEl.onRoutingChange = (topicId: string, channels: CourierUserPreferencesChannel[]) => {
        CourierPreferencesDatastore.shared.updateChannelRouting(topicId, channels);
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
