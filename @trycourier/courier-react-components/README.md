<!-- AUTO-GENERATED-OVERVIEW:START — Do not edit this section. It is synced from mintlify-docs. -->
# Courier React Components

`@trycourier/courier-react-components` contains the React-version-agnostic components shared by Courier's React SDKs. It provides the inbox, popup menu, toast, preferences, and `useCourier()` building blocks, while [`@trycourier/courier-react`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react) and [`@trycourier/courier-react-17`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react-17) provide the React-version-specific render method on top.

> **Building a React app?** Install [`@trycourier/courier-react`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react) (React 18+) or [`@trycourier/courier-react-17`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react-17) (React 17) instead — they wrap this package and are the supported entry points. Install `courier-react-components` directly only when building a custom React integration.

## Installation

```bash
npm install @trycourier/courier-react-components
```

## Quick Start

Use one of the version-specific packages, which re-export everything here:

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
curl --request POST \
     --url https://api.courier.com/auth/issue-token \
     --header 'Authorization: Bearer $YOUR_API_KEY' \
     --header 'Content-Type: application/json' \
     --data '{
       "scope": "user_id:$YOUR_USER_ID inbox:read:messages inbox:write:events",
       "expires_in": "1 day"
     }'
```

## Documentation

Full documentation: **[courier.com/docs/sdk-libraries/courier-react-web](https://www.courier.com/docs/sdk-libraries/courier-react-web/)**

- [Courier React (React 18+)](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react)
- [Courier React 17](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react-17)
<!-- AUTO-GENERATED-OVERVIEW:END -->

## Share feedback with Courier

Have an idea or feedback about our SDKs? Let us know!

Open an issue: [Courier Web Issues](https://github.com/trycourier/courier-web/issues)
