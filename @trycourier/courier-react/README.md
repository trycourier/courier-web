<!-- AUTO-GENERATED-OVERVIEW:START — Do not edit this section. It is synced from mintlify-docs. -->

# Courier React SDK

The Courier React SDK provides ready-made components and programmatic hooks for building notification experiences in React 18+ applications. It includes a full-featured inbox, popup menu, toast notifications, a preference center, and a hook for custom UIs.

- [`<CourierInbox />`](https://www.courier.com/docs/in-app/add-an-inbox) — full-featured inbox for displaying and managing messages
- [`<CourierInboxPopupMenu />`](https://www.courier.com/docs/in-app/add-an-inbox#render-as-a-popup-menu) — popup menu version of the inbox
- [`<CourierToast />`](https://www.courier.com/docs/in-app/add-toasts) — toast notifications for time-sensitive alerts
- [`<CourierPreferences />`](https://www.courier.com/docs/in-app/add-a-preference-center) — preference center where users choose which notifications they get, and where
- [`useCourier()`](https://www.courier.com/docs/sdk-libraries/courier-react-web#usecourier-hook) — hook for programmatic access and custom UIs

> **New to Courier?** Get a real-time notification inbox running in two files with the [React quickstart](https://www.courier.com/docs/guides/add-an-inbox-to-react). It includes a finished app to clone.

> **Not using React?** Check out the [`@trycourier/courier-ui-inbox`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-inbox) and [`@trycourier/courier-ui-toast`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-toast) packages, which provide Web Components for any JavaScript project.

## Installation

```bash
npm install @trycourier/courier-react
```

> Using React 17? Install [`@trycourier/courier-react-17`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react-17) instead.

## Quick Start

```jsx
import { useEffect } from "react";
import { CourierInbox, useCourier } from "@trycourier/courier-react";

export default function App() {
  const courier = useCourier();

  useEffect(() => {
    // Generate a JWT for your user on your backend server
    const jwt = "your-jwt-token";

    // Authenticate the user
    courier.shared.signIn({
      userId: "user_123",
      jwt: jwt,
    });
  }, []);

  return <CourierInbox />;
}
```

## EU Endpoints

If your app should talk to Courier's EU endpoints, pass the preset helper into `apiUrls`:

```jsx
import { useEffect } from "react";
import { CourierInbox, getCourierApiUrlsForRegion, useCourier } from "@trycourier/courier-react";

export default function App() {
  const courier = useCourier();

  useEffect(() => {
    courier.shared.signIn({
      userId: "user_123",
      jwt: "your-jwt-token",
      apiUrls: getCourierApiUrlsForRegion("eu"),
    });
  }, []);

  return <CourierInbox />;
}
```

## Authentication

The SDK requires a JWT (JSON Web Token) for authentication. **Always generate JWTs on your backend server, never in client-side code.**

1. Your client calls your backend to request a token.
2. Your backend calls the [Courier Issue Token endpoint](https://www.courier.com/docs/api-reference/authentication/create-a-jwt) using your API key.
3. Your backend returns the JWT to your client and passes it to the SDK.

```bash
curl -X POST https://api.courier.com/auth/issue-token \
  -H "Authorization: Bearer $COURIER_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "scope": "user_id:user_123 inbox:read:messages inbox:write:events",
    "expires_in": "1 day"
  }'
```

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
