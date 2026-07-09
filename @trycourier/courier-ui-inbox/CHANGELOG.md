# @trycourier/courier-ui-inbox

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
