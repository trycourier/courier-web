<!-- AUTO-GENERATED-OVERVIEW:START — Do not edit this section. It is synced from mintlify-docs. -->
# Courier Toast Web Components

Embed customizable toast notifications in your web app using Web Components. Courier Toast provides the `<courier-toast>` element that works with any JavaScript framework or vanilla JS. Toasts are synced with the feed of Courier Inbox messages.

> **Using React?** Check out the [Courier React SDK](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react) for React-native components and hooks.

## Installation

```bash
npm install @trycourier/courier-ui-toast
```

Works with any JavaScript build system; no additional build configuration required.

## Quick Start

```html
<body>
  <courier-toast></courier-toast>

  <script type="module">
    import { Courier } from "@trycourier/courier-ui-toast";

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

## Authentication

The SDK requires a JWT (JSON Web Token) for authentication. **Always generate JWTs on your backend server, never in client-side code.**

If you've already set up authentication for [Courier Inbox](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-inbox), you can skip this step; toasts and inbox share an authentication mechanism.

1. Your client calls your backend to request a token.
2. Your backend calls the [Courier Issue Token endpoint](https://www.courier.com/docs/api-reference/authentication/create-a-jwt) using your API key.
3. Your backend returns the JWT to your client and passes it to the SDK.

```bash
curl --request POST \
     --url https://api.courier.com/auth/issue-token \
     --header 'Authorization: Bearer $YOUR_API_KEY' \
     --header 'Content-Type: application/json' \
     --data '{
       "scope": "user_id:$YOUR_USER_ID inbox:read:messages inbox:write:events",
       "expires_in": "1 day"
     }'
```

## Features

- **Auto-Dismiss** — configurable timeout with countdown bar (`auto-dismiss`, `auto-dismiss-timeout-ms`)
- **Click Handling** — `onToastItemClick()` and `onToastItemActionClick()` for toast and action button clicks
- **Theming** — full light/dark theme support with `setLightTheme()` and `setDarkTheme()`
- **Custom Elements** — replace toast content (`setToastItemContent`) or entire toast items (`setToastItem`)
- **Datastore** — `CourierToastDatastore.shared.addMessage()` and `removeMessage()` for programmatic control

## Documentation

Full documentation: **[courier.com/docs/sdk-libraries/courier-ui-toast-web](https://www.courier.com/docs/sdk-libraries/courier-ui-toast-web/)**

- [React SDK (wrapper)](https://www.courier.com/docs/sdk-libraries/courier-react-web/)
- [Inbox Web Components](https://www.courier.com/docs/sdk-libraries/courier-ui-inbox-web/)
- [Sample app (Vanilla JS)](https://github.com/trycourier/courier-samples/tree/main/web/vanilla/toast)
<!-- AUTO-GENERATED-OVERVIEW:END -->

## Share feedback with Courier

Have an idea or feedback about our SDKs? Let us know!

Open an issue: [Courier Web Issues](https://github.com/trycourier/courier-web/issues)
