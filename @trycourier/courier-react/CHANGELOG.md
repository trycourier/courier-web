# @trycourier/courier-react

## 8.2.0

### Minor Changes

- [#106](https://github.com/trycourier/courier-web/pull/106) [`8a59e4c`](https://github.com/trycourier/courier-web/commit/8a59e4c847105a2149d855747106e502080d4cfd) Thanks [@danasilver](https://github.com/danasilver)! - Add toast components to the SDKs. Toasts are dismissible pop-up messages synced with Courier Inbox.

### Patch Changes

- [#107](https://github.com/trycourier/courier-web/pull/107) [`bada39c`](https://github.com/trycourier/courier-web/commit/bada39c48c181d51275b6445d460b22fdf572d56) Thanks [@danasilver](https://github.com/danasilver)! - Fix an issue where custom React components were missing their event handlers.
  Fix an issue where custom React components may not be rendered.

- [#110](https://github.com/trycourier/courier-web/pull/110) [`fd04101`](https://github.com/trycourier/courier-web/commit/fd04101cf01444f33d66f2ece48725c28eb540a6) Thanks [@danasilver](https://github.com/danasilver)! - Reorganize theme management to improve maintainability.

- Updated dependencies [[`8a59e4c`](https://github.com/trycourier/courier-web/commit/8a59e4c847105a2149d855747106e502080d4cfd), [`bada39c`](https://github.com/trycourier/courier-web/commit/bada39c48c181d51275b6445d460b22fdf572d56), [`fd04101`](https://github.com/trycourier/courier-web/commit/fd04101cf01444f33d66f2ece48725c28eb540a6)]:
  - @trycourier/courier-react-components@1.2.0
  - @trycourier/courier-ui-inbox@1.2.0
  - @trycourier/courier-ui-toast@1.0.0
  - @trycourier/courier-ui-core@1.0.14

## 8.1.0

### Minor Changes

- [#95](https://github.com/trycourier/courier-web/pull/95) [`5ba0d27`](https://github.com/trycourier/courier-web/commit/5ba0d27bea31df4e8851642d3621fb15375ef03d) Thanks [@danasilver](https://github.com/danasilver)! - Remove `connectionId` from `CourierProps`. The SDK will always generate a connection ID for a `CourierClient`.

### Patch Changes

- [#91](https://github.com/trycourier/courier-web/pull/91) [`b0260a2`](https://github.com/trycourier/courier-web/commit/b0260a2648d31fd80a1730e999e2b9cb8bc67144) Thanks [@danasilver](https://github.com/danasilver)! - Report the Courier User Agent to WebSocket and HTTP endpoints.

- Updated dependencies [[`48e49ae`](https://github.com/trycourier/courier-web/commit/48e49ae6ce89517c101f091d09a11c4a45e7a929), [`5ba0d27`](https://github.com/trycourier/courier-web/commit/5ba0d27bea31df4e8851642d3621fb15375ef03d), [`b0260a2`](https://github.com/trycourier/courier-web/commit/b0260a2648d31fd80a1730e999e2b9cb8bc67144)]:
  - @trycourier/courier-js@2.1.0
  - @trycourier/courier-ui-inbox@1.1.0
  - @trycourier/courier-react-components@1.1.0
