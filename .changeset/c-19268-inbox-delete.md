---
"@trycourier/courier-js": minor
"@trycourier/courier-ui-inbox": minor
"@trycourier/courier-ui-core": minor
---

Add inbox message delete/restore support

- `courier-js`: new `inbox.delete({ messageId })` and `inbox.restore({ messageId })` client methods, and an `InboxMessage.deleted` field.
- `courier-ui-inbox`: `CourierInboxDatastore.deleteMessage()` / `restoreMessage()` with optimistic update + rollback; deleted messages are excluded from every dataset; new `delete_restore` list-item menu action (included in the default actions).
- `courier-ui-core`: new `trash` icon.
