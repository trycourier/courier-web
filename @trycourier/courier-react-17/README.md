<!-- AUTO-GENERATED-OVERVIEW:START — Do not edit this section. It is synced from mintlify-docs. -->
# Courier React 17 SDK

The Courier React 17 SDK provides ready-made components and programmatic hooks for building notification experiences in React 17 applications. It includes a full-featured inbox, popup menu, toast notifications, and a hook for custom UIs.

This package exposes the same API as [`@trycourier/courier-react`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react) but is built for React 17 compatibility.

- [`<CourierInbox />`](https://www.courier.com/docs/sdk-libraries/courier-react-web/#inbox-component) — full-featured inbox for displaying and managing messages
- [`<CourierInboxPopupMenu />`](https://www.courier.com/docs/sdk-libraries/courier-react-web/#inbox-component) — popup menu version of the inbox
- [`<CourierToast />`](https://www.courier.com/docs/sdk-libraries/courier-react-web/#toast-component) — toast notifications for time-sensitive alerts
- [`useCourier()`](https://www.courier.com/docs/sdk-libraries/courier-react-web/#usecourier-hook) — hook for programmatic access and custom UIs

> **Using React 18+?** Install [`@trycourier/courier-react`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react) instead.
>
> **Not using React?** Check out the [`@trycourier/courier-ui-inbox`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-inbox) and [`@trycourier/courier-ui-toast`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-toast) packages, which provide Web Components for any JavaScript project.

## Installation

```bash
npm install @trycourier/courier-react-17
```

## Quick Start

```jsx
import { useEffect } from "react";
import { CourierInbox, useCourier } from "@trycourier/courier-react-17";

export default function App() {
  const courier = useCourier();

  useEffect(() => {
    // Generate a JWT for your user on your backend server
    const jwt = "your-jwt-token";

    // Authenticate the user
    courier.shared.signIn({
      userId: "your-user-id",
      jwt: jwt,
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
curl --request POST      --url https://api.courier.com/auth/issue-token      --header 'Authorization: Bearer $YOUR_API_KEY'      --header 'Content-Type: application/json'      --data '{
       "scope": "user_id:$YOUR_USER_ID inbox:read:messages inbox:write:events",
       "expires_in": "1 day"
     }'
```

## Documentation

Full documentation: **[courier.com/docs/sdk-libraries/courier-react-web](https://www.courier.com/docs/sdk-libraries/courier-react-web/)**

- [Inbox implementation tutorial](https://www.courier.com/docs/tutorials/inbox/how-to-implement-inbox/)
- [JWT authentication tutorial](https://www.courier.com/docs/tutorials/inbox/how-to-send-jwt/)
- [Theme reference](https://www.courier.com/docs/sdk-libraries/courier-ui-inbox-web-theme/)
- [v8 migration guide](https://www.courier.com/docs/sdk-libraries/courier-react-v8-migration-guide/)
<!-- AUTO-GENERATED-OVERVIEW:END -->

## Share feedback with Courier

Have an idea or feedback about our SDKs? Let us know!

Open an issue: [Courier Web Issues](https://github.com/trycourier/courier-web/issues)
