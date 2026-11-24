<!-- AUTO-GENERATED-OVERVIEW:START — Do not edit this section. It is synced from mintlify-docs. -->

# Courier JS

`@trycourier/courier-js` is the API client for Courier's browser SDKs. It provides programmatic access to inbox messages, user preferences, brands, and list subscriptions for web browser-based applications.

> **Building with an AI coding agent?** Connect [Courier's MCP server and skills](https://www.courier.com/docs/get-started/build-with-ai) so your agent writes current Courier code.

> **Looking for UI components?** Check out [Courier React](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react) for React components, or [Courier UI Inbox](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-inbox) and [Courier UI Toast](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-toast) for framework-agnostic Web Components.

## Installation

```bash
npm install @trycourier/courier-js
```

## Quick Start

```ts
import { CourierClient } from "@trycourier/courier-js";

const courierClient = new CourierClient({
  userId: "user_123",
  jwt: "your-jwt-token",
});

// Fetch inbox messages
const inboxMessages = await courierClient.inbox.getMessages();

// Mark the newest message as read
const newest = inboxMessages.data?.messages?.nodes?.[0];
if (newest) {
  await courierClient.inbox.read({ messageId: newest.messageId });
}
```

## EU Endpoints

Use the built-in preset helper when your app should talk to Courier's EU endpoints:

```ts
import { CourierClient, getCourierApiUrlsForRegion } from "@trycourier/courier-js";

const courierClient = new CourierClient({
  userId: "user_123",
  jwt: "your-jwt-token",
  apiUrls: getCourierApiUrlsForRegion("eu"),
});
```

Mint the token against the same region: your backend calls `https://api.eu.courier.com/auth/issue-token`. A US token won't authenticate against EU hosts.

### `CourierClient` Options

| Option   | Type    | Required | Description |
|----------|---------|----------|-------------|
| userId   | string  | Yes      | The user ID to authenticate and fetch messages for. |
| jwt      | string  | Yes      | The JWT access token minted for the user. |
| tenantId | string  | No       | Scope messages to a specific tenant. |
| showLogs | boolean | No       | Enable debugging console logs. Defaults to `true` in development. |

## Authentication

The SDK requires a JWT (JSON Web Token) for authentication. **Always generate JWTs on your backend server, never in client-side code.**

1. Your client calls a route on your backend, such as `/api/courier/token`.
2. Your backend calls the [Courier Issue Token endpoint](https://www.courier.com/docs/api-reference/authentication/create-a-jwt) with your API key.
3. Your backend returns `{ userId, token }`, and your client passes them to `new CourierClient`.

```bash
curl --request POST \
     --url https://api.courier.com/auth/issue-token \
     --header "Authorization: Bearer $COURIER_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
       "scope": "user_id:user_123 inbox:read:messages inbox:write:events read:preferences write:preferences read:brands",
       "expires_in": "1 day"
     }'
```

## API Overview

**Inbox** — read and manage inbox messages:

```ts
await courierClient.inbox.getMessages();
await courierClient.inbox.getArchivedMessages();
await courierClient.inbox.read({ messageId });
await courierClient.inbox.unread({ messageId });
await courierClient.inbox.archive({ messageId });
await courierClient.inbox.readAll();
```

**Preferences** — read and update user notification preferences:

```ts
await courierClient.preferences.getUserPreferences();
await courierClient.preferences.putUserPreferenceTopic({
  topicId: "HVS...",
  status: "OPTED_IN",
  hasCustomRouting: true,
  customRouting: ["inbox", "push"],
});
```

**Brands** — read custom brand settings:

```ts
await courierClient.brands.getBrand({ brandId: "YF1..." });
```

**Lists** — subscribe and unsubscribe users:

```ts
await courierClient.lists.putSubscription({ listId: "your_list_id" });
await courierClient.lists.deleteSubscription({ listId: "your_list_id" });
```

## Documentation

Full documentation: **[courier.com/docs/sdk-libraries/courier-js-web](https://www.courier.com/docs/sdk-libraries/courier-js-web)**
<!-- AUTO-GENERATED-OVERVIEW:END -->

## Share feedback with Courier

Have an idea or feedback about our SDKs? Let us know!

Open an issue: [Courier Web Issues](https://github.com/trycourier/courier-web/issues)
