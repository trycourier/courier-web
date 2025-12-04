# @trycourier/courier-js

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
