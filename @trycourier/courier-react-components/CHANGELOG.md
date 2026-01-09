# @trycourier/courier-react-components

## 2.0.1

### Patch Changes

- Updated dependencies [[`9268d3f`](https://github.com/trycourier/courier-web/commit/9268d3f338a6d5606e29569ae802fb7a9df0b011)]:
  - @trycourier/courier-ui-inbox@2.1.0

## 2.0.0

### Major Changes

- [#135](https://github.com/trycourier/courier-web/pull/135) [`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7) Thanks [@mikemilla](https://github.com/mikemilla)! - Updated architecture for Feed and Tab support for Inbox

### Minor Changes

- [#135](https://github.com/trycourier/courier-web/pull/135) [`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7) Thanks [@mikemilla](https://github.com/mikemilla)! - Add support for a user-defined feeds and tabs in the Inbox. Tabs can be filtered by archived and read status, and a set of tags.

### Patch Changes

- Updated dependencies [[`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7), [`210a819`](https://github.com/trycourier/courier-web/commit/210a8191277212e97d26108b1434df48e70a8aa7)]:
  - @trycourier/courier-ui-inbox@2.0.0
  - @trycourier/courier-ui-core@2.0.0
  - @trycourier/courier-js@3.0.0
  - @trycourier/courier-ui-toast@2.0.0

## 1.2.4

### Patch Changes

- Updated dependencies [[`1b99be2`](https://github.com/trycourier/courier-web/commit/1b99be223433bb05889abec2475a8df5387e8c63)]:
  - @trycourier/courier-js@2.1.3
  - @trycourier/courier-ui-inbox@1.2.3
  - @trycourier/courier-ui-toast@1.0.4

## 1.2.3

### Patch Changes

- Updated dependencies [[`1b99be2`](https://github.com/trycourier/courier-web/commit/1b99be223433bb05889abec2475a8df5387e8c63)]:
  - @trycourier/courier-js@2.1.2
  - @trycourier/courier-ui-inbox@1.2.2
  - @trycourier/courier-ui-toast@1.0.3

## 1.2.2

### Patch Changes

- Updated dependencies [[`3d8e485`](https://github.com/trycourier/courier-web/commit/3d8e485193353c2755b94c92fec119a18149723b)]:
  - @trycourier/courier-ui-toast@1.0.2

## 1.2.1

### Patch Changes

- [#122](https://github.com/trycourier/courier-web/pull/122) [`1baf251`](https://github.com/trycourier/courier-web/commit/1baf251523794771cfe6a86724b84ab1f69f79bd) Thanks [@danasilver](https://github.com/danasilver)! - Fix an issue where duplicate messages may appear when a message arrives in real-time.

- Updated dependencies [[`1baf251`](https://github.com/trycourier/courier-web/commit/1baf251523794771cfe6a86724b84ab1f69f79bd)]:
  - @trycourier/courier-ui-inbox@1.2.1
  - @trycourier/courier-ui-toast@1.0.1
  - @trycourier/courier-js@2.1.1

## 1.2.0

### Minor Changes

- [#106](https://github.com/trycourier/courier-web/pull/106) [`8a59e4c`](https://github.com/trycourier/courier-web/commit/8a59e4c847105a2149d855747106e502080d4cfd) Thanks [@danasilver](https://github.com/danasilver)! - Add toast components to the SDKs. Toasts are dismissible pop-up messages synced with Courier Inbox.

### Patch Changes

- [#107](https://github.com/trycourier/courier-web/pull/107) [`bada39c`](https://github.com/trycourier/courier-web/commit/bada39c48c181d51275b6445d460b22fdf572d56) Thanks [@danasilver](https://github.com/danasilver)! - Fix an issue where custom React components were missing their event handlers.
  Fix an issue where custom React components may not be rendered.

- [#110](https://github.com/trycourier/courier-web/pull/110) [`fd04101`](https://github.com/trycourier/courier-web/commit/fd04101cf01444f33d66f2ece48725c28eb540a6) Thanks [@danasilver](https://github.com/danasilver)! - Reorganize theme management to improve maintainability.

- Updated dependencies [[`8a59e4c`](https://github.com/trycourier/courier-web/commit/8a59e4c847105a2149d855747106e502080d4cfd), [`fd04101`](https://github.com/trycourier/courier-web/commit/fd04101cf01444f33d66f2ece48725c28eb540a6)]:
  - @trycourier/courier-ui-inbox@1.2.0
  - @trycourier/courier-ui-toast@1.0.0
  - @trycourier/courier-ui-core@1.0.14

## 1.1.0

### Minor Changes

- [#95](https://github.com/trycourier/courier-web/pull/95) [`5ba0d27`](https://github.com/trycourier/courier-web/commit/5ba0d27bea31df4e8851642d3621fb15375ef03d) Thanks [@danasilver](https://github.com/danasilver)! - Remove `connectionId` from `CourierProps`. The SDK will always generate a connection ID for a `CourierClient`.

### Patch Changes

- Updated dependencies [[`48e49ae`](https://github.com/trycourier/courier-web/commit/48e49ae6ce89517c101f091d09a11c4a45e7a929), [`5ba0d27`](https://github.com/trycourier/courier-web/commit/5ba0d27bea31df4e8851642d3621fb15375ef03d), [`b0260a2`](https://github.com/trycourier/courier-web/commit/b0260a2648d31fd80a1730e999e2b9cb8bc67144)]:
  - @trycourier/courier-js@2.1.0
  - @trycourier/courier-ui-inbox@1.1.0
