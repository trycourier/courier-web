<!-- AUTO-GENERATED-OVERVIEW:START — Do not edit this section. It is synced from mintlify-docs. -->

# Courier Preferences Web Components

Embed a customizable notification preferences center in your web app using Web Components. Courier Preferences provides the `<courier-preferences>` element that works with any JavaScript framework or vanilla JS. It lets your users manage which topics they're subscribed to and how each is delivered.

> **Using React, Vue, or Angular?** [`@trycourier/courier-react`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react), [`@trycourier/courier-vue`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-vue), and [`@trycourier/courier-angular`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-angular) wrap these elements in native components.

> **Building with an AI coding agent?** Connect [Courier's MCP server and skills](https://www.courier.com/docs/get-started/build-with-ai) so your agent writes current Courier code.

## Installation

```bash
npm install @trycourier/courier-ui-preferences
```

Works with any JavaScript build system; no additional build configuration required.

## Quick Start

```html
<body>
  <courier-preferences id="preferences"></courier-preferences>

  <script type="module">
    import { Courier } from "@trycourier/courier-ui-preferences";

    // Your backend mints a JWT for the signed-in user (see Authentication)
    const response = await fetch("/api/courier/token");
    if (!response.ok) throw new Error(`Courier token request failed: ${response.status}`);
    const { userId, token } = await response.json();
    Courier.shared.signIn({ userId, jwt: token });
  </script>
</body>
```

## Authentication

The SDK requires a JWT (JSON Web Token) for authentication. **Always generate JWTs on your backend server, never in client-side code.**

If you've already set up authentication for [Courier Inbox](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-inbox), you can reuse the same authentication mechanism; just make sure the token includes the preferences scopes below.

1. Your client calls a route on your backend, such as `/api/courier/token`.
2. Your backend calls the [Courier Issue Token endpoint](https://www.courier.com/docs/api-reference/authentication/create-a-jwt) with your API key.
3. Your backend returns `{ userId, token }`, and your client passes them to `signIn`.

```bash
curl --request POST \
     --url https://api.courier.com/auth/issue-token \
     --header "Authorization: Bearer $COURIER_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
       "scope": "user_id:user_123 inbox:read:messages inbox:write:events read:preferences write:preferences",
       "expires_in": "1 day"
     }'
```

## Features

- **Topics and Sections** — preferences are grouped into sections of topics your users can opt in and out of
- **Channel Routing** — let users choose which channels (email, push, SMS, and more) deliver each topic
- **Digest Scheduling** — configurable digest delivery schedules per topic
- **Theming** — full light/dark theme support with `setLightTheme()`, `setDarkTheme()`, and `setMode()`
- **Custom Labels** — rename channels in the UI with `setChannelLabels()`

## Documentation

Full documentation: **[courier.com/docs/in-app/add-a-preference-center](https://www.courier.com/docs/in-app/add-a-preference-center?lang=Web%20Components)**

- [React SDK (wrapper)](https://www.courier.com/docs/sdk-libraries/courier-react-web)
- [Inbox Web Components](https://www.courier.com/docs/sdk-libraries/courier-web-components)
<!-- AUTO-GENERATED-OVERVIEW:END -->

## Share feedback with Courier

Have an idea or feedback about our SDKs? Let us know!

Open an issue: [Courier Web Issues](https://github.com/trycourier/courier-web/issues)
