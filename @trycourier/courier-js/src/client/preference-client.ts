import {
  CourierDigestScheduleOption,
  CourierPreferencePage,
  CourierPreferencePageSection,
  CourierPreferencePageTopic,
  CourierUserPreferences,
  CourierUserPreferencesChannel,
  CourierUserPreferencesStatus,
  CourierUserPreferencesTopic,
  RecipientPreference,
} from '../types/preference';
import { decode, encode } from '../utils/coding';
import { graphql } from '../utils/request';
import { Client } from './client';

export class PreferenceClient extends Client {
  /**
   * Get all preferences for a user
   * @param paginationCursor - Optional cursor for pagination (not used in GraphQL implementation)
   * @returns Promise resolving to user preferences
   */
  public async getUserPreferences(props?: { paginationCursor?: string; }): Promise<CourierUserPreferences> {
    const query = `
      query GetRecipientPreferences {
        recipientPreferences${this.options.tenantId ? `(accountId: "${this.options.tenantId}")` : ''} {
          nodes {
            templateId
            templateName
            sectionId
            sectionName
            defaultStatus
            status
            hasCustomRouting
            routingPreferences
            digestSchedule
          }
        }
      }
    `;

    const response = await graphql({
      options: this.options,
      url: this.options.apiUrls.courier.graphql,
      query,
      headers: {
        'x-courier-user-id': this.options.userId,
        'x-courier-client-key': 'empty', // Empty for now. Will be removed in future.
        'Authorization': `Bearer ${this.options.accessToken}`
      },
    });

    const nodes: RecipientPreference[] = response.data?.recipientPreferences?.nodes || [];

    return {
      items: nodes.map(node => this.transformToTopic(node)),
      paging: {
        cursor: props?.paginationCursor,
        more: false // GraphQL returns all preferences at once
      }
    };
  }

  /**
   * Get preferences for a specific topic
   * @param topicId - The ID of the topic to get preferences for
   * @returns Promise resolving to topic preferences
   */
  public async getUserPreferenceTopic(props: { topicId: string; }): Promise<CourierUserPreferencesTopic> {
    const query = `
      query GetRecipientPreferenceTopic {
        recipientPreference(templateId: "${props.topicId}"${this.options.tenantId ? `, accountId: "${this.options.tenantId}"` : ''}) {
          templateId
          templateName
          status
          hasCustomRouting
          routingPreferences
          digestSchedule
          sectionId
          sectionName
          defaultStatus
        }
      }
    `;

    const response = await graphql({
      options: this.options,
      url: this.options.apiUrls.courier.graphql,
      query,
      headers: {
        'x-courier-user-id': this.options.userId,
        'x-courier-client-key': 'empty', // Empty for now. Will be removed in future.
        'Authorization': `Bearer ${this.options.accessToken}`
      },
    });

    const node: RecipientPreference = response.data?.recipientPreference;

    if (!node) {
      throw new Error(`Preference topic not found: ${props.topicId}`);
    }

    return this.transformToTopic(node);
  }

  /**
   * Update preferences for a specific topic
   * @param topicId - The ID of the topic to update preferences for
   * @param status - The new status for the topic
   * @param hasCustomRouting - Whether the topic has custom routing
   * @param customRouting - The custom routing channels for the topic
   * @returns Promise resolving to the updated topic preferences
   */
  public async putUserPreferenceTopic(props: { topicId: string; status: CourierUserPreferencesStatus; hasCustomRouting: boolean; customRouting: CourierUserPreferencesChannel[]; digestSchedule?: string; }): Promise<CourierUserPreferencesTopic> {
    const routingPreferences = props.customRouting.length > 0
      ? `[${props.customRouting.join(', ')}]`
      : '[]';

    const digestScheduleLine = props.digestSchedule != null
      ? `\n            digestSchedule: "${props.digestSchedule}"`
      : '';

    const query = `
      mutation UpdateRecipientPreferenceV2 {
        updatePreferenceV2(
          templateId: "${props.topicId}",
          preferences: {
            status: ${props.status},
            hasCustomRouting: ${props.hasCustomRouting},
            routingPreferences: ${routingPreferences}${digestScheduleLine}
          }${this.options.tenantId ? `, accountId: "${this.options.tenantId}"` : ''}
        ) {
          templateId
          templateName
          status
          hasCustomRouting
          routingPreferences
          digestSchedule
          sectionId
          sectionName
          defaultStatus
        }
      }
    `;

    const response = await graphql({
      options: this.options,
      url: this.options.apiUrls.courier.graphql,
      query,
      headers: {
        'x-courier-user-id': this.options.userId,
        'x-courier-client-key': 'empty', // Empty for now. Will be removed in future.
        'Authorization': `Bearer ${this.options.accessToken}`
      },
    });

    const node: RecipientPreference = response.data?.updatePreferenceV2;
    return this.transformToTopic(node);
  }

  /**
   * Get the published preference page for the current workspace.
   *
   * Returns workspace-configured sections, topics, channel label mappings,
   * and optional brand metadata. Combine with `getUserPreferences()` to
   * overlay the user's current per-topic preferences (status, custom routing,
   * digest schedule).
   *
   * @param accountId - Optional account/tenant ID. Falls back to the client's tenantId.
   * @param brandId - Optional brand ID to resolve brand colors/logo/links inline.
   * @returns The published preference page, or `null` if none is published.
   */
  public async getPreferencePage(props?: { accountId?: string; brandId?: string; draft?: boolean }): Promise<CourierPreferencePage | null> {
    const accountId = props?.accountId ?? this.options.tenantId;
    const brandId = props?.brandId;
    const draft = props?.draft ?? false;

    const accountArg = accountId ? `(accountId: "${accountId}")` : '';
    // In draft mode, read the unpublished working draft (`draftPreferencePage`,
    // which takes no account arg) instead of the published `preferencePage`.
    const pageField = draft ? 'draftPreferencePage' : `preferencePage${accountArg}`;
    // Only request the brand when a brand id is provided. An absent/empty id
    // means "no brand" (the page's brand setting is "none"): querying `brand`
    // with no id makes the API fall back to the workspace default brand, which
    // would wrongly re-apply the default brand after the user removed it. The
    // "default" setting is resolved to a concrete brand id upstream, so it still
    // arrives here as an id and is requested normally.
    const brandFragment = brandId
      ? `
        brand(brandId: "${brandId}") {
          settings {
            colors {
              primary
            }
          }
          links
          logo {
            href
            image
          }
        }`
      : '';

    const query = `
      query GetPreferencePage {
        ${pageField} {
          showCourierFooter
          heading
          description
          ${brandFragment}
          channelConfigs {
            channelLabels {
              channel
              name
            }
          }
          sections {
            nodes {
              name
              description
              sectionId
              routingOptions
              hasCustomRouting
              topics {
                nodes {
                  data
                  defaultStatus
                  description
                  templateName
                  templateId
                  digestSchedules
                }
              }
            }
          }
        }
        recipientPreferences${accountId ? `(accountId: "${accountId}")` : ''} {
          nodes {
            templateId
            status
            hasCustomRouting
            routingPreferences
            digestSchedule
          }
        }
      }
    `;

    const response = await graphql({
      options: this.options,
      url: this.options.apiUrls.courier.graphql,
      query,
      headers: {
        'x-courier-user-id': this.options.userId,
        'x-courier-client-key': 'empty',
        'Authorization': `Bearer ${this.options.accessToken}`,
      },
    });

    const page = draft ? response.data?.draftPreferencePage : response.data?.preferencePage;
    if (!page) return null;

    const recipientPreferences: RecipientPreference[] =
      response.data?.recipientPreferences?.nodes || [];

    return this.transformPreferencePage(page, recipientPreferences);
  }

  /**
   * Get the available digest schedules for a specific topic
   * @param topicId - The ID of the topic to get digest schedules for
   * @returns Promise resolving to an array of available digest schedule options
   */
  public async getDigestSchedules(props: { topicId: string }): Promise<CourierDigestScheduleOption[]> {
    const query = `
      query GetDigestSchedulesForTopic {
        digestSchedulesForTopic(templateId: "${props.topicId}") {
          scheduleId
          period
          recurrence
          repeat
          repetition
          start
          default
        }
      }
    `;

    const response = await graphql({
      options: this.options,
      url: this.options.apiUrls.courier.graphql,
      query,
      headers: {
        'x-courier-user-id': this.options.userId,
        'x-courier-client-key': 'empty',
        'Authorization': `Bearer ${this.options.accessToken}`
      },
    });

    return response.data?.digestSchedulesForTopic || [];
  }

  /**
   * @deprecated The clientKey parameter is deprecated and will be removed in a future release.
   *
   * Get the notification center URL
   * @param clientKey - The client key to use for the URL
   * @returns The notification center URL
   */
  public getNotificationCenterUrl(props: {
    clientKey: string;
  }): string {
    this.options.logger.warn('Courier Warning: The clientKey parameter in getNotificationCenterUrl is deprecated and will be removed in a future release.');
    const rootTenantId = decode(props.clientKey);
    const url = encode(`${rootTenantId}#${this.options.userId}${this.options.tenantId ? `#${this.options.tenantId}` : ""}#${false}`);
    return `https://view.notificationcenter.app/p/${url}`;
  }

  /**
   * Transform a GraphQL RecipientPreference node to CourierUserPreferencesTopic
   */
  private transformToTopic(node: RecipientPreference): CourierUserPreferencesTopic {
    return {
      topicId: node.templateId,
      topicName: node.templateName || '',
      sectionId: node.sectionId || '',
      sectionName: node.sectionName || '',
      status: (node.status as CourierUserPreferencesStatus) || 'UNKNOWN',
      defaultStatus: (node.defaultStatus as CourierUserPreferencesStatus) || 'UNKNOWN',
      hasCustomRouting: node.hasCustomRouting || false,
      customRouting: (node.routingPreferences || []) as CourierUserPreferencesChannel[],
      digestSchedule: node.digestSchedule,
    };
  }

  /**
   * Transform a raw `preferencePage` GraphQL response into the public shape.
   */
  private transformPreferencePage(page: any, recipientPreferences: RecipientPreference[] = []): CourierPreferencePage {
    const rawSections = page?.sections?.nodes ?? [];
    const sections: CourierPreferencePageSection[] = rawSections.map((section: any) => {
      const rawTopics = section?.topics?.nodes ?? [];
      const topics: CourierPreferencePageTopic[] = rawTopics.map((topic: any) => ({
        templateId: topic.templateId,
        templateName: topic.templateName ?? '',
        defaultStatus: (topic.defaultStatus as CourierUserPreferencesStatus) ?? 'UNKNOWN',
        description: topic.description ?? undefined,
        data: topic.data,
        digestSchedules: (topic.digestSchedules ?? undefined) as CourierDigestScheduleOption[] | undefined,
      }));
      return {
        sectionId: section.sectionId,
        name: section.name ?? '',
        description: section.description ?? undefined,
        hasCustomRouting: Boolean(section.hasCustomRouting),
        routingOptions: (section.routingOptions ?? []) as CourierUserPreferencesChannel[],
        topics,
      };
    });

    return {
      showCourierFooter: Boolean(page?.showCourierFooter),
      heading: page?.heading ?? '',
      description: page?.description ?? '',
      brand: page?.brand ?? null,
      channelConfigs: page?.channelConfigs ?? null,
      sections,
      recipientPreferences,
    };
  }
}
