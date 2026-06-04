<!-- AUTO-GENERATED-OVERVIEW:START — Do not edit this section. It is synced from mintlify-docs. -->
# Courier Preferences Web Components

Embed a customizable notification preferences center in your web app using Web Components. Courier Preferences provides the `<courier-preferences>` element that works with any JavaScript framework or vanilla JS. It lets your users manage which topics they're subscribed to and how each is delivered.

> **Using React?** Check out the [Courier React SDK](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react) for React-native components and hooks.

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

If you've already set up authentication for [Courier Inbox](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-inbox), you can reuse the same authentication mechanism; just make sure the token includes the preferences scopes below.

1. Your client calls your backend to request a token.
2. Your backend calls the [Courier Issue Token endpoint](https://www.courier.com/docs/api-reference/authentication/create-a-jwt) using your API key.
3. Your backend returns the JWT to your client and passes it to the SDK.

```bash
curl --request POST \
     --url https://api.courier.com/auth/issue-token \
     --header 'Authorization: Bearer $YOUR_API_KEY' \
     --header 'Content-Type: application/json' \
     --data '{
       "scope": "user_id:$YOUR_USER_ID read:preferences write:preferences",
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

Full documentation: **[courier.com/docs/sdk-libraries/courier-ui-preferences-web](https://www.courier.com/docs/sdk-libraries/courier-ui-preferences-web/)**

- [React SDK (wrapper)](https://www.courier.com/docs/sdk-libraries/courier-react-web/)
- [Inbox Web Components](https://www.courier.com/docs/sdk-libraries/courier-ui-inbox-web/)
<!-- AUTO-GENERATED-OVERVIEW:END -->

## Share feedback with Courier

Have an idea or feedback about our SDKs? Let us know!

Open an issue: [Courier Web Issues](https://github.com/trycourier/courier-web/issues)
