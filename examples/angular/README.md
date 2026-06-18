# Courier + Angular (Web Components)

A minimal [Angular](https://angular.dev/) + [Vite](https://vite.dev/) app
(via [`@analogjs/vite-plugin-angular`](https://analogjs.org/docs/packages/vite-plugin-angular/overview))
that embeds Courier's [Web Components inbox](../../@trycourier/courier-ui-inbox/)
— the same setup you'd use to drop the inbox into an Angular app.

Like the [`vue`](../vue/) example, it also serves as a regression test for
[C-18926](https://linear.app/trycourier): the inbox empty-state used to inject a
**global** `.container` style that clobbered any host-app `.container` class and
broke page layouts. This app builds its layout on a `.container` class so the
conflict is obvious if it ever regresses.

## How Angular uses the Web Components

Two things make the native custom elements work in Angular:

1. The standalone `AppComponent` declares `schemas: [CUSTOM_ELEMENTS_SCHEMA]`, so
   Angular renders `courier-*` tags as native custom elements instead of failing
   to resolve them as Angular components.
2. Importing `@trycourier/courier-ui-inbox` registers the `<courier-inbox>`
   element. We grab it with a template `#inbox` ref / `@ViewChild` to call its
   imperative API (`onMessageClick`, etc.).

## Development

From the `courier-web` project root:

1. Install dependencies

    ```sh
    yarn install
    ```

2. (Optional) To show live messages, set credentials in the shared
   [`examples/web-js/.env`](../web-js) file — this example reads its `.env` from
   there (via `envDir` in `vite.config.ts`), so the web-component examples share
   one set of credentials. Without them, the inbox renders its empty / signed-out
   state — which is the exact UI this example is testing.

    ```sh
    VITE_USER_ID={YOUR_USER_ID}
    VITE_JWT={YOUR_JWT}
    ```

3. Run the example app

    ```sh
    yarn workspace angular run dev
    ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## What "working" looks like

The page header, sidebar, inbox card and footer stay laid out in their grid even
while the inbox shows its empty state. If you see the layout collapse (everything
centered/stacked), the global-style leak has regressed.

> Changes made to `@trycourier` modules are _not_ hot-reloaded. Restart the
> server to pick up changes.
