<!-- AUTO-GENERATED-OVERVIEW:START — Do not edit this section. It is synced from mintlify-docs. -->

# Courier React SDK

Add a real-time notification inbox, toasts, and a preference center to your React 18+ app with drop-in components and one hook. Courier hosts the feed and syncs read and archive state across each user's devices, and the same API sends to email, SMS, push, and Slack.

- [`<CourierInbox />`](https://www.courier.com/docs/in-app/add-an-inbox) — full-featured inbox for displaying and managing messages
- [`<CourierInboxPopupMenu />`](https://www.courier.com/docs/in-app/add-an-inbox#render-as-a-popup-menu) — popup menu version of the inbox
- [`<CourierToast />`](https://www.courier.com/docs/in-app/add-toasts) — toast notifications for time-sensitive alerts
- [`<CourierPreferences />`](https://www.courier.com/docs/in-app/add-a-preference-center) — preference center where users choose which notifications they get, and where
- [`useCourier()`](https://www.courier.com/docs/sdk-libraries/courier-react-web#usecourier-hook) — hook for programmatic access and custom UIs

> **New to Courier?** Get a real-time notification inbox running in two files with the [React quickstart](https://www.courier.com/docs/guides/add-an-inbox-to-react). It includes a finished app to clone.

> **Building with an AI coding agent?** Connect [Courier's MCP server and skills](https://www.courier.com/docs/get-started/build-with-ai) so your agent writes current Courier code.

> **Not using React?** Use [`@trycourier/courier-vue`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-vue) for Vue, [`@trycourier/courier-angular`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-angular) for Angular, or the [`@trycourier/courier-ui-inbox`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-inbox) Web Components for any other JavaScript project.

## Installation

```bash
npm install @trycourier/courier-react
```

> Using React 17? Install [`@trycourier/courier-react-17`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react-17) instead.

## Quick Start

```jsx
import { useEffect, useRef } from "react";
import { CourierInbox, useCourier } from "@trycourier/courier-react";

export default function App() {
  const courier = useCourier();
  const signedIn = useRef(false);

  useEffect(() => {
    // StrictMode runs effects twice in development, and a second signIn
    // signs the user out and back in. Sign in once.
    if (signedIn.current) return;
    signedIn.current = true;

    // Your backend mints a JWT for the signed-in user (see Authentication)
    fetch("/api/courier/token")
      .then((response) => {
        if (!response.ok) throw new Error(`Courier token request failed: ${response.status}`);
        return response.json();
      })
      .then(({ userId, token }) => courier.shared.signIn({ userId, jwt: token }))
      .catch((error) => console.error(error));
  }, [courier]);

  return <CourierInbox />;
}
```

## EU Endpoints

If your app should talk to Courier's EU endpoints, pass the preset helper into `apiUrls`:

```jsx
import { useEffect, useRef } from "react";
import { CourierInbox, getCourierApiUrlsForRegion, useCourier } from "@trycourier/courier-react";

export default function App() {
  const courier = useCourier();
  const signedIn = useRef(false);

  useEffect(() => {
    if (signedIn.current) return;
    signedIn.current = true;

    fetch("/api/courier/token")
      .then((response) => {
        if (!response.ok) throw new Error(`Courier token request failed: ${response.status}`);
        return response.json();
      })
      .then(({ userId, token }) =>
        courier.shared.signIn({ userId, jwt: token, apiUrls: getCourierApiUrlsForRegion("eu") }),
      )
      .catch((error) => console.error(error));
  }, [courier]);

  return <CourierInbox />;
}
```

Mint the token against the same region: your backend calls `https://api.eu.courier.com/auth/issue-token`. A US token won't authenticate against EU hosts.

## Authentication

The SDK requires a JWT (JSON Web Token) for authentication. **Always generate JWTs on your backend server, never in client-side code.**

1. Your client calls a route on your backend, such as `/api/courier/token`.
2. Your backend calls the [Courier Issue Token endpoint](https://www.courier.com/docs/api-reference/authentication/create-a-jwt) with your API key.
3. Your backend returns `{ userId, token }`, and your client passes them to `signIn`.

```bash
curl -X POST https://api.courier.com/auth/issue-token \
  -H "Authorization: Bearer $COURIER_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "scope": "user_id:user_123 inbox:read:messages inbox:write:events",
    "expires_in": "1 day"
  }'
```

Adding the preference center? Add `read:preferences write:preferences` to `scope`. [Scopes](https://www.courier.com/docs/in-app/authenticate-users#scopes) lists the rest.

## Documentation

Full documentation: **[courier.com/docs/sdk-libraries/courier-react-web](https://www.courier.com/docs/sdk-libraries/courier-react-web)**

- [React quickstart: add a notification inbox to a React app](https://www.courier.com/docs/guides/add-an-inbox-to-react)
- [Authenticate users with a JWT](https://www.courier.com/docs/in-app/authenticate-users)
- [Theme reference](https://www.courier.com/docs/in-app/customize-the-inbox#theme)
- [v8 migration guide](https://www.courier.com/docs/sdk-libraries/courier-react-v8-migration-guide)
<!-- AUTO-GENERATED-OVERVIEW:END -->

## Share feedback with Courier

Have an idea or feedback about our SDKs? Let us know!

Open an issue: [Courier Web Issues](https://github.com/trycourier/courier-web/issues)
