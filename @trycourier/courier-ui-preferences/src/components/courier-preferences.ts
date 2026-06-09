import {
  Courier,
  CourierUserPreferencesChannel,
  CourierUserPreferencesStatus,
  CourierBrand,
  CourierPreferencePage,
  RecipientPreference,
} from "@trycourier/courier-js";
import { CourierBaseElement, CourierComponentThemeMode, registerElement, injectGlobalStyle, CourierInfoState } from "@trycourier/courier-ui-core";
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

  const titleFont = theme.title;
  const subtitleFont = theme.subtitle;

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
    }
    .courier-preferences-logo {
      display: flex;
      justify-content: flex-start;
      /* Gap to the next block (title, or topics when there is no header). */
      margin-bottom: 32px;
    }
    .courier-preferences-logo img {
      max-height: 40px;
      object-fit: contain;
    }
    .courier-preferences-header {
      display: flex;
      flex-direction: column;
      gap: 4px;
      /* Gap from the subtitle down to the topics. */
      margin-bottom: 48px;
    }
    .courier-preferences-title {
      margin: 0;
      line-height: 1.2;
      font-family: ${titleFont?.family || 'inherit'};
      font-size: ${titleFont?.size || '28px'};
      font-weight: ${titleFont?.weight || '500'};
      color: ${titleFont?.color || '#171717'};
    }
    .courier-preferences-subtitle {
      margin: 0;
      font-family: ${subtitleFont?.family || 'inherit'};
      font-size: ${subtitleFont?.size || '14px'};
      font-weight: ${subtitleFont?.weight || '400'};
      color: ${subtitleFont?.color || '#404040'};
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
      gap: 25px;
      width: 100%;
    }
    .courier-preferences-skeleton-topics {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .courier-preferences-skeleton-card {
      background: ${topic?.backgroundColor || '#FFFFFF'};
      border: ${topic?.border || 'none'};
      border-radius: ${topic?.borderRadius || '12px'};
      /* Match the running topic's height: 20px vertical padding (see
         courier-preferences-topic .courier-pref-topic) around a control row. */
      padding: 20px 0;
      box-sizing: border-box;
    }
    .courier-preferences-skeleton-card-header {
      /* Left/right padding matches the topic header; the control-row height
         (24px, the toggle) vertically centers the shimmer bar within it. */
      padding: 0 24px;
      min-height: 24px;
      display: flex;
      align-items: center;
    }
    .courier-preferences-skeleton-bar {
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
    .courier-preferences-skeleton-bar--section-title {
      width: 25%;
      height: 18px;
    }
    .courier-preferences-skeleton-bar--topic {
      width: 35%;
      height: ${barHeight};
    }
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
    return ['light-theme', 'dark-theme', 'mode', 'tenant-id', 'brand-id', 'draft', 'title', 'subtitle'];
  }

  private _themeManager = new CourierPreferencesThemeManager(defaultLightTheme);
  private _styleEl?: HTMLStyleElement;
  private _authListener?: { remove: () => void };
  private _sections: PreferencesSection[] = [];
  private _isLoading = false;
  private _error?: Error;
  private _channelLabels: Record<string, string> = {};
  private _brandId?: string;
  private _draft = false;
  private _brand?: CourierBrand;
  /** Coalesces the burst of mount + attribute-change triggers into one fetch. */
  private _refreshScheduled = false;
  /** Bumped per refresh so a stale (out-of-order) response can't paint. */
  private _refreshGeneration = 0;
  private _primaryColor = DEFAULT_PREFERENCES_PRIMARY_COLOR;
  private _title?: string;
  private _subtitle?: string;
  /** Raw, pre-merge user themes (undefined when none supplied). Kept so the
   *  brand primary can be injected only into control slots the user left unset. */
  private _userLightTheme?: CourierPreferencesTheme;
  private _userDarkTheme?: CourierPreferencesTheme;

  protected onComponentMounted(): void {
    this._title = this.getAttribute('title') || undefined;
    this._subtitle = this.getAttribute('subtitle') || undefined;
    this._brandId = this.getAttribute('brand-id') || undefined;
    this._draft = this.getAttribute('draft') === 'true';
    this._readInitialThemeAttributes();
    this._styleEl = injectGlobalStyle(STYLE_ID, getStyles(this._themeManager.getTheme()));
    this._setupThemeSubscription();

    this._authListener = Courier.shared.addAuthenticationListener(() => {
      this._scheduleRefresh();
    });

    if (Courier.shared.client?.options.userId) {
      this._scheduleRefresh();
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
          try { this._userLightTheme = JSON.parse(newValue); this._applyEffectiveThemes(); } catch { /* skip */ }
        }
        break;
      case 'dark-theme':
        if (newValue) {
          try { this._userDarkTheme = JSON.parse(newValue); this._applyEffectiveThemes(); } catch { /* skip */ }
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
          this._scheduleRefresh();
        }
        break;
      case 'draft':
        this._draft = newValue === 'true';
        if (Courier.shared.client?.options.userId) {
          this._scheduleRefresh();
        }
        break;
      case 'title':
        this._title = newValue || undefined;
        this._render();
        break;
      case 'subtitle':
        this._subtitle = newValue || undefined;
        this._render();
        break;
    }
  }

  public setLightTheme(theme: CourierPreferencesTheme) {
    this._userLightTheme = theme;
    this._applyEffectiveThemes();
  }

  public setDarkTheme(theme: CourierPreferencesTheme) {
    this._userDarkTheme = theme;
    this._applyEffectiveThemes();
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
      try { this._userLightTheme = JSON.parse(lightTheme); } catch { /* skip */ }
    }

    const darkTheme = this.getAttribute('dark-theme');
    if (darkTheme) {
      try { this._userDarkTheme = JSON.parse(darkTheme); } catch { /* skip */ }
    }

    this._applyEffectiveThemes();

    const mode = this.getAttribute('mode');
    if (mode) {
      this._themeManager.setMode(mode as CourierComponentThemeMode);
    }
  }

  /** Brand primary color, if a brand with a primary color is loaded. */
  private _brandPrimary(): string | undefined {
    return this._brand?.settings?.colors?.primary || undefined;
  }

  /**
   * Apply the brand primary to the toggle / radio / checkbox control colors.
   * When a brand is set, it overrides those three slots even if the user theme
   * sets them (precedence for these slots: brand > theme > default). The
   * top-level primaryColor only falls back to the brand when unset. Returns the
   * theme unchanged when there is no brand primary, so behavior without a brand
   * is identical to before.
   */
  private _withBrandColors(userTheme: CourierPreferencesTheme): CourierPreferencesTheme {
    const brand = this._brandPrimary();
    if (!brand) return userTheme;
    return {
      ...userTheme,
      primaryColor: userTheme.primaryColor ?? brand,
      topic: {
        ...userTheme.topic,
        toggle: {
          ...userTheme.topic?.toggle,
          trackActiveColor: brand,
        },
      },
      digest: {
        ...userTheme.digest,
        radio: {
          ...userTheme.digest?.radio,
          checkedColor: brand,
        },
      },
      channelChip: {
        ...userTheme.channelChip,
        checkbox: {
          ...userTheme.channelChip?.checkbox,
          checkedColor: brand,
        },
      },
    };
  }

  /**
   * Push the brand-aware "effective" themes into the theme manager. Passing the
   * raw user theme (or an empty object) — not the default theme — lets mergeTheme fill the
   * untouched slots with defaults while keeping the injected brand colors.
   */
  private _applyEffectiveThemes() {
    this._themeManager.setLightTheme(this._withBrandColors(this._userLightTheme ?? {}));
    this._themeManager.setDarkTheme(this._withBrandColors(this._userDarkTheme ?? {}));
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

  /**
   * Coalesce the burst of mount + attribute-change triggers (brand-id, draft,
   * auth) that fire within a single synchronous React commit into one fetch.
   * The microtask runs after the commit settles, so `_refresh()` reads the
   * final brandId/draft values and issues exactly one getPreferencePage call.
   */
  private _scheduleRefresh() {
    if (this._refreshScheduled) return;
    this._refreshScheduled = true;
    queueMicrotask(() => {
      this._refreshScheduled = false;
      this._refresh();
    });
  }

  private async _refresh() {
    const client = Courier.shared.client;
    if (!client) return;

    const generation = ++this._refreshGeneration;

    this._isLoading = true;
    this._error = undefined;
    // Only paint up front when there's nothing on screen yet (skeleton). When
    // content already exists, keep it visible until the new data arrives so a
    // re-refresh costs a single content paint instead of two.
    if (this._sections.length === 0) {
      this._render();
    }

    try {
      const pageData = await client.preferences.getPreferencePage({ brandId: this._brandId, draft: this._draft });

      // A newer refresh superseded this one while it was in flight — drop the
      // stale response so it can't paint over fresher data.
      if (generation !== this._refreshGeneration) return;

      if (pageData) {
        this._sections = this._mergePageWithPreferences(pageData, pageData.recipientPreferences);
        this._brand = pageData.brand as CourierBrand | undefined;
        // Re-apply themes now that the brand is known so its primary color flows
        // into the toggle / radio / checkbox; also refreshes _primaryColor.
        this._applyEffectiveThemes();
        this._resolvePrimaryColor();
      }
    } catch (error: unknown) {
      if (generation !== this._refreshGeneration) return;
      this._error = error as Error;
    } finally {
      if (generation === this._refreshGeneration) {
        this._isLoading = false;
        this._render();
      }
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

    // Title / subtitle header (shown in every state)
    const header = this._buildHeader();
    if (header) {
      inner.appendChild(header);
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

  private _buildHeader(): HTMLElement | null {
    if (!this._title && !this._subtitle) return null;

    const header = document.createElement('div');
    header.className = 'courier-preferences-header';

    if (this._title) {
      const title = document.createElement('h1');
      title.className = 'courier-preferences-title';
      title.textContent = this._title;
      header.appendChild(title);
    }

    if (this._subtitle) {
      const subtitle = document.createElement('p');
      subtitle.className = 'courier-preferences-subtitle';
      subtitle.textContent = this._subtitle;
      header.appendChild(subtitle);
    }

    return header;
  }

  private _buildSkeleton(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'courier-preferences-skeleton';

    const titleBar = document.createElement('div');
    titleBar.className = 'courier-preferences-skeleton-bar courier-preferences-skeleton-bar--section-title';
    container.appendChild(titleBar);

    const topicsContainer = document.createElement('div');
    topicsContainer.className = 'courier-preferences-skeleton-topics';

    for (let i = 0; i < 3; i++) {
      const card = document.createElement('div');
      card.className = 'courier-preferences-skeleton-card';

      const header = document.createElement('div');
      header.className = 'courier-preferences-skeleton-card-header';

      const bar = document.createElement('div');
      bar.className = 'courier-preferences-skeleton-bar courier-preferences-skeleton-bar--topic';
      header.appendChild(bar);
      card.appendChild(header);

      topicsContainer.appendChild(card);
    }

    container.appendChild(topicsContainer);
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
    const emptyTheme = theme.empty;

    const emptyState = new CourierInfoState({
      title: {
        text: emptyTheme?.title?.text ?? 'No preferences available',
        textColor: emptyTheme?.title?.font?.color,
        fontSize: emptyTheme?.title?.font?.size,
        fontWeight: emptyTheme?.title?.font?.weight,
        fontFamily: emptyTheme?.title?.font?.family,
      },
      button: {
        mode: 'system',
        text: emptyTheme?.button?.text ?? 'Refresh',
        backgroundColor: emptyTheme?.button?.backgroundColor ?? '#171717',
        hoverBackgroundColor: emptyTheme?.button?.hoverBackgroundColor,
        textColor: emptyTheme?.button?.font?.color ?? '#FFFFFF',
        fontSize: emptyTheme?.button?.font?.size ?? '14px',
        fontWeight: emptyTheme?.button?.font?.weight ?? '500',
        fontFamily: emptyTheme?.button?.font?.family ?? 'inherit',
        border: emptyTheme?.button?.border ?? 'none',
        borderRadius: emptyTheme?.button?.borderRadius ?? '8px',
        onClick: () => { this._refresh(); },
      },
    });
    emptyState.build(undefined);
    return emptyState;
  }
}

registerElement(CourierPreferences);
