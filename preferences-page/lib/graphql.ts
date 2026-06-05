import type {
  PreferencePage,
  RecipientPreference,
  AuthContext,
} from "./types";

const PREFERENCE_PAGE_QUERY = `
  query($accountId: String, $brandId: String) {
    preferencePage(accountId: $accountId) {
      showCourierFooter
      brand(brandId: $brandId) {
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
      }
      channelConfigs {
        channelLabels {
          channel
          name
        }
      }
      sections {
        nodes {
          name
          sectionId
          routingOptions
          hasCustomRouting
          topics {
            nodes {
              defaultStatus
              templateName
              templateId
              digestSchedules
            }
          }
        }
      }
    }
  }
`;

const RECIPIENT_PREFERENCES_QUERY = `
  query GetRecipientPreferences($accountId: String) {
    recipientPreferences(accountId: $accountId) {
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

const UPDATE_RECIPIENT_PREFERENCES_MUTATION = `
  mutation UpdateRecipientPreferences($id: String!, $preferences: PreferencesInput!, $accountId: String) {
    updatePreferenceV2(templateId: $id preferences: $preferences accountId: $accountId) {
      templateId
      templateName
      defaultStatus
      status
      hasCustomRouting
      routingPreferences
      digestSchedule
    }
  }
`;

function buildHeaders(auth: AuthContext): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth.jwt}`,
    "x-courier-client-key": auth.clientKey,
  };
}

async function gqlRequest<T>(
  auth: AuthContext,
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(auth.apiUrl, {
    method: "POST",
    headers: buildHeaders(auth),
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data;
}

export async function fetchPreferencePage(
  auth: AuthContext,
  accountId: string,
  brandId: string
): Promise<PreferencePage | null> {
  const data = await gqlRequest<{ preferencePage: PreferencePage | null }>(
    auth,
    PREFERENCE_PAGE_QUERY,
    {
      accountId: accountId || undefined,
      brandId: brandId || undefined,
    }
  );
  return data.preferencePage;
}

export async function fetchRecipientPreferences(
  auth: AuthContext,
  accountId: string
): Promise<RecipientPreference[]> {
  const data = await gqlRequest<{
    recipientPreferences: { nodes: RecipientPreference[] };
  }>(auth, RECIPIENT_PREFERENCES_QUERY, {
    accountId: accountId || undefined,
  });
  return data.recipientPreferences.nodes;
}

export async function updateRecipientPreference(
  auth: AuthContext,
  topicId: string,
  preferences: Record<string, unknown>,
  accountId: string
): Promise<void> {
  await gqlRequest(auth, UPDATE_RECIPIENT_PREFERENCES_MUTATION, {
    id: topicId,
    preferences,
    accountId: accountId || undefined,
  });
}
