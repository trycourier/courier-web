---
"@trycourier/courier-js": minor
"@trycourier/courier-ui-inbox": minor
---

Inbox: connect on the `iwpv=v2` wire protocol, which publishes the canonical message — the same object the GraphQL read returns, with `trackingIds` at the root and no nested `data.trackingIds` duplicate.

This fixes click, read and archive tracking for messages that arrive over the socket. Previously the socket left `trackingIds` nested under `data` while GraphQL returned them at the root; this SDK reads only the root, so clicking a live-delivered message tracked **nothing**, silently, while clicking the same message after a refresh worked.

Two related gaps are fixed alongside it:

- `CourierInboxDatastore.clickMessage` returned in total silence when `clickTrackingId` was absent, which made a wire-shape problem indistinguishable from a successful no-op. It now logs.
- Action-button clicks were never tracked at all under any protocol version (`onMessageActionClick` carried a standing `// TODO: Track action click?`). New `CourierInboxDatastore.clickMessageAction` records them using the per-action `action.data.trackingId`, which identifies *which* button was pressed.

`InboxMessage` gains the remaining canonical fields: `icon`, `pinned`, `userId`, `content` (`html`/`elemental`), and `brandId` / `trackingUrl`, which are promoted out of `data` to match how the message is indexed and returned by GraphQL. `trackingIds` also gains `channelTrackingId`.

Requires the `iwpv=v2` server support to be deployed first — the server downgrades an unrecognized version to the legacy protocol without erroring.
