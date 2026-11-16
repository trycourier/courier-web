<!-- AUTO-GENERATED-OVERVIEW:START — Do not edit this section. It is synced from mintlify-docs. -->

# Courier Vue SDK

The Courier Vue SDK provides ready-made components and a programmatic composable for building notification experiences in Vue 3 applications. It includes a full-featured inbox, popup menu, toast notifications, a preference center, and a composable for custom UIs.

- [`<CourierInbox />`](https://www.courier.com/docs/in-app/add-an-inbox?lang=Vue) — full-featured inbox for displaying and managing messages
- [`<CourierInboxPopupMenu />`](https://www.courier.com/docs/in-app/add-an-inbox?lang=Vue#render-as-a-popup-menu) — popup menu version of the inbox
- [`<CourierToast />`](https://www.courier.com/docs/in-app/add-toasts?lang=Vue) — toast notifications for time-sensitive alerts
- [`<CourierPreferences />`](https://www.courier.com/docs/in-app/add-a-preference-center?lang=Vue) — preference center where users choose which notifications they get, and where
- [`useCourier()`](https://www.courier.com/docs/sdk-libraries/courier-vue-web#usecourier-composable) — composable for programmatic access and custom UIs

> **Not using Vue?** Check out the [`@trycourier/courier-ui-inbox`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-inbox) and [`@trycourier/courier-ui-toast`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-toast) packages, which provide Web Components for any JavaScript project.

## Installation

```bash
npm install @trycourier/courier-vue
```

`vue` (>= 3.3) is a peer dependency.

## Quick Start

```vue
<script setup lang="ts">
import { onMounted } from "vue";
import { CourierInbox, useCourier } from "@trycourier/courier-vue";

const courier = useCourier();

onMounted(() => {
  // Generate a JWT for your user on your backend server
  const jwt = "your-jwt-token";

  // Authenticate the user
  courier.shared.signIn({
    userId: "user_123",
    jwt: jwt,
  });
});
</script>

<template>
  <CourierInbox />
</template>
```

## EU Endpoints

If your app should talk to Courier's EU endpoints, pass the preset helper into `apiUrls`:

```vue
<script setup lang="ts">
import { onMounted } from "vue";
import { CourierInbox, getCourierApiUrlsForRegion, useCourier } from "@trycourier/courier-vue";

const courier = useCourier();

onMounted(() => {
  courier.shared.signIn({
    userId: "user_123",
    jwt: "your-jwt-token",
    apiUrls: getCourierApiUrlsForRegion("eu"),
  });
});
</script>

<template>
  <CourierInbox />
</template>
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

Full documentation: **[courier.com/docs/sdk-libraries/courier-vue-web](https://www.courier.com/docs/sdk-libraries/courier-vue-web)**

- [Add an inbox](https://www.courier.com/docs/in-app/add-an-inbox?lang=Vue)
- [Authenticate users with a JWT](https://www.courier.com/docs/in-app/authenticate-users?lang=Vue)
- [Theme reference](https://www.courier.com/docs/in-app/customize-the-inbox?lang=Vue#theme)
<!-- AUTO-GENERATED-OVERVIEW:END -->

## Share feedback with Courier

Have an idea or feedback about our SDKs? Let us know!

Open an issue: [Courier Web Issues](https://github.com/trycourier/courier-web/issues)
