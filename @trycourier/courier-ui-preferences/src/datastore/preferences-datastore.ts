import {
  Courier,
  CourierUserPreferencesStatus,
  CourierUserPreferencesChannel,
  CourierUserPreferencesTopic,
  CourierDigestScheduleOption,
  CourierBrand,
  CourierPreferencePage,
} from "@trycourier/courier-js";
import { PreferencesSection, PreferencesTopic } from "../types/preferences";
import { CourierPreferencesDatastoreListener } from "./preferences-datastore-listener";

/**
 * Shared datastore for Courier notification preferences.
 *
 * Fetches, caches, and mutates user preference data using the courier-js PreferenceClient.
 * Groups flat topic preferences into sections.
 *
 * @public
 */
export class CourierPreferencesDatastore {
  private static instance: CourierPreferencesDatastore;

  private _sections: PreferencesSection[] = [];
  private _isLoading = false;
  private _listeners: CourierPreferencesDatastoreListener[] = [];
  private _digestScheduleCache: Map<string, CourierDigestScheduleOption[]> = new Map();
  private _brandCache: Map<string, CourierBrand> = new Map();

  public static get shared(): CourierPreferencesDatastore {
    if (!CourierPreferencesDatastore.instance) {
      CourierPreferencesDatastore.instance = new CourierPreferencesDatastore();
    }
    return CourierPreferencesDatastore.instance;
  }

  public get sections(): PreferencesSection[] {
    return this._sections;
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public addDatastoreListener(listener: CourierPreferencesDatastoreListener) {
    this._listeners.push(listener);
  }

  public removeDatastoreListener(listener: CourierPreferencesDatastoreListener) {
    this._listeners = this._listeners.filter(l => l !== listener);
  }

  /**
   * Load all preferences and group by section.
   *
   * Calls the workspace `preferencePage` (for section-level routing options,
   * digest schedules, topic ordering and labels) and `recipientPreferences`
   * (for the user's current status / custom routing / digest schedule) in
   * parallel, then merges them. If the preference page is unpublished or
   * unavailable, falls back to a sections list synthesized from the recipient
   * preferences alone.
   *
   * @param brandId - Optional brand id; forwarded to the preference page query.
   */
  public async load(props?: { brandId?: string }): Promise<void> {
    const client = Courier.shared.client;
    if (!client) {
      this._notifyError(new Error('Courier client not initialized. Call Courier.shared.signIn() first.'));
      return;
    }

    this._isLoading = true;
    this._notifyLoading(true);

    try {
      const [pageResult, prefsResult] = await Promise.all([
        client.preferences.getPreferencePage({ brandId: props?.brandId }).catch((): CourierPreferencePage | null => null),
        client.preferences.getUserPreferences(),
      ]);

      this._sections = pageResult
        ? this._mergePageWithPreferences(pageResult, prefsResult.items)
        : this._groupBySection(prefsResult.items);

      // Seed the digest schedule cache from the page payload so the UI doesn't
      // need to make a per-topic request.
      if (pageResult) {
        for (const section of pageResult.sections) {
          for (const topic of section.topics) {
            if (topic.digestSchedules && topic.digestSchedules.length > 0) {
              this._digestScheduleCache.set(topic.templateId, topic.digestSchedules);
            }
          }
        }
      }

      this._listeners.forEach(l => l.events.onSectionsChange?.(this._sections));
    } catch (error: unknown) {
      this._notifyError(error as Error);
    } finally {
      this._isLoading = false;
      this._notifyLoading(false);
    }
  }

  /**
   * Update a topic's opt-in/out status with optimistic UI.
   */
  public async updateTopicStatus(topicId: string, status: CourierUserPreferencesStatus): Promise<void> {
    const { topic, sectionId, snapshot } = this._findTopicAndSnapshot(topicId);
    if (!topic) return;

    topic.status = status;
    this._notifyTopicUpdate(topic, sectionId);

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
      this._notifyError(error as Error);
    }
  }

  /**
   * Update a topic's digest schedule with optimistic UI.
   */
  public async updateDigestSchedule(topicId: string, scheduleId: string): Promise<void> {
    const { topic, sectionId, snapshot } = this._findTopicAndSnapshot(topicId);
    if (!topic) return;

    const previousSchedule = topic.digestSchedule;
    topic.digestSchedule = scheduleId;
    this._notifyTopicUpdate(topic, sectionId);

    try {
      await Courier.shared.client!.preferences.putUserPreferenceTopic({
        topicId,
        status: topic.status,
        hasCustomRouting: topic.hasCustomRouting,
        customRouting: topic.customRouting,
        digestSchedule: scheduleId,
      });
    } catch (error: unknown) {
      topic.digestSchedule = previousSchedule;
      this._restoreSnapshot(snapshot);
      this._notifyError(error as Error);
    }
  }

  /**
   * Update a topic's channel routing with optimistic UI.
   */
  public async updateChannelRouting(topicId: string, channels: CourierUserPreferencesChannel[]): Promise<void> {
    const { topic, sectionId, snapshot } = this._findTopicAndSnapshot(topicId);
    if (!topic) return;

    const previousRouting = [...topic.customRouting];
    const previousHasCustom = topic.hasCustomRouting;
    topic.customRouting = channels;
    topic.hasCustomRouting = channels.length > 0;
    this._notifyTopicUpdate(topic, sectionId);

    try {
      await Courier.shared.client!.preferences.putUserPreferenceTopic({
        topicId,
        status: topic.status,
        hasCustomRouting: topic.hasCustomRouting,
        customRouting: channels,
        digestSchedule: topic.digestSchedule,
      });
    } catch (error: unknown) {
      topic.customRouting = previousRouting;
      topic.hasCustomRouting = previousHasCustom;
      this._restoreSnapshot(snapshot);
      this._notifyError(error as Error);
    }
  }

  /**
   * Fetch digest schedule options for a topic. Results are cached.
   */
  public async getDigestSchedules(topicId: string): Promise<CourierDigestScheduleOption[]> {
    const cached = this._digestScheduleCache.get(topicId);
    if (cached) return cached;

    try {
      const schedules = await Courier.shared.client!.preferences.getDigestSchedules({ topicId });
      this._digestScheduleCache.set(topicId, schedules);
      return schedules;
    } catch {
      return [];
    }
  }

  /**
   * Fetch and cache a brand by ID.
   */
  public async loadBrand(brandId: string): Promise<CourierBrand> {
    const cached = this._brandCache.get(brandId);
    if (cached) return cached;

    const brand = await Courier.shared.client!.brands.getBrand({ brandId });
    this._brandCache.set(brandId, brand);
    return brand;
  }

  private _groupBySection(topics: CourierUserPreferencesTopic[]): PreferencesSection[] {
    const sectionMap = new Map<string, PreferencesSection>();

    for (const topic of topics) {
      const key = topic.sectionId || '__default__';
      let section = sectionMap.get(key);

      if (!section) {
        section = {
          sectionId: topic.sectionId,
          sectionName: topic.sectionName,
          hasCustomRouting: false,
          routingOptions: [],
          topics: [],
        };
        sectionMap.set(key, section);
      }

      section.topics.push({
        topicId: topic.topicId,
        topicName: topic.topicName,
        status: topic.status,
        defaultStatus: topic.defaultStatus,
        hasCustomRouting: topic.hasCustomRouting,
        customRouting: topic.customRouting,
        digestSchedule: topic.digestSchedule,
      });
    }

    return Array.from(sectionMap.values());
  }

  /**
   * Merge the workspace's published preference page (which carries the
   * authoritative section-level `hasCustomRouting`, `routingOptions`, topic
   * order, default statuses, and digest schedule options) with the user's
   * current preferences (status / custom routing / selected digest).
   */
  private _mergePageWithPreferences(
    page: CourierPreferencePage,
    userTopics: CourierUserPreferencesTopic[]
  ): PreferencesSection[] {
    const userTopicById = new Map<string, CourierUserPreferencesTopic>();
    for (const topic of userTopics) {
      userTopicById.set(topic.topicId, topic);
    }

    return page.sections.map(section => ({
      sectionId: section.sectionId,
      sectionName: section.name,
      hasCustomRouting: section.hasCustomRouting,
      routingOptions: section.routingOptions,
      topics: section.topics.map(topic => {
        const userTopic = userTopicById.get(topic.templateId);
        const status: CourierUserPreferencesStatus =
          userTopic?.status && userTopic.status !== 'UNKNOWN'
            ? userTopic.status
            : topic.defaultStatus;

        // Mirror the reference page's defaulting:
        //   - If the user has explicit custom routing, use it.
        //   - Otherwise, when the topic is not opted out, treat every channel
        //     in the section as enabled by default; opted-out topics start empty.
        const hasUserRouting = Boolean(userTopic?.hasCustomRouting) && (userTopic?.customRouting?.length ?? 0) > 0;
        const defaultAllOn = topic.defaultStatus !== 'OPTED_OUT';
        const customRouting: CourierUserPreferencesChannel[] = hasUserRouting
          ? userTopic!.customRouting
          : defaultAllOn
            ? [...section.routingOptions]
            : [];

        return {
          topicId: topic.templateId,
          topicName: topic.templateName,
          status,
          defaultStatus: topic.defaultStatus,
          hasCustomRouting: userTopic?.hasCustomRouting ?? false,
          customRouting,
          digestSchedule: userTopic?.digestSchedule,
        };
      }),
    }));
  }

  private _findTopicAndSnapshot(topicId: string): {
    topic: PreferencesTopic | undefined;
    sectionId: string;
    snapshot: PreferencesSection[];
  } {
    const snapshot = JSON.parse(JSON.stringify(this._sections)) as PreferencesSection[];
    for (const section of this._sections) {
      const topic = section.topics.find(t => t.topicId === topicId);
      if (topic) {
        return { topic, sectionId: section.sectionId, snapshot };
      }
    }
    return { topic: undefined, sectionId: '', snapshot };
  }

  private _restoreSnapshot(snapshot: PreferencesSection[]) {
    this._sections = snapshot;
    this._listeners.forEach(l => l.events.onSectionsChange?.(this._sections));
  }

  private _notifyTopicUpdate(topic: PreferencesTopic, sectionId: string) {
    this._listeners.forEach(l => l.events.onTopicUpdate?.(topic, sectionId));
  }

  private _notifyLoading(isLoading: boolean) {
    this._listeners.forEach(l => l.events.onLoading?.(isLoading));
  }

  private _notifyError(error: Error) {
    this._listeners.forEach(l => l.events.onError?.(error));
  }

  private constructor() {}
}
