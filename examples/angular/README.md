# Courier + Angular (native Angular SDK)

An [Angular 19](https://angular.dev/) + [Vite](https://vite.dev/) showcase
(via [`@analogjs/vite-plugin-angular`](https://analogjs.org/docs/packages/vite-plugin-angular/overview))
built on the native Angular SDK [`@trycourier/courier-angular`](../../@trycourier/courier-angular/).

It ports the full Courier example showcase — the same set of demo routes as the
[`react-latest`](../react-latest/) and [`vue`](../vue/) examples — to Angular:
inbox, popup menu, custom feeds/tabs, theming, custom renderers (header, list
item, states, markdown), toast (basic / themed / custom), service-only usage,
and preferences (default / styled).

## How Angular uses the SDK

`@trycourier/courier-angular` exposes standalone components whose host element
**is** the underlying Courier custom element:

- `CourierInboxComponent` (`<courier-inbox>`), `CourierInboxPopupMenuComponent`
  (`<courier-inbox-popup-menu>`), `CourierToastComponent` (`<courier-toast>`),
  `CourierPreferencesComponent` (`<courier-preferences>`).
- Inputs are camelCase (`[lightTheme]`, `[feeds]`, `[height]`, …), outputs are
  events (`(messageClick)`, `(toastItemClick)`, …).
- Custom render slots are provided as named `<ng-template>` children
  (`#header`, `#listItem`, `#emptyState`, `#toastItem`, …); the implicit context
  is the factory props (`let-props`).
- `CourierService` (injectable) provides auth/inbox/toast state as RxJS
  observables (`auth$`, `inbox$`, `toast$`) plus imperative actions
  (`signIn`, `load`, `registerFeeds`, `getUserPreferences`, …).

Each demo page under `src/app/pages/` is a standalone component; routes live in
`src/app/routes.ts`.

## How this example consumes `@trycourier/courier-angular`

Unlike the React/Vue showcases (whose SDKs are plain TypeScript aliased to
`/src`), `courier-angular` is *Angular* source. Analog's compiler deliberately
skips transforming `@trycourier/*` (see `transformFilter` in `vite.config.ts`),
so we cannot alias it to `/src` — its decorators would never be compiled.

Instead we consume the **built** package: `ng-packagr` emits a partial-Ivy
fesm2022 bundle, which Angular's linker (run by Analog) recompiles at dev/build
time. `vite.config.ts` aliases `@trycourier/courier-angular` to its `dist/` so
Vite always picks up the freshly built output, and `optimizeDeps.exclude`s it so
esbuild does not pre-bundle the partial-Ivy code. Its plain-TS peer packages
(`courier-ui-inbox|toast|preferences`, `courier-js`, `courier-ui-core`) are
aliased to `/src` exactly like the Vue example.

**You must build the SDK before running this example** (or after changing it):

```sh
yarn workspace @trycourier/courier-angular run build
```

## Development

From the `courier-web` project root:

1. Install dependencies

    ```sh
    yarn install
    ```

2. Build the Angular SDK (see above):

    ```sh
    yarn workspace @trycourier/courier-angular run build
    ```

3. (Optional) To show live messages, set credentials in the shared
   [`examples/web-js/.env`](../web-js) file — this example reads its `.env` from
   there (via `envDir` in `vite.config.ts`), so the web-component examples share
   one set of credentials. Without them, the inbox renders its empty /
   signed-out state.

    ```sh
    VITE_USER_ID={YOUR_USER_ID}
    VITE_JWT={YOUR_JWT}
    ```

4. Run the example app

    ```sh
    yarn workspace angular run dev
    ```

5. Open the printed `http://localhost:<port>` in your browser. Start at `/` for
   the default inbox, or `/examples` for the full demo index.

> Changes made to `@trycourier` modules are _not_ hot-reloaded. Restart the
> server (and rebuild `courier-angular` if you changed it) to pick up changes.
