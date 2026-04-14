# @trycourier/courier-js

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
