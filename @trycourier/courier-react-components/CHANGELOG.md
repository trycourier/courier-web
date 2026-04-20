# @trycourier/courier-react-components

## 2.0.9

### Patch Changes

- [#175](https://github.com/trycourier/courier-web/pull/175) [`07acd75`](https://github.com/trycourier/courier-web/commit/07acd755b97bb6082115f7f2437d1bb5d44129a2) Thanks [@mikemilla](https://github.com/mikemilla)! - Add digest schedule support to preferences: getDigestSchedules API, digestSchedule field on putUserPreferenceTopic, and expose through useCourier hook

- Updated dependencies [[`07acd75`](https://github.com/trycourier/courier-web/commit/07acd755b97bb6082115f7f2437d1bb5d44129a2)]:
  - @trycourier/courier-js@3.2.0
  - @trycourier/courier-ui-inbox@2.4.4
  - @trycourier/courier-ui-toast@2.1.4

## 2.0.8

### Patch Changes

- [#173](https://github.com/trycourier/courier-web/pull/173) [`4fdef42`](https://github.com/trycourier/courier-web/commit/4fdef42cd19ec08977f02731cb7217c0238c9f06) Thanks [@mikemilla](https://github.com/mikemilla)! - Fix ListClient auth to use client-facing endpoints with proper x-courier-client-key header and JWT auth. Add deprecation warnings to functions accepting clientKey parameter. Enable skippable list subscription tests.

- Updated dependencies [[`4fdef42`](https://github.com/trycourier/courier-web/commit/4fdef42cd19ec08977f02731cb7217c0238c9f06)]:
  - @trycourier/courier-js@3.1.3
  - @trycourier/courier-ui-inbox@2.4.3
  - @trycourier/courier-ui-toast@2.1.3

## 2.0.7

### Patch Changes

- [#169](https://github.com/trycourier/courier-web/pull/169) [`903f89b`](https://github.com/trycourier/courier-web/commit/903f89bc281b106bdb8df2797ad2ff1af5d4226f) Thanks [@mikemilla](https://github.com/mikemilla)! - Batch open requests to reduce network overhead. Multiple messages becoming visible within a short window are now collected and sent to the server in a single GraphQL mutation instead of individual requests per message.

- Updated dependencies [[`903f89b`](https://github.com/trycourier/courier-web/commit/903f89bc281b106bdb8df2797ad2ff1af5d4226f), [`bd79590`](https://github.com/trycourier/courier-web/commit/bd79590c9b21cd971372614d4b318752ce0201b0)]:
  - @trycourier/courier-js@3.1.2
  - @trycourier/courier-ui-inbox@2.4.2
  - @trycourier/courier-ui-toast@2.1.2

## 2.0.6

### Patch Changes

- Updated dependencies [[`7be3434`](https://github.com/trycourier/courier-web/commit/7be3434b784581ffc1866819d07b93d6c7c247fb)]:
  - @trycourier/courier-js@3.1.1
  - @trycourier/courier-ui-inbox@2.4.1
  - @trycourier/courier-ui-toast@2.1.1

## 2.0.5

### Patch Changes

- Updated dependencies [[`79ee192`](https://github.com/trycourier/courier-web/commit/79ee19281b74a43634c1b2f83c0a98608b891806), [`79ee192`](https://github.com/trycourier/courier-web/commit/79ee19281b74a43634c1b2f83c0a98608b891806)]:
  - @trycourier/courier-ui-inbox@2.4.0

## 2.0.4

### Patch Changes

- Updated dependencies [[`791ef56`](https://github.com/trycourier/courier-web/commit/791ef56d3383d078fbbb08162e8b3e4277b78eea), [`791ef56`](https://github.com/trycourier/courier-web/commit/791ef56d3383d078fbbb08162e8b3e4277b78eea)]:
  - @trycourier/courier-ui-inbox@2.3.0

## 2.0.3

### Patch Changes

- Updated dependencies [[`a3bf046`](https://github.com/trycourier/courier-web/commit/a3bf046e66cc003bfc5e4d2fa8206a9330638335)]:
  - @trycourier/courier-js@3.1.0
  - @trycourier/courier-ui-toast@2.1.0
  - @trycourier/courier-ui-inbox@2.2.1

## 2.0.2

### Patch Changes

- Updated dependencies [[`ce31bd6`](https://github.com/trycourier/courier-web/commit/ce31bd6ca9c8bc8660f474e3b84d23b68709cf2f)]:
  - @trycourier/courier-ui-inbox@2.2.0

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
