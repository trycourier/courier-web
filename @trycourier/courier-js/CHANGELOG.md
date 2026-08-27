# @trycourier/courier-js

## 3.6.0

### Minor Changes

- [#248](https://github.com/trycourier/courier-web/pull/248) [`10c5e71`](https://github.com/trycourier/courier-web/commit/10c5e716233ce5573f5d89cdd304a80f8186b6c7) Thanks [@mikemilla](https://github.com/mikemilla)! - Fix named imports under Node ESM. `import { useCourier } from "@trycourier/courier-react"` threw `Named export 'useCourier' not found` in Astro, SvelteKit, Nuxt, Remix, and plain `node --input-type=module`.

  Each package now declares an `exports` map, so an `import` resolves to `dist/index.mjs` and a `require` resolves to the bundle `main` already pointed at. Node only consults `main` and never `module`, which is why the ESM build was reachable from bundlers but not from a server.

  The CommonJS bundles also carry their re-exported names as plain assignments now (`output.externalLiveBindings: false`). Rollup emitted a live-binding getter, terser minified it into a form `cjs-module-lexer` cannot read, and Node saw 7 of `courier-react`'s 27 names and none of `courier-js`'s. That is 26 of 26 for `courier-react` and 28 for `courier-vue` after the change.

  `main`, `module`, and `types` are unchanged, and every `dist/` path that named a real file still resolves.

  **One behavior change.** An `exports` map does no filename-extension guessing, so an extensionless deep import into `dist/` no longer resolves:

  ```ts
  // before
  import type { CourierGetInboxMessagesQueryFilter } from "@trycourier/courier-js/dist/types/inbox";

  // after — the type is on the package's public surface
  import type { CourierGetInboxMessagesQueryFilter } from "@trycourier/courier-js";
  ```

  Import from the package root, which exports every published type. Adding the `.d.ts` extension also works.

## 3.5.1

### Patch Changes

- [#244](https://github.com/trycourier/courier-web/pull/244) [`021b922`](https://github.com/trycourier/courier-web/commit/021b922af93b1ec1893e4b310fc0ab607dcee76e) Thanks [@mikemilla](https://github.com/mikemilla)! - Version bump only, so every package moves to a version the registry has not seen. No functional change.

  These three sat at versions already on npm while the rest of the packages released, and `changeset publish` attempts every package on each run — the already-published ones come back rejected and take the whole Release run down with them.

## 3.5.0

### Minor Changes

- [#210](https://github.com/trycourier/courier-web/pull/210) [`2f1c0ea`](https://github.com/trycourier/courier-web/commit/2f1c0ea69744e5b94475a12704c0a69b63232343) Thanks [@mikemilla](https://github.com/mikemilla)! - Preferences: preview-data, draft mode, descriptions, and digest schedules (with DST handling); inbox preview support and "In-App" channel label fix; toast linear timing. Adds the supporting preview-data/draft preference and inbox API surface to courier-js.

## 3.4.0

### Minor Changes

- Add Courier preferences support and align package documentation.

  - **courier-ui-preferences** (new package): web component for rendering and managing user notification preferences, with full theming support.
  - **courier-js**: add preference V2 client methods and brand/preference types.
  - **courier-ui-core**: add `courier-checkbox` and `courier-radio` components plus color/theme utilities used by preferences.
  - **courier-react-components / courier-react / courier-react-17**: add `CourierPreferences` React wrapper around the preferences web component.
  - All published packages: add READMEs that follow the shared SDK flow and set the npm `homepage` to courier.com.

## 3.3.0

### Minor Changes

- [#178](https://github.com/trycourier/courier-web/pull/178) [`a7e923f`](https://github.com/trycourier/courier-web/commit/a7e923f37be0548c09704df84b90e9f02f7ee576) Thanks [@mikemilla](https://github.com/mikemilla)! - Add Courier preferences support.

  - **courier-ui-preferences** (new package): web component for rendering and managing user notification preferences, with full theming support.
  - **courier-js**: add preference V2 client methods and brand/preference types.
  - **courier-ui-core**: add `courier-checkbox` and `courier-radio` components plus color/theme utilities used by preferences.
  - **courier-react-components / courier-react / courier-react-17**: add `CourierPreferences` React wrapper around the preferences web component.

## 3.2.0

### Minor Changes

- [#175](https://github.com/trycourier/courier-web/pull/175) [`07acd75`](https://github.com/trycourier/courier-web/commit/07acd755b97bb6082115f7f2437d1bb5d44129a2) Thanks [@mikemilla](https://github.com/mikemilla)! - Add digest schedule support to preferences: getDigestSchedules API, digestSchedule field on putUserPreferenceTopic, and expose through useCourier hook

## 3.1.3

### Patch Changes

- [#173](https://github.com/trycourier/courier-web/pull/173) [`4fdef42`](https://github.com/trycourier/courier-web/commit/4fdef42cd19ec08977f02731cb7217c0238c9f06) Thanks [@mikemilla](https://github.com/mikemilla)! - Fix ListClient auth to use client-facing endpoints with proper x-courier-client-key header and JWT auth. Add deprecation warnings to functions accepting clientKey parameter. Enable skippable list subscription tests.

## 3.1.2

### Patch Changes

- [#169](https://github.com/trycourier/courier-web/pull/169) [`903f89b`](https://github.com/trycourier/courier-web/commit/903f89bc281b106bdb8df2797ad2ff1af5d4226f) Thanks [@mikemilla](https://github.com/mikemilla)! - Batch open requests to reduce network overhead. Multiple messages becoming visible within a short window are now collected and sent to the server in a single GraphQL mutation instead of individual requests per message.

## 3.1.1

### Patch Changes

- [#158](https://github.com/trycourier/courier-web/pull/158) [`7be3434`](https://github.com/trycourier/courier-web/commit/7be3434b784581ffc1866819d07b93d6c7c247fb) Thanks [@Gabrielgvl](https://github.com/Gabrielgvl)! - Add EU endpoint presets for Courier web SDK consumers.

## 3.1.0

### Minor Changes

- [#146](https://github.com/trycourier/courier-web/pull/146) [`a3bf046`](https://github.com/trycourier/courier-web/commit/a3bf046e66cc003bfc5e4d2fa8206a9330638335) Thanks [@mikemilla](https://github.com/mikemilla)! - GraphQL Preferences and Toast Crash fix

## 3.0.0

### Major Changes

- [#135](https://github.com/trycourier/courier-web/pull/135) [`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7) Thanks [@mikemilla](https://github.com/mikemilla)! - Updated architecture for Feed and Tab support for Inbox

### Minor Changes

- [#135](https://github.com/trycourier/courier-web/pull/135) [`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7) Thanks [@mikemilla](https://github.com/mikemilla)! - Add support for a user-defined feeds and tabs in the Inbox. Tabs can be filtered by archived and read status, and a set of tags.

## 2.1.3

### Patch Changes

- [#132](https://github.com/trycourier/courier-web/pull/132) [`1b99be2`](https://github.com/trycourier/courier-web/commit/1b99be223433bb05889abec2475a8df5387e8c63) Thanks [@mikemilla](https://github.com/mikemilla)! - Exposing more types

## 2.1.2

### Patch Changes

- [#132](https://github.com/trycourier/courier-web/pull/132) [`1b99be2`](https://github.com/trycourier/courier-web/commit/1b99be223433bb05889abec2475a8df5387e8c63) Thanks [@mikemilla](https://github.com/mikemilla)! - Exposing more types

## 2.1.1

### Patch Changes

- [#122](https://github.com/trycourier/courier-web/pull/122) [`1baf251`](https://github.com/trycourier/courier-web/commit/1baf251523794771cfe6a86724b84ab1f69f79bd) Thanks [@danasilver](https://github.com/danasilver)! - Fix an issue where duplicate messages may appear when a message arrives in real-time.

## 2.1.0

### Minor Changes

- [#95](https://github.com/trycourier/courier-web/pull/95) [`5ba0d27`](https://github.com/trycourier/courier-web/commit/5ba0d27bea31df4e8851642d3621fb15375ef03d) Thanks [@danasilver](https://github.com/danasilver)! - Remove `connectionId` from `CourierProps`. The SDK will always generate a connection ID for a `CourierClient`.

### Patch Changes

- [#102](https://github.com/trycourier/courier-web/pull/102) [`48e49ae`](https://github.com/trycourier/courier-web/commit/48e49ae6ce89517c101f091d09a11c4a45e7a929) Thanks [@danasilver](https://github.com/danasilver)! - Report Courier UA over WS via query params.

- [#91](https://github.com/trycourier/courier-web/pull/91) [`b0260a2`](https://github.com/trycourier/courier-web/commit/b0260a2648d31fd80a1730e999e2b9cb8bc67144) Thanks [@danasilver](https://github.com/danasilver)! - Report the Courier User Agent to WebSocket and HTTP endpoints.
