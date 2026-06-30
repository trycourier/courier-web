# @trycourier/courier-ui-preferences

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
