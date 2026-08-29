# @trycourier/courier-ui-core

## 2.5.0

### Minor Changes

- [#250](https://github.com/trycourier/courier-web/pull/250) [`53396e7`](https://github.com/trycourier/courier-web/commit/53396e7c0484217b6a996b8768813f9703d4f053) Thanks [@mikemilla](https://github.com/mikemilla)! - Render the button style a message action asks for, track action clicks, and render markdown previews

  Inbox and toast actions now respect the styling their template configured. `style: "secondary"`
  or `"tertiary"` draws the action's colour as an outline instead of a fill, matching how the same
  action renders in email, and `style: "link"` renders as an inline link rather than a button. A
  filled and an outlined action in the same row sit at the same height. This needed the inbox query
  to ask for `style`, which it never did — that is why every action previously rendered filled.

  Action styling is themable through a new `actions` block on the inbox and toast list item themes,
  with `outlined` and `link` sub-blocks for the two other looks. A value set on the theme outranks
  the one the action carries, so an untouched theme renders what the template configured and a set
  one overrides it. The shipped default themes therefore no longer define `actions` at all — the
  defaults come from the button, per mode, so integrators reading
  `defaultLightTheme.inbox.list.item.actions` now get `undefined`.

  Clicking an action reports the click to Courier automatically, using the tracking id the action
  carries. `markActionAsClicked(action, messageId)` is exported for custom list item renderers.

  A message's title and preview are rendered as markdown — bold, italic, strikethrough, links,
  quotes and list markers — because the inbox channel serializes its preview through markdown.
  Plain text is unaffected.

## 2.4.0

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

## 2.3.1

### Patch Changes

- [#244](https://github.com/trycourier/courier-web/pull/244) [`021b922`](https://github.com/trycourier/courier-web/commit/021b922af93b1ec1893e4b310fc0ab607dcee76e) Thanks [@mikemilla](https://github.com/mikemilla)! - Version bump only, so every package moves to a version the registry has not seen. No functional change.

  These three sat at versions already on npm while the rest of the packages released, and `changeset publish` attempts every package on each run — the already-published ones come back rejected and take the whole Release run down with them.

## 2.3.0

### Minor Changes

- [#215](https://github.com/trycourier/courier-web/pull/215) [`1a895bb`](https://github.com/trycourier/courier-web/commit/1a895bbb472b9b71ab26f69c1d36e3d2d0c44e3f) Thanks [@mikemilla](https://github.com/mikemilla)! - Toast items now render a visible subtle border in dark mode (the previous default matched the background color, so no border appeared), and the dark-mode hover/active backgrounds are softer, matching the inbox list item's effective hover colors. Adds opaque dark-surface shades `gray[700]`/`gray[800]` to `CourierColors`.

## 2.2.1

### Patch Changes

- [#196](https://github.com/trycourier/courier-web/pull/196) [`0fbf096`](https://github.com/trycourier/courier-web/commit/0fbf0962f961dd135e94d87be9177994315b5979) Thanks [@mikemilla](https://github.com/mikemilla)! - Scope all injected global CSS selectors to their component tags so they can no longer leak into and clobber host-app styles (C-18926).

  - **courier-ui-core**: the inbox empty/error state (`CourierInfoState`) was injecting a bare, global `.container` rule into the page; now scoped to `courier-info-state`. Also scoped the `.courier-checkbox*` and `.courier-radio*` selectors.
  - **courier-ui-toast**: renamed the generic global keyframes `show` / `hide` / `auto-dismiss` to `courier-toast-*` so they can't collide with a host app's `@keyframes`.
  - **courier-ui-preferences**: scoped all `.courier-*` class selectors (preferences root, section, topic, toggle, channel-routing, digest-schedule) to their component tags.

## 2.2.0

### Minor Changes

- Add Courier preferences support and align package documentation.

  - **courier-ui-preferences** (new package): web component for rendering and managing user notification preferences, with full theming support.
  - **courier-js**: add preference V2 client methods and brand/preference types.
  - **courier-ui-core**: add `courier-checkbox` and `courier-radio` components plus color/theme utilities used by preferences.
  - **courier-react-components / courier-react / courier-react-17**: add `CourierPreferences` React wrapper around the preferences web component.
  - All published packages: add READMEs that follow the shared SDK flow and set the npm `homepage` to courier.com.

## 2.1.0

### Minor Changes

- [#178](https://github.com/trycourier/courier-web/pull/178) [`a7e923f`](https://github.com/trycourier/courier-web/commit/a7e923f37be0548c09704df84b90e9f02f7ee576) Thanks [@mikemilla](https://github.com/mikemilla)! - Add Courier preferences support.

  - **courier-ui-preferences** (new package): web component for rendering and managing user notification preferences, with full theming support.
  - **courier-js**: add preference V2 client methods and brand/preference types.
  - **courier-ui-core**: add `courier-checkbox` and `courier-radio` components plus color/theme utilities used by preferences.
  - **courier-react-components / courier-react / courier-react-17**: add `CourierPreferences` React wrapper around the preferences web component.

## 2.0.0

### Major Changes

- [#135](https://github.com/trycourier/courier-web/pull/135) [`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7) Thanks [@mikemilla](https://github.com/mikemilla)! - Updated architecture for Feed and Tab support for Inbox

### Minor Changes

- [#135](https://github.com/trycourier/courier-web/pull/135) [`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7) Thanks [@mikemilla](https://github.com/mikemilla)! - Add support for a user-defined feeds and tabs in the Inbox. Tabs can be filtered by archived and read status, and a set of tags.

## 1.0.14

### Patch Changes

- [#110](https://github.com/trycourier/courier-web/pull/110) [`fd04101`](https://github.com/trycourier/courier-web/commit/fd04101cf01444f33d66f2ece48725c28eb540a6) Thanks [@danasilver](https://github.com/danasilver)! - Reorganize theme management to improve maintainability.
