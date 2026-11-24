<!-- AUTO-GENERATED-OVERVIEW:START — Do not edit this section. It is synced from mintlify-docs. -->

# Courier Inbox Web Components

Embed a customizable in-app notification center in your web app using Web Components. Courier Inbox provides `<courier-inbox>` and `<courier-inbox-popup-menu>` elements that work with any JavaScript framework or vanilla JS. Courier hosts the feed and syncs read and archive state across each user's devices, and the same API sends to email, SMS, push, and Slack.

> **Using React, Vue, or Angular?** [`@trycourier/courier-react`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react), [`@trycourier/courier-vue`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-vue), and [`@trycourier/courier-angular`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-angular) wrap these elements in native components.

> **Building with an AI coding agent?** Connect [Courier's MCP server and skills](https://www.courier.com/docs/get-started/build-with-ai) so your agent writes current Courier code.

## Installation

```bash
npm install @trycourier/courier-ui-inbox
```

Works with any JavaScript build system; no additional build configuration required.

## Quick Start

```html
<body>
  <courier-inbox id="inbox"></courier-inbox>

  <script type="module">
    import { Courier } from "@trycourier/courier-ui-inbox";

    // Your backend mints a JWT for the signed-in user (see Authentication)
    const response = await fetch("/api/courier/token");
    if (!response.ok) throw new Error(`Courier token request failed: ${response.status}`);
    const { userId, token } = await response.json();
    Courier.shared.signIn({ userId, jwt: token });
  </script>
</body>
```

For a popup menu instead:

```html
<courier-inbox-popup-menu id="inbox"></courier-inbox-popup-menu>
```

## Authentication

The SDK requires a JWT (JSON Web Token) for authentication. **Always generate JWTs on your backend server, never in client-side code.**

1. Your client calls a route on your backend, such as `/api/courier/token`.
2. Your backend calls the [Courier Issue Token endpoint](https://www.courier.com/docs/api-reference/authentication/create-a-jwt) with your API key.
3. Your backend returns `{ userId, token }`, and your client passes them to `signIn`.

```bash
curl --request POST \
     --url https://api.courier.com/auth/issue-token \
     --header "Authorization: Bearer $COURIER_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
       "scope": "user_id:user_123 inbox:read:messages inbox:write:events",
       "expires_in": "1 day"
     }'
```

## Features

- **Tabs and Feeds** — organize messages with filterable tabs and multiple feeds
- **Click Handling** — `onMessageClick()`, `onMessageActionClick()`, `onMessageLongPress()`
- **Theming** — full light/dark theme support with `setLightTheme()` and `setDarkTheme()`
- **Custom Elements** — replace list items, headers, menu buttons, and state views
- **Programmatic Control** — `selectFeed()`, `selectTab()`, `refresh()`, and more

## Documentation

Full documentation: **[courier.com/docs/sdk-libraries/courier-web-components](https://www.courier.com/docs/sdk-libraries/courier-web-components)**

- [Theme reference](https://www.courier.com/docs/in-app/customize-the-inbox?lang=Web%20Components#theme)
- [React SDK (wrapper)](https://www.courier.com/docs/sdk-libraries/courier-react-web)
- [Add an inbox](https://www.courier.com/docs/in-app/add-an-inbox?lang=Web%20Components)
- [Sample app (Vanilla JS)](https://github.com/trycourier/courier-samples/tree/main/web/vanilla/inbox)
<!-- AUTO-GENERATED-OVERVIEW:END -->

## Share feedback with Courier

Have an idea or feedback about our SDKs? Let us know!

Open an issue: [Courier Web Issues](https://github.com/trycourier/courier-web/issues)
