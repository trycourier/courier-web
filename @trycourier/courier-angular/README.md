<!-- AUTO-GENERATED-OVERVIEW:START — Do not edit this section. It is generated from the Courier docs and overwritten on every sync. -->

# Courier Angular SDK

Add a real-time notification inbox, toasts, and a preference center to your Angular app with standalone components and one injectable service. Courier hosts the feed and syncs read and archive state across each user's devices, and the same API sends to email, SMS, push, and Slack.

- [`<courier-inbox>`](https://www.courier.com/docs/in-app/add-an-inbox?lang=Angular) — full-featured inbox for displaying and managing messages
- [`<courier-inbox-popup-menu>`](https://www.courier.com/docs/in-app/add-an-inbox?lang=Angular#render-as-a-popup-menu) — popup menu version of the inbox
- [`<courier-toast>`](https://www.courier.com/docs/in-app/add-toasts?lang=Angular) — toast notifications for time-sensitive alerts
- [`<courier-preferences>`](https://www.courier.com/docs/in-app/add-a-preference-center?lang=Angular) — preference center where users choose which notifications they get, and where
- [`CourierService`](https://www.courier.com/docs/sdk-libraries/courier-angular-web#courierservice) — injectable service for programmatic access and custom UIs

> **Not using Angular?** Use [`@trycourier/courier-react`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-react) for React, [`@trycourier/courier-vue`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-vue) for Vue, or the [`@trycourier/courier-ui-inbox`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-inbox) Web Components for any other JavaScript project.

> **Building with an AI coding agent?** Connect [Courier's MCP server and skills](https://www.courier.com/docs/get-started/build-with-ai) so your agent writes current Courier code.

## Installation

```bash
npm install @trycourier/courier-angular
```

`@angular/core` (>= 17), `@angular/common` (>= 17), and `rxjs` (>= 7) are peer dependencies.

## Quick Start

The components are standalone — import the ones you use directly into your component's `imports`.

```ts
import { Component, NgZone, afterNextRender, inject } from "@angular/core";
import { CourierInboxComponent, CourierService } from "@trycourier/courier-angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CourierInboxComponent],
  template: `<courier-inbox></courier-inbox>`,
})
export class AppComponent {
  private readonly courier = inject(CourierService);
  private readonly zone = inject(NgZone);

  constructor() {
    // afterNextRender skips server rendering but runs outside Angular's zone, so re-enter it
    afterNextRender(() => this.zone.run(async () => {
      // Your backend mints a JWT for the signed-in user (see Authentication)
      const response = await fetch("/api/courier/token");
      if (!response.ok) throw new Error(`Courier token request failed: ${response.status}`);
      const { userId, token } = await response.json();
      this.courier.signIn({ userId, jwt: token });
    }));
  }
}
```

## EU Endpoints

If your app should talk to Courier's EU endpoints, pass the preset helper into `apiUrls`:

```ts
import { Component, NgZone, afterNextRender, inject } from "@angular/core";
import { CourierInboxComponent, CourierService, getCourierApiUrlsForRegion } from "@trycourier/courier-angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CourierInboxComponent],
  template: `<courier-inbox></courier-inbox>`,
})
export class AppComponent {
  private readonly courier = inject(CourierService);
  private readonly zone = inject(NgZone);

  constructor() {
    afterNextRender(() => this.zone.run(async () => {
      const response = await fetch("/api/courier/token");
      if (!response.ok) throw new Error(`Courier token request failed: ${response.status}`);
      const { userId, token } = await response.json();
      this.courier.signIn({ userId, jwt: token, apiUrls: getCourierApiUrlsForRegion("eu") });
    }));
  }
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

Full documentation: **[courier.com/docs/sdk-libraries/courier-angular-web](https://www.courier.com/docs/sdk-libraries/courier-angular-web)**

- [Add an inbox](https://www.courier.com/docs/in-app/add-an-inbox?lang=Angular)
- [Authenticate users with a JWT](https://www.courier.com/docs/in-app/authenticate-users?lang=Angular)
- [Theme reference](https://www.courier.com/docs/in-app/customize-the-inbox?lang=Angular#theme)
<!-- AUTO-GENERATED-OVERVIEW:END -->

## Share feedback with Courier

Have an idea or feedback about our SDKs? Let us know!

Open an issue: [Courier Web Issues](https://github.com/trycourier/courier-web/issues)
