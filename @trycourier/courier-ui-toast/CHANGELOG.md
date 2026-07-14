# @trycourier/courier-ui-toast

## 2.1.9

### Patch Changes

- [#215](https://github.com/trycourier/courier-web/pull/215) [`1a895bb`](https://github.com/trycourier/courier-web/commit/1a895bbb472b9b71ab26f69c1d36e3d2d0c44e3f) Thanks [@mikemilla](https://github.com/mikemilla)! - Toast items now render a visible subtle border in dark mode (the previous default matched the background color, so no border appeared), and the dark-mode hover/active backgrounds are softer, matching the inbox list item's effective hover colors. Adds opaque dark-surface shades `gray[700]`/`gray[800]` to `CourierColors`.

- Updated dependencies [[`1a895bb`](https://github.com/trycourier/courier-web/commit/1a895bbb472b9b71ab26f69c1d36e3d2d0c44e3f)]:
  - @trycourier/courier-ui-core@2.3.0

## 2.1.8

### Patch Changes

- [#210](https://github.com/trycourier/courier-web/pull/210) [`2f1c0ea`](https://github.com/trycourier/courier-web/commit/2f1c0ea69744e5b94475a12704c0a69b63232343) Thanks [@mikemilla](https://github.com/mikemilla)! - Preferences: preview-data, draft mode, descriptions, and digest schedules (with DST handling); inbox preview support and "In-App" channel label fix; toast linear timing. Adds the supporting preview-data/draft preference and inbox API surface to courier-js.

- Updated dependencies [[`2f1c0ea`](https://github.com/trycourier/courier-web/commit/2f1c0ea69744e5b94475a12704c0a69b63232343)]:
  - @trycourier/courier-js@3.5.0

## 2.1.7

### Patch Changes

- [#196](https://github.com/trycourier/courier-web/pull/196) [`0fbf096`](https://github.com/trycourier/courier-web/commit/0fbf0962f961dd135e94d87be9177994315b5979) Thanks [@mikemilla](https://github.com/mikemilla)! - Scope all injected global CSS selectors to their component tags so they can no longer leak into and clobber host-app styles (C-18926).

  - **courier-ui-core**: the inbox empty/error state (`CourierInfoState`) was injecting a bare, global `.container` rule into the page; now scoped to `courier-info-state`. Also scoped the `.courier-checkbox*` and `.courier-radio*` selectors.
  - **courier-ui-toast**: renamed the generic global keyframes `show` / `hide` / `auto-dismiss` to `courier-toast-*` so they can't collide with a host app's `@keyframes`.
  - **courier-ui-preferences**: scoped all `.courier-*` class selectors (preferences root, section, topic, toggle, channel-routing, digest-schedule) to their component tags.

- Updated dependencies [[`0fbf096`](https://github.com/trycourier/courier-web/commit/0fbf0962f961dd135e94d87be9177994315b5979)]:
  - @trycourier/courier-ui-core@2.2.1

## 2.1.6

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

## 2.1.5

### Patch Changes

- Updated dependencies [[`a7e923f`](https://github.com/trycourier/courier-web/commit/a7e923f37be0548c09704df84b90e9f02f7ee576)]:
  - @trycourier/courier-js@3.3.0
  - @trycourier/courier-ui-core@2.1.0

## 2.1.4

### Patch Changes

- Updated dependencies [[`07acd75`](https://github.com/trycourier/courier-web/commit/07acd755b97bb6082115f7f2437d1bb5d44129a2)]:
  - @trycourier/courier-js@3.2.0

## 2.1.3

### Patch Changes

- Updated dependencies [[`4fdef42`](https://github.com/trycourier/courier-web/commit/4fdef42cd19ec08977f02731cb7217c0238c9f06)]:
  - @trycourier/courier-js@3.1.3

## 2.1.2

### Patch Changes

- Updated dependencies [[`903f89b`](https://github.com/trycourier/courier-web/commit/903f89bc281b106bdb8df2797ad2ff1af5d4226f)]:
  - @trycourier/courier-js@3.1.2

## 2.1.1

### Patch Changes

- [#158](https://github.com/trycourier/courier-web/pull/158) [`7be3434`](https://github.com/trycourier/courier-web/commit/7be3434b784581ffc1866819d07b93d6c7c247fb) Thanks [@Gabrielgvl](https://github.com/Gabrielgvl)! - Add EU endpoint presets for Courier web SDK consumers.

- Updated dependencies [[`7be3434`](https://github.com/trycourier/courier-web/commit/7be3434b784581ffc1866819d07b93d6c7c247fb)]:
  - @trycourier/courier-js@3.1.1

## 2.1.0

### Minor Changes

- [#146](https://github.com/trycourier/courier-web/pull/146) [`a3bf046`](https://github.com/trycourier/courier-web/commit/a3bf046e66cc003bfc5e4d2fa8206a9330638335) Thanks [@mikemilla](https://github.com/mikemilla)! - GraphQL Preferences and Toast Crash fix

### Patch Changes

- Updated dependencies [[`a3bf046`](https://github.com/trycourier/courier-web/commit/a3bf046e66cc003bfc5e4d2fa8206a9330638335)]:
  - @trycourier/courier-js@3.1.0

## 2.0.0

### Major Changes

- [#135](https://github.com/trycourier/courier-web/pull/135) [`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7) Thanks [@mikemilla](https://github.com/mikemilla)! - Updated architecture for Feed and Tab support for Inbox

### Patch Changes

- Updated dependencies [[`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7), [`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7)]:
  - @trycourier/courier-ui-core@2.0.0
  - @trycourier/courier-js@3.0.0

## 1.0.4

### Patch Changes

- Updated dependencies [[`1b99be2`](https://github.com/trycourier/courier-web/commit/1b99be223433bb05889abec2475a8df5387e8c63)]:
  - @trycourier/courier-js@2.1.3

## 1.0.3

### Patch Changes

- Updated dependencies [[`1b99be2`](https://github.com/trycourier/courier-web/commit/1b99be223433bb05889abec2475a8df5387e8c63)]:
  - @trycourier/courier-js@2.1.2

## 1.0.2

### Patch Changes

- [#126](https://github.com/trycourier/courier-web/pull/126) [`3d8e485`](https://github.com/trycourier/courier-web/commit/3d8e485193353c2755b94c92fec119a18149723b) Thanks [@danasilver](https://github.com/danasilver)! - Fix an unhandled promise rejection opening a real-time connection for toasts.

## 1.0.1

### Patch Changes

- [#122](https://github.com/trycourier/courier-web/pull/122) [`1baf251`](https://github.com/trycourier/courier-web/commit/1baf251523794771cfe6a86724b84ab1f69f79bd) Thanks [@danasilver](https://github.com/danasilver)! - Fix an issue where duplicate messages may appear when a message arrives in real-time.

- Updated dependencies [[`1baf251`](https://github.com/trycourier/courier-web/commit/1baf251523794771cfe6a86724b84ab1f69f79bd)]:
  - @trycourier/courier-js@2.1.1

## 1.0.0

### Major Changes

- [#106](https://github.com/trycourier/courier-web/pull/106) [`8a59e4c`](https://github.com/trycourier/courier-web/commit/8a59e4c847105a2149d855747106e502080d4cfd) Thanks [@danasilver](https://github.com/danasilver)! - Add toast components to the SDKs. Toasts are dismissible pop-up messages synced with Courier Inbox.

### Patch Changes

- Updated dependencies [[`fd04101`](https://github.com/trycourier/courier-web/commit/fd04101cf01444f33d66f2ece48725c28eb540a6)]:
  - @trycourier/courier-ui-core@1.0.14
