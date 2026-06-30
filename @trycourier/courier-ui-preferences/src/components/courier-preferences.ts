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

  return `
    courier-preferences .courier-preferences-root {
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
    courier-preferences .courier-preferences-inner {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    courier-preferences .courier-preferences-logo {
      display: flex;
      justify-content: flex-start;
    }
    courier-preferences .courier-preferences-logo img {
      max-height: 40px;
      object-fit: contain;
    }
    courier-preferences .courier-preferences-sections {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    /* Skeleton loading */
    courier-preferences .courier-preferences-skeleton {
      display: flex;
      flex-direction: column;
      gap: 20px;
      width: 100%;
    }
    courier-preferences .courier-preferences-skeleton-topics {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    courier-preferences .courier-preferences-skeleton-card {
      background: ${topic?.backgroundColor || '#FFFFFF'};
      border: ${topic?.border || 'none'};
      border-radius: ${topic?.borderRadius || '12px'};
      padding: 26px 0;
      box-sizing: border-box;
    }
    courier-preferences .courier-preferences-skeleton-card-header {
      padding: 0 24px;
      display: flex;
      align-items: center;
    }
    courier-preferences .courier-preferences-skeleton-bar {
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
    courier-preferences .courier-preferences-skeleton-bar--section-title {
      width: 25%;
      height: 18px;
    }
    courier-preferences .courier-preferences-skeleton-bar--topic {
      width: 35%;
      height: ${barHeight};
    }
    @keyframes courier-preferences-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Info state (error / empty) */
    courier-preferences .courier-preferences-info-state {
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
    courier-preferences .courier-preferences-info-state-title {
      margin: 0;
    }
    courier-preferences .courier-preferences-info-state-button {
      cursor: pointer;
      padding: 10px 20px;
      transition: background-color 150ms ease, opacity 150ms ease;
    }
    courier-preferences .courier-preferences-info-state-button:focus {
      outline: none;
    }

    courier-preferences .courier-preferences-error-title {
      color: ${errorTitle?.color || '#171717'};
      font-size: ${errorTitle?.size || '16px'};
      font-weight: ${errorTitle?.weight || '500'};
      font-family: ${errorTitle?.family || 'inherit'};
    }
    courier-preferences .courier-preferences-error-button {
      background-color: ${errorButtonBg};
      color: ${errorButtonFont?.color || '#FFFFFF'};
      font-size: ${errorButtonFont?.size || '14px'};
      font-weight: ${errorButtonFont?.weight || '500'};
      font-family: ${errorButtonFont?.family || 'inherit'};
      border: ${errorButton?.border || 'none'};
      border-radius: ${errorButton?.borderRadius || '8px'};
    }
    courier-preferences .courier-preferences-error-button:hover {
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
    return ['light-theme', 'dark-theme', 'mode', 'tenant-id', 'brand-id', 'preview', 'title', 'subtitle', 'draft'];
  }

  private _themeManager = new CourierPreferencesThemeManager(defaultLightTheme);
  private _styleEl?: HTMLStyleElement;
  private _authListener?: { remove: () => void };
  private _sections: PreferencesSection[] = [];
  private _isLoading = false;
  /**
   * Externally-forced loading state (via {@link setLoading}). Independent of the
   * network-fetch `_isLoading` so a host can show the loading skeleton on demand
   * — e.g. while it swaps the injected preview/brand data — even when sections
   * are already present.
   */
  private _forceLoading = false;
  private _error?: Error;
  private _channelLabels: Record<string, string> = {};
  private _brandId?: string;
  private _brand?: CourierBrand;
  private _primaryColor = DEFAULT_PREFERENCES_PRIMARY_COLOR;
  /** When true, render injected preview data and skip all network fetches. */
  private _isPreview = false;
  /** When true, fetch the unpublished working draft instead of the published page. */
  private _draft = false;
  /** Guards {@link _scheduleRefresh} so a burst of attribute writes coalesces into one fetch. */
  private _refreshScheduled = false;
  /** Optional header shown above the sections. */
  private _title?: string;
  private _subtitle?: string;
  /**
   * Workspace-configured page heading/description from the fetched page. Used as
   * a fallback for the header when the host hasn't set the `title`/`subtitle`
   * attributes (which take precedence).
   */
  private _pageHeading?: string;
  private _pageDescription?: string;

  protected onComponentMounted(): void {
    this._isPreview = this.hasAttribute('preview') && this.getAttribute('preview') !== 'false';
    this._draft = this.hasAttribute('draft') && this.getAttribute('draft') !== 'false';
    this._title = this.getAttribute('title') ?? undefined;
    this._subtitle = this.getAttribute('subtitle') ?? undefined;
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
          this._scheduleRefresh();
        }
        break;
      case 'preview':
        this._isPreview = newValue != null && newValue !== 'false';
        break;
      case 'draft':
        this._draft = newValue != null && newValue !== 'false';
        if (Courier.shared.client?.options.userId) {
          this._scheduleRefresh();
        }
        break;
      case 'title':
        this._title = newValue ?? undefined;
        this._render();
        break;
      case 'subtitle':
        this._subtitle = newValue ?? undefined;
        this._render();
        break;
    }
  }

  /**
   * Render injected "dummy" preference data and skip all network fetches. Pass a
   * full {@link CourierPreferencePage} (same shape `getPreferencePage()` returns);
   * it is merged through the normal pipeline. Pass `null` to clear preview mode.
   */
  public setPreviewData(page: CourierPreferencePage | null) {
    this._isPreview = Boolean(page);
    if (page) {
      const merged = this._mergePageWithPreferences(page, page.recipientPreferences);
      // Carry the recipient's transient, in-preview routing choices (whether
      // they expanded "Customize channels" and which channels they ticked) over
      // to the rebuilt sections. The host (the preferences editor) recreates the
      // injected page on every edit — a channel toggle, or even a keystroke in
      // the heading — so without this each rebuild would reset
      // `hasCustomRouting` back to its default and collapse the expanded
      // section. Matched by topic id; only meaningful in preview, where there
      // are no server-side recipient preferences to be the source of truth.
      this._preserveRecipientRoutingState(merged, this._sections);
      this._sections = merged;
      this._brand = page.brand as CourierBrand | undefined;
      this._applyChannelLabelsFromPage(page);
      this._applyHeaderFromPage(page);
      this._isLoading = false;
      this._error = undefined;
      this._resolvePrimaryColor();
    } else {
      this._sections = [];
    }
    this._render();
  }

  /**
   * Copy the recipient's transient routing state — `hasCustomRouting` (the
   * "Customize channels" expand) and `customRouting` (the ticked channels) —
   * from the previous sections onto the freshly-merged ones, matched by topic
   * id. Used by {@link setPreviewData} so re-rendering the injected preview
   * (which happens on every editor edit) doesn't discard what the recipient
   * toggled in the live preview. Channel/topic/section *definitions* still come
   * from the new page; only the per-topic recipient selections are preserved.
   */
  private _preserveRecipientRoutingState(
    next: PreferencesSection[],
    prev: PreferencesSection[]
  ): void {
    if (prev.length === 0) return;
    const prevTopicById = new Map<string, PreferencesTopic>();
    for (const section of prev) {
      for (const topic of section.topics) {
        prevTopicById.set(topic.topicId, topic);
      }
    }
    for (const section of next) {
      for (const topic of section.topics) {
        const prevTopic = prevTopicById.get(topic.topicId);
        if (!prevTopic) continue;
        topic.hasCustomRouting = prevTopic.hasCustomRouting;
        topic.customRouting = prevTopic.customRouting;
      }
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

  /**
   * Force the loading skeleton on or off, regardless of preview/fetch state.
   * Useful when the host is fetching data it will inject via
   * {@link setPreviewData} (e.g. a brand) and wants the component's own loading
   * state shown in the meantime.
   */
  public setLoading(loading: boolean) {
    if (this._forceLoading === loading) return;
    this._forceLoading = loading;
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

  /**
   * Coalesce refresh requests into a single microtask. A host framework (e.g.
   * React) sets the element's attributes one at a time on mount — `brand-id`
   * before `draft` — and each observed-attribute change would otherwise trigger
   * its own {@link _refresh}. The first (brand-id) would fetch with `_draft`
   * still `false` (the published page) and the second (`draft`) would fetch the
   * draft, so the published content flashes before the draft replaces it.
   * Deferring to a microtask lets all synchronous attribute writes settle, then
   * fetches once with the final `_brandId`/`_draft`.
   */
  private _scheduleRefresh() {
    if (this._refreshScheduled) return;
    this._refreshScheduled = true;
    void Promise.resolve().then(() => {
      this._refreshScheduled = false;
      void this._refresh();
    });
  }

  private async _refresh() {
    if (this._isPreview) return;
    const client = Courier.shared.client;
    if (!client) return;

    this._isLoading = true;
    this._error = undefined;
    this._render();

    try {
      const pageData = await client.preferences.getPreferencePage({ brandId: this._brandId, draft: this._draft });

      if (pageData) {
        this._sections = this._mergePageWithPreferences(pageData, pageData.recipientPreferences);
        this._brand = pageData.brand as CourierBrand | undefined;
        this._applyChannelLabelsFromPage(pageData);
        this._applyHeaderFromPage(pageData);
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
   * Populate the channel-label lookup the routing chips read from, using the
   * page's `channelConfigs`. Lets a workspace rename channels (e.g. "Email" ->
   * "Product updates"); an empty name is skipped so the chip falls back to the
   * channel's default label. A missing `channelConfigs` leaves any labels set
   * imperatively via {@link setChannelLabels} untouched.
   */
  private _applyChannelLabelsFromPage(page: CourierPreferencePage) {
    const labels = page.channelConfigs?.channelLabels;
    if (!labels) return;
    this._channelLabels = labels.reduce<Record<string, string>>((acc, { channel, name }) => {
      if (name) acc[channel] = name;
      return acc;
    }, {});
  }

  /**
   * Capture the workspace-configured page heading/description so the header can
   * fall back to them when the host hasn't set `title`/`subtitle` attributes.
   */
  private _applyHeaderFromPage(page: CourierPreferencePage) {
    this._pageHeading = page.heading || undefined;
    this._pageDescription = page.description || undefined;
  }

  /**
   * Precedence: brand primaryColor > user theme primaryColor > default.
   * The selected brand wins so it colors the controls (e.g. the toggle track)
   * even when the host passes a themed primary as its unbranded fallback.
   */
  private _resolvePrimaryColor() {
    const theme = this._themeManager.getTheme();
    const brandPrimary = this._brand?.settings?.colors?.primary;
    const themePrimary = theme.primaryColor;
    const defaultPrimary = DEFAULT_PREFERENCES_PRIMARY_COLOR;

    if (brandPrimary) {
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
      description: section.description,
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
          description: topic.description,
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
    if (this._isPreview) return;

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
    if (this._isPreview) return;

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
    topic.hasCustomRouting = true;
    this._updateTopicInPlace(topic);
    if (this._isPreview) return;

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

  private async _updateCustomizeEnabled(topicId: string, enabled: boolean): Promise<void> {
    const { topic, snapshot } = this._findTopicAndSnapshot(topicId);
    if (!topic) return;

    topic.hasCustomRouting = enabled;
    // When the user first enables customization, seed the selection with every
    // routing option so nothing is silently dropped.
    if (enabled && topic.customRouting.length === 0) {
      const section = this._sections.find(s => s.topics.some(t => t.topicId === topicId));
      if (section) topic.customRouting = [...section.routingOptions];
    }
    this._updateTopicInPlace(topic);
    if (this._isPreview) return;

    try {
      await Courier.shared.client!.preferences.putUserPreferenceTopic({
        topicId,
        status: topic.status,
        hasCustomRouting: enabled,
        customRouting: topic.customRouting,
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

    // Loading (forced via setLoading, or the network fetch with no data yet)
    if (this._forceLoading || (this._isLoading && this._sections.length === 0)) {
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

    // Header (optional title / subtitle above the sections). The `title` /
    // `subtitle` attributes set by the host take precedence; otherwise fall back
    // to the workspace-configured page heading / description.
    const headerTitle = this._title ?? this._pageHeading;
    const headerSubtitle = this._subtitle ?? this._pageDescription;
    if (headerTitle || headerSubtitle) {
      const header = document.createElement('div');
      header.className = 'courier-preferences-header';
      header.style.marginBottom = '16px';
      if (headerTitle) {
        const titleEl = document.createElement('h2');
        titleEl.className = 'courier-preferences-header-title';
        titleEl.textContent = headerTitle;
        titleEl.style.margin = '0';
        titleEl.style.fontSize = '20px';
        titleEl.style.fontWeight = '600';
        titleEl.style.lineHeight = '1.3';
        header.appendChild(titleEl);
      }
      if (headerSubtitle) {
        const subtitleEl = document.createElement('p');
        subtitleEl.className = 'courier-preferences-header-subtitle';
        subtitleEl.textContent = headerSubtitle;
        subtitleEl.style.margin = headerTitle ? '4px 0 0' : '0';
        subtitleEl.style.fontSize = '14px';
        subtitleEl.style.lineHeight = '1.5';
        // Page-header description color comes from the `subtitle` theme token
        // (rather than a flat opacity). Its default is set to the section
        // description color, so the header description and section descriptions
        // read as the same gray unless a theme overrides `subtitle`.
        subtitleEl.style.color =
          this._themeManager.getTheme().subtitle?.color || '#737373';
        header.appendChild(subtitleEl);
      }
      inner.appendChild(header);
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
      sectionEl.onCustomizeChange = (topicId: string, enabled: boolean) => {
        this._updateCustomizeEnabled(topicId, enabled);
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
