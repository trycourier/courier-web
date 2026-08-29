# @trycourier/courier-ui-preferences

## 1.3.1

### Patch Changes

- Updated dependencies [[`53396e7`](https://github.com/trycourier/courier-web/commit/53396e7c0484217b6a996b8768813f9703d4f053)]:
  - @trycourier/courier-js@3.7.0
  - @trycourier/courier-ui-core@2.5.0

## 1.3.0

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

### Patch Changes

- Updated dependencies [[`10c5e71`](https://github.com/trycourier/courier-web/commit/10c5e716233ce5573f5d89cdd304a80f8186b6c7)]:
  - @trycourier/courier-js@3.6.0
  - @trycourier/courier-ui-core@2.4.0

## 1.2.2

### Patch Changes

- [#244](https://github.com/trycourier/courier-web/pull/244) [`021b922`](https://github.com/trycourier/courier-web/commit/021b922af93b1ec1893e4b310fc0ab607dcee76e) Thanks [@mikemilla](https://github.com/mikemilla)! - Version bump only, so every package moves to a version the registry has not seen. No functional change.

  These three sat at versions already on npm while the rest of the packages released, and `changeset publish` attempts every package on each run — the already-published ones come back rejected and take the whole Release run down with them.

- Updated dependencies [[`021b922`](https://github.com/trycourier/courier-web/commit/021b922af93b1ec1893e4b310fc0ab607dcee76e)]:
  - @trycourier/courier-js@3.5.1
  - @trycourier/courier-ui-core@2.3.1

## 1.2.1

### Patch Changes

- Updated dependencies [[`1a895bb`](https://github.com/trycourier/courier-web/commit/1a895bbb472b9b71ab26f69c1d36e3d2d0c44e3f)]:
  - @trycourier/courier-ui-core@2.3.0

## 1.2.0

### Minor Changes

- [#210](https://github.com/trycourier/courier-web/pull/210) [`2f1c0ea`](https://github.com/trycourier/courier-web/commit/2f1c0ea69744e5b94475a12704c0a69b63232343) Thanks [@mikemilla](https://github.com/mikemilla)! - Preferences: preview-data, draft mode, descriptions, and digest schedules (with DST handling); inbox preview support and "In-App" channel label fix; toast linear timing. Adds the supporting preview-data/draft preference and inbox API surface to courier-js.

### Patch Changes

- Updated dependencies [[`2f1c0ea`](https://github.com/trycourier/courier-web/commit/2f1c0ea69744e5b94475a12704c0a69b63232343)]:
  - @trycourier/courier-js@3.5.0

## 1.1.1

### Patch Changes

- [#196](https://github.com/trycourier/courier-web/pull/196) [`0fbf096`](https://github.com/trycourier/courier-web/commit/0fbf0962f961dd135e94d87be9177994315b5979) Thanks [@mikemilla](https://github.com/mikemilla)! - Scope all injected global CSS selectors to their component tags so they can no longer leak into and clobber host-app styles (C-18926).

  - **courier-ui-core**: the inbox empty/error state (`CourierInfoState`) was injecting a bare, global `.container` rule into the page; now scoped to `courier-info-state`. Also scoped the `.courier-checkbox*` and `.courier-radio*` selectors.
  - **courier-ui-toast**: renamed the generic global keyframes `show` / `hide` / `auto-dismiss` to `courier-toast-*` so they can't collide with a host app's `@keyframes`.
  - **courier-ui-preferences**: scoped all `.courier-*` class selectors (preferences root, section, topic, toggle, channel-routing, digest-schedule) to their component tags.

- Updated dependencies [[`0fbf096`](https://github.com/trycourier/courier-web/commit/0fbf0962f961dd135e94d87be9177994315b5979)]:
  - @trycourier/courier-ui-core@2.2.1

## 1.1.0

### Minor Changes

- [#190](https://github.com/trycourier/courier-web/pull/190) [`2d4b14c`](https://github.com/trycourier/courier-web/commit/2d4b14cc3efe92698a612a0d1b5ed75952f1f54e) Thanks [@mikemilla](https://github.com/mikemilla)! - Rework per-topic channel customization into a collapsible disclosure: an arrow
  row that expands to enable custom routing and reveal the channel chips, and
  collapses to fall back to the topic's default routing. The expanded label
  defaults to the collapsed `customizeLabel` and can be overridden via the new
  `customizeActiveLabel` setter.

## 1.0.2

### Patch Changes

- Add Courier preferences support and align package documentation.

  - **courier-ui-preferences** (new package): web component for rendering and managing user notification preferences, with full theming support.
  - **courier-js**: add preference V2 client methods and brand/preference types.
  - **courier-ui-core**: add `courier-checkbox` and `courier-radio` components plus color/theme utilities used by preferences.
  - **courier-react-components / courier-react / courier-react-17**: add `CourierPreferences` React wrapper around the preferences web component.
  - All published packages: add READMEs that follow the shared SDK flow and set the npm `homepage` to courier.com.

- Updated dependencies []:
  - @trycourier/courier-js@3.4.0
  - @trycourier/courier-ui-core@2.2.0

## 1.0.1

### Patch Changes

- Updated dependencies [[`a7e923f`](https://github.com/trycourier/courier-web/commit/a7e923f37be0548c09704df84b90e9f02f7ee576)]:
  - @trycourier/courier-js@3.3.0
  - @trycourier/courier-ui-core@2.1.0
