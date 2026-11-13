<!-- AUTO-GENERATED-OVERVIEW:START — Do not edit this section. It is synced from mintlify-docs. -->

# Courier Angular SDK

The Courier Angular SDK provides ready-made standalone components and an injectable service for building notification experiences in Angular applications. It includes a full-featured inbox, popup menu, toast notifications, a preference center, and a service for custom UIs.

- [`<courier-inbox>`](https://www.courier.com/docs/in-app/add-an-inbox?lang=Angular) — full-featured inbox for displaying and managing messages
- [`<courier-inbox-popup-menu>`](https://www.courier.com/docs/in-app/add-an-inbox?lang=Angular#render-as-a-popup-menu) — popup menu version of the inbox
- [`<courier-toast>`](https://www.courier.com/docs/in-app/add-toasts?lang=Angular) — toast notifications for time-sensitive alerts
- [`<courier-preferences>`](https://www.courier.com/docs/in-app/add-a-preference-center?lang=Angular) — preference center where users choose which notifications they get, and where
- [`CourierService`](https://www.courier.com/docs/sdk-libraries/courier-angular-web#courierservice) — injectable service for programmatic access and custom UIs

> **Not using Angular?** Check out the [`@trycourier/courier-ui-inbox`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-inbox) and [`@trycourier/courier-ui-toast`](https://github.com/trycourier/courier-web/tree/main/%40trycourier/courier-ui-toast) packages, which provide Web Components for any JavaScript project.

## Installation

```bash
npm install @trycourier/courier-angular
```

`@angular/core` (>= 17), `@angular/common` (>= 17), and `rxjs` (>= 7) are peer dependencies.

## Quick Start

The components are standalone — import the ones you use directly into your component's `imports`.

```ts
import { AfterViewInit, Component, inject } from "@angular/core";
import { CourierInboxComponent, CourierService } from "@trycourier/courier-angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CourierInboxComponent],
  template: `<courier-inbox></courier-inbox>`,
})
export class AppComponent implements AfterViewInit {
  private readonly courier = inject(CourierService);

  ngAfterViewInit(): void {
    // Generate a JWT for your user on your backend server
    const jwt = "your-jwt-token";

    // Authenticate the user
    this.courier.signIn({
      userId: "user_123",
      jwt: jwt,
    });
  }
}
```

## EU Endpoints

If your app should talk to Courier's EU endpoints, pass the preset helper into `apiUrls`:

```ts
import { AfterViewInit, Component, inject } from "@angular/core";
import { CourierInboxComponent, CourierService, getCourierApiUrlsForRegion } from "@trycourier/courier-angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CourierInboxComponent],
  template: `<courier-inbox></courier-inbox>`,
})
export class AppComponent implements AfterViewInit {
  private readonly courier = inject(CourierService);

  ngAfterViewInit(): void {
    this.courier.signIn({
      userId: "user_123",
      jwt: "your-jwt-token",
      apiUrls: getCourierApiUrlsForRegion("eu"),
    });
  }
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

Full documentation: **[courier.com/docs/sdk-libraries/courier-angular-web](https://www.courier.com/docs/sdk-libraries/courier-angular-web)**

- [Add an inbox](https://www.courier.com/docs/in-app/add-an-inbox?lang=Angular)
- [Authenticate users with a JWT](https://www.courier.com/docs/in-app/authenticate-users?lang=Angular)
- [Theme reference](https://www.courier.com/docs/in-app/customize-the-inbox?lang=Angular#theme)
<!-- AUTO-GENERATED-OVERVIEW:END -->

## Share feedback with Courier

Have an idea or feedback about our SDKs? Let us know!

Open an issue: [Courier Web Issues](https://github.com/trycourier/courier-web/issues)
