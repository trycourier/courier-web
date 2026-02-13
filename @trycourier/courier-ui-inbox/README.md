<!-- AUTO-GENERATED-OVERVIEW:START — Do not edit this section. It is synced from mintlify-docs. -->
# Courier Inbox Web Components

Embed a customizable in-app notification center in your web app using Web Components. Courier Inbox provides `<courier-inbox>` and `<courier-inbox-popup-menu>` elements that work with any JavaScript framework or vanilla JS.

> **Using React?** Check out the [Courier React SDK](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react) for React-native components and hooks.

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

    // Generate a JWT for your user on your backend server
    const jwt = "your-jwt-token";

    // Authenticate the user
    Courier.shared.signIn({
      userId: "your-user-id",
      jwt: jwt,
    });
  </script>
</body>
```

For a popup menu instead:

```html
<courier-inbox-popup-menu id="inbox"></courier-inbox-popup-menu>
```

## Authentication

The SDK requires a JWT (JSON Web Token) for authentication. **Always generate JWTs on your backend server, never in client-side code.**

1. Your client calls your backend to request a token.
2. Your backend calls the [Courier Issue Token endpoint](https://www.courier.com/docs/api-reference/authentication/create-a-jwt) using your API key.
3. Your backend returns the JWT to your client and passes it to the SDK.

```bash
curl --request POST      --url https://api.courier.com/auth/issue-token      --header 'Authorization: Bearer $YOUR_API_KEY'      --header 'Content-Type: application/json'      --data '{
       "scope": "user_id:$YOUR_USER_ID inbox:read:messages inbox:write:events",
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

Full documentation: **[courier.com/docs/sdk-libraries/courier-ui-inbox-web](https://www.courier.com/docs/sdk-libraries/courier-ui-inbox-web/)**

- [Theme reference](https://www.courier.com/docs/sdk-libraries/courier-ui-inbox-web-theme/)
- [React SDK (wrapper)](https://www.courier.com/docs/sdk-libraries/courier-react-web/)
- [Inbox implementation tutorial](https://www.courier.com/docs/tutorials/inbox/how-to-implement-inbox/)
- [Sample app (Vanilla JS)](https://github.com/trycourier/courier-samples/tree/main/web/vanilla/inbox)
<!-- AUTO-GENERATED-OVERVIEW:END -->

## Share feedback with Courier

Have an idea or feedback about our SDKs? Let us know!

Open an issue: [Courier Web Issues](https://github.com/trycourier/courier-web/issues)
