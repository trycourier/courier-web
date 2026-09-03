# @trycourier/courier-ui-inbox

## 2.7.0

### Minor Changes

- [#254](https://github.com/trycourier/courier-web/pull/254) [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2) Thanks [@mikemilla](https://github.com/mikemilla)! - Name the action theme blocks after the styles they apply to

  The blocks were named for the look — `outlined` — while a template asks for the value —
  `secondary`. Anyone theming a row of actions had to hold a mapping in their head between what
  they sent and what they styled, and `tertiary` had no name of its own at all.

  The blocks are now `button`, `secondary`, `tertiary` and `link`, one per `action.style`, so a
  theme reads the same as the template that feeds it. `link` is unchanged; `outlined` becomes
  `secondary`; `button` and `tertiary` are new, having previously been unthemable and folded into
  the top level and the outlined block respectively.

  ```diff
    actions: {
      font: { family: 'Inter' },
  -   outlined: { border: '1px solid #E5E5E5' }
  +   secondary: { border: '1px solid #E5E5E5' }
    }
  ```

  The top level still applies to every action, and an action's own Elemental styling still wins
  over both. None of these keys has shipped to npm yet, so nothing in a released version breaks.

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

### Patch Changes

- [#254](https://github.com/trycourier/courier-web/pull/254) [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2) Thanks [@mikemilla](https://github.com/mikemilla)! - Fix three ways a message action rendered wrong once it stopped carrying color

  All three were masked while every action arrived with a fill substituted by the send pipeline.
  With the action reduced to its style, the defaults underneath it are the whole appearance, and
  they were not right.

  **An action ignored a system theme flip.** Everything else in the inbox re-reads its theme
  through the theme manager's subscription. `CourierButton` styles itself once, in its
  constructor, resolving `mode: 'system'` against the theme in force at that moment — and
  `themeManager.mode` is the _user's_ setting, which is `'system'` unless an integrator pinned
  it. It never overrode `onSystemThemeChange`, so an OS flip left the actions, and only the
  actions, wearing the mode that had just ended: a near-black filled button on a dark list, or a
  white outlined one. It now restyles on the flip, and a button pinned to `light` or `dark` still
  ignores the OS.

  **An outlined action had no visible outline.** Its border was `colors.border` — the hairline
  rows are separated with — which is about 1.3:1 against the surface the same button is filled
  with, in either mode. An outlined action was indistinguishable from a borderless one unless the
  template gave it a color, which templates no longer do. It now uses `gray[600]`, which clears
  3:1 against both faces, so one value serves light and dark. `colors.border` itself is unchanged,
  so dividers are unaffected.

  **A link sat too high beside a taller action.** Not a defect in the rendered inbox — a native
  button centers its own content — but the row stretches its actions so their borders line up, so
  anything drawn as a `div` rather than a `button` has to say it centers. Noted here because the
  theme contract now depends on it.

- Updated dependencies [[`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2), [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2), [`53396e7`](https://github.com/trycourier/courier-web/commit/53396e7c0484217b6a996b8768813f9703d4f053), [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2), [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2), [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2), [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2), [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2), [`e77b2f6`](https://github.com/trycourier/courier-web/commit/e77b2f6465ca1f1a02cb2862daa16db5ec9dc3a2)]:
  - @trycourier/courier-ui-core@2.5.0
  - @trycourier/courier-js@3.7.0

## 2.6.0

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

## 2.5.3

### Patch Changes

- Updated dependencies [[`021b922`](https://github.com/trycourier/courier-web/commit/021b922af93b1ec1893e4b310fc0ab607dcee76e)]:
  - @trycourier/courier-js@3.5.1
  - @trycourier/courier-ui-core@2.3.1

## 2.5.2

### Patch Changes

- [#242](https://github.com/trycourier/courier-web/pull/242) [`6cfcf8c`](https://github.com/trycourier/courier-web/commit/6cfcf8c1dba780d4fee306dbfa0aa7f3590720cf) Thanks [@mikemilla](https://github.com/mikemilla)! - Report the injected unread count to header factories in preview mode. The count came from the shared datastore, which preview mode deliberately detaches from, so a custom header rendered alongside `previewMessages` always read zero.

  The unread count badge and the option menu now use open shadow roots, like every other component. A closed root cannot be read back from the DOM, so screenshot and snapshot tooling silently dropped the unread badge from anything it captured.

## 2.5.1

### Patch Changes

- [#239](https://github.com/trycourier/courier-web/pull/239) [`c346faa`](https://github.com/trycourier/courier-web/commit/c346faa5c1d66fc2015e304d600d202561df4615) Thanks [@mikemilla](https://github.com/mikemilla)! - Fix bulk archive and read leaving a message visible in the feed.

  `archiveAllMessages`, `readAllMessages`, `archiveReadMessages`, and the socket handler for the `archive-all` / `archive-read` / `mark-all-read` events all chose which messages to mutate by reading the datastore's global message store. Loading a dataset syncs its server results into that store but never overwrites an entry already present, so the global copy of a message can be further along than the copy a dataset is showing — already archived by an earlier archive-all, for instance, while the server still returns it as unarchived and a reload puts it back into the inbox dataset.

  Selecting from the global store in that state skipped the message, so its row stayed on screen and repeating the action could never clear it: the same check skipped it every time. Marking all as read appeared to fix it only because that path keys off `read` rather than `archived`.

  These operations now collect their candidates from the datasets as well as the global store, preferring a dataset's own copy, so they reconcile whatever is actually rendered.

## 2.5.0

### Minor Changes

- [#219](https://github.com/trycourier/courier-web/pull/219) [`0efd6f1`](https://github.com/trycourier/courier-web/commit/0efd6f134a768762c1496bd6baa9ec1d76172279) Thanks [@mikemilla](https://github.com/mikemilla)! - Inbox: support a `from` date filter on feed/tab filters. `CourierInboxDatasetFilter` now accepts an optional ISO 8601 `from` string, which is forwarded to the underlying `@trycourier/courier-js` query (and applied to real-time/optimistic messages) so messages created before that date are excluded from the inbox. Previously the UI component dropped `from`, so a configured "From Date" had no effect.

## 2.4.10

### Patch Changes

- Updated dependencies [[`1a895bb`](https://github.com/trycourier/courier-web/commit/1a895bbb472b9b71ab26f69c1d36e3d2d0c44e3f)]:
  - @trycourier/courier-ui-core@2.3.0

## 2.4.9

### Patch Changes

- [#210](https://github.com/trycourier/courier-web/pull/210) [`2f1c0ea`](https://github.com/trycourier/courier-web/commit/2f1c0ea69744e5b94475a12704c0a69b63232343) Thanks [@mikemilla](https://github.com/mikemilla)! - Preferences: preview-data, draft mode, descriptions, and digest schedules (with DST handling); inbox preview support and "In-App" channel label fix; toast linear timing. Adds the supporting preview-data/draft preference and inbox API surface to courier-js.

- Updated dependencies [[`2f1c0ea`](https://github.com/trycourier/courier-web/commit/2f1c0ea69744e5b94475a12704c0a69b63232343)]:
  - @trycourier/courier-js@3.5.0

## 2.4.8

### Patch Changes

- Updated dependencies [[`0fbf096`](https://github.com/trycourier/courier-web/commit/0fbf0962f961dd135e94d87be9177994315b5979)]:
  - @trycourier/courier-ui-core@2.2.1

## 2.4.7

### Patch Changes

- [#185](https://github.com/trycourier/courier-web/pull/185) [`7978149`](https://github.com/trycourier/courier-web/commit/797814948d77779eb95ff28f78c439019ad15fc3) Thanks [@mikemilla](https://github.com/mikemilla)! - Guard inbox Custom Element constructors against being invoked without props.

  `CourierInboxList`, `CourierInboxHeader`, and `CourierInboxPaginationListItem` are registered as Custom Elements, so the browser can construct them with no arguments (e.g. during `cloneNode()` from DOM snapshot libraries like `dom-to-image`). The constructors previously destructured `props` unconditionally and threw an unhandled `TypeError`. They now return early when `props` is undefined. Fixes #150.

## 2.4.6

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

## 2.4.5

### Patch Changes

- Updated dependencies [[`a7e923f`](https://github.com/trycourier/courier-web/commit/a7e923f37be0548c09704df84b90e9f02f7ee576)]:
  - @trycourier/courier-js@3.3.0
  - @trycourier/courier-ui-core@2.1.0

## 2.4.4

### Patch Changes

- Updated dependencies [[`07acd75`](https://github.com/trycourier/courier-web/commit/07acd755b97bb6082115f7f2437d1bb5d44129a2)]:
  - @trycourier/courier-js@3.2.0

## 2.4.3

### Patch Changes

- Updated dependencies [[`4fdef42`](https://github.com/trycourier/courier-web/commit/4fdef42cd19ec08977f02731cb7217c0238c9f06)]:
  - @trycourier/courier-js@3.1.3

## 2.4.2

### Patch Changes

- [#169](https://github.com/trycourier/courier-web/pull/169) [`903f89b`](https://github.com/trycourier/courier-web/commit/903f89bc281b106bdb8df2797ad2ff1af5d4226f) Thanks [@mikemilla](https://github.com/mikemilla)! - Batch open requests to reduce network overhead. Multiple messages becoming visible within a short window are now collected and sent to the server in a single GraphQL mutation instead of individual requests per message.

- [#166](https://github.com/trycourier/courier-web/pull/166) [`bd79590`](https://github.com/trycourier/courier-web/commit/bd79590c9b21cd971372614d4b318752ce0201b0) Thanks [@mikemilla](https://github.com/mikemilla)! - Fix inbox unread counts after mark-all-read, archive-all, and related websocket events, and when cross-dataset message mutations remove messages from a tab’s filter.

- Updated dependencies [[`903f89b`](https://github.com/trycourier/courier-web/commit/903f89bc281b106bdb8df2797ad2ff1af5d4226f)]:
  - @trycourier/courier-js@3.1.2

## 2.4.1

### Patch Changes

- [#158](https://github.com/trycourier/courier-web/pull/158) [`7be3434`](https://github.com/trycourier/courier-web/commit/7be3434b784581ffc1866819d07b93d6c7c247fb) Thanks [@Gabrielgvl](https://github.com/Gabrielgvl)! - Add EU endpoint presets for Courier web SDK consumers.

- Updated dependencies [[`7be3434`](https://github.com/trycourier/courier-web/commit/7be3434b784581ffc1866819d07b93d6c7c247fb)]:
  - @trycourier/courier-js@3.1.1

## 2.4.0

### Minor Changes

- [#155](https://github.com/trycourier/courier-web/pull/155) [`79ee192`](https://github.com/trycourier/courier-web/commit/79ee19281b74a43634c1b2f83c0a98608b891806) Thanks [@mikemilla](https://github.com/mikemilla)! - Support inline hyperlinks and variables in inbox designer and inbox UI

  - **Designer**: Add optional Variables (key/value) section; substitute `{{variableName}}` in title, body, and action labels/URLs before send. Body supports markdown-style links `[text](url)` which are converted to HTML for display.
  - **Inbox UI**: Render message body/preview as sanitized HTML when it contains markup (e.g. `<a>` from inline links), so inline links are clickable; plain text continues to use textContent.

- [#155](https://github.com/trycourier/courier-web/pull/155) [`79ee192`](https://github.com/trycourier/courier-web/commit/79ee19281b74a43634c1b2f83c0a98608b891806) Thanks [@mikemilla](https://github.com/mikemilla)! - Link support

## 2.3.0

### Minor Changes

- [#145](https://github.com/trycourier/courier-web/pull/145) [`791ef56`](https://github.com/trycourier/courier-web/commit/791ef56d3383d078fbbb08162e8b3e4277b78eea) Thanks [@crrojas88](https://github.com/crrojas88)! - Support inline hyperlinks and variables in inbox designer and inbox UI

  - **Designer**: Add optional Variables (key/value) section; substitute `{{variableName}}` in title, body, and action labels/URLs before send. Body supports markdown-style links `[text](url)` which are converted to HTML for display.
  - **Inbox UI**: Render message body/preview as sanitized HTML when it contains markup (e.g. `<a>` from inline links), so inline links are clickable; plain text continues to use textContent.

- [#145](https://github.com/trycourier/courier-web/pull/145) [`791ef56`](https://github.com/trycourier/courier-web/commit/791ef56d3383d078fbbb08162e8b3e4277b78eea) Thanks [@crrojas88](https://github.com/crrojas88)! - Link support

## 2.2.1

### Patch Changes

- Updated dependencies [[`a3bf046`](https://github.com/trycourier/courier-web/commit/a3bf046e66cc003bfc5e4d2fa8206a9330638335)]:
  - @trycourier/courier-js@3.1.0

## 2.2.0

### Minor Changes

- [#141](https://github.com/trycourier/courier-web/pull/141) [`ce31bd6`](https://github.com/trycourier/courier-web/commit/ce31bd6ca9c8bc8660f474e3b84d23b68709cf2f) Thanks [@mikemilla](https://github.com/mikemilla)! - Header theme change fix

## 2.1.0

### Minor Changes

- [#139](https://github.com/trycourier/courier-web/pull/139) [`9268d3f`](https://github.com/trycourier/courier-web/commit/9268d3f338a6d5606e29569ae802fb7a9df0b011) Thanks [@mikemilla](https://github.com/mikemilla)! - Header theme change fix

## 2.0.0

### Major Changes

- [#135](https://github.com/trycourier/courier-web/pull/135) [`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7) Thanks [@mikemilla](https://github.com/mikemilla)! - Updated architecture for Feed and Tab support for Inbox

### Minor Changes

- [#135](https://github.com/trycourier/courier-web/pull/135) [`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7) Thanks [@mikemilla](https://github.com/mikemilla)! - Add support for a user-defined feeds and tabs in the Inbox. Tabs can be filtered by archived and read status, and a set of tags.

### Patch Changes

- Updated dependencies [[`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7), [`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7)]:
  - @trycourier/courier-ui-core@2.0.0
  - @trycourier/courier-js@3.0.0

## 1.2.3

### Patch Changes

- Updated dependencies [[`1b99be2`](https://github.com/trycourier/courier-web/commit/1b99be223433bb05889abec2475a8df5387e8c63)]:
  - @trycourier/courier-js@2.1.3

## 1.2.2

### Patch Changes

- Updated dependencies [[`1b99be2`](https://github.com/trycourier/courier-web/commit/1b99be223433bb05889abec2475a8df5387e8c63)]:
  - @trycourier/courier-js@2.1.2

## 1.2.1

### Patch Changes

- [#122](https://github.com/trycourier/courier-web/pull/122) [`1baf251`](https://github.com/trycourier/courier-web/commit/1baf251523794771cfe6a86724b84ab1f69f79bd) Thanks [@danasilver](https://github.com/danasilver)! - Fix an issue where duplicate messages may appear when a message arrives in real-time.

- Updated dependencies [[`1baf251`](https://github.com/trycourier/courier-web/commit/1baf251523794771cfe6a86724b84ab1f69f79bd)]:
  - @trycourier/courier-js@2.1.1

## 1.2.0

### Minor Changes

- [#106](https://github.com/trycourier/courier-web/pull/106) [`8a59e4c`](https://github.com/trycourier/courier-web/commit/8a59e4c847105a2149d855747106e502080d4cfd) Thanks [@danasilver](https://github.com/danasilver)! - Add toast components to the SDKs. Toasts are dismissible pop-up messages synced with Courier Inbox.

### Patch Changes

- [#110](https://github.com/trycourier/courier-web/pull/110) [`fd04101`](https://github.com/trycourier/courier-web/commit/fd04101cf01444f33d66f2ece48725c28eb540a6) Thanks [@danasilver](https://github.com/danasilver)! - Reorganize theme management to improve maintainability.

- Updated dependencies [[`fd04101`](https://github.com/trycourier/courier-web/commit/fd04101cf01444f33d66f2ece48725c28eb540a6)]:
  - @trycourier/courier-ui-core@1.0.14

## 1.1.0

### Minor Changes

- [#95](https://github.com/trycourier/courier-web/pull/95) [`5ba0d27`](https://github.com/trycourier/courier-web/commit/5ba0d27bea31df4e8851642d3621fb15375ef03d) Thanks [@danasilver](https://github.com/danasilver)! - Remove `connectionId` from `CourierProps`. The SDK will always generate a connection ID for a `CourierClient`.

### Patch Changes

- [#91](https://github.com/trycourier/courier-web/pull/91) [`b0260a2`](https://github.com/trycourier/courier-web/commit/b0260a2648d31fd80a1730e999e2b9cb8bc67144) Thanks [@danasilver](https://github.com/danasilver)! - Report the Courier User Agent to WebSocket and HTTP endpoints.

- Updated dependencies [[`48e49ae`](https://github.com/trycourier/courier-web/commit/48e49ae6ce89517c101f091d09a11c4a45e7a929), [`5ba0d27`](https://github.com/trycourier/courier-web/commit/5ba0d27bea31df4e8851642d3621fb15375ef03d), [`b0260a2`](https://github.com/trycourier/courier-web/commit/b0260a2648d31fd80a1730e999e2b9cb8bc67144)]:
  - @trycourier/courier-js@2.1.0
