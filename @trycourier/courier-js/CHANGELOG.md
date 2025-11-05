# @trycourier/courier-js

## 2.1.1

### Patch Changes

- [#116](https://github.com/trycourier/courier-web/pull/116) [`ef426cb`](https://github.com/trycourier/courier-web/commit/ef426cb34eb79bd320b680c5faf62963ca70b2ce) Thanks [@danasilver](https://github.com/danasilver)! - Fix an issue where duplicate messages may appear when a message arrives in real-time.

## 2.1.0

### Minor Changes

- [#95](https://github.com/trycourier/courier-web/pull/95) [`5ba0d27`](https://github.com/trycourier/courier-web/commit/5ba0d27bea31df4e8851642d3621fb15375ef03d) Thanks [@danasilver](https://github.com/danasilver)! - Remove `connectionId` from `CourierProps`. The SDK will always generate a connection ID for a `CourierClient`.

### Patch Changes

- [#102](https://github.com/trycourier/courier-web/pull/102) [`48e49ae`](https://github.com/trycourier/courier-web/commit/48e49ae6ce89517c101f091d09a11c4a45e7a929) Thanks [@danasilver](https://github.com/danasilver)! - Report Courier UA over WS via query params.

- [#91](https://github.com/trycourier/courier-web/pull/91) [`b0260a2`](https://github.com/trycourier/courier-web/commit/b0260a2648d31fd80a1730e999e2b9cb8bc67144) Thanks [@danasilver](https://github.com/danasilver)! - Report the Courier User Agent to WebSocket and HTTP endpoints.
