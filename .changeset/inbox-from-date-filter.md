---
"@trycourier/courier-ui-inbox": minor
---

Inbox: support a `from` date filter on feed/tab filters. `CourierInboxDatasetFilter` now accepts an optional ISO 8601 `from` string, which is forwarded to the underlying `@trycourier/courier-js` query (and applied to real-time/optimistic messages) so messages created before that date are excluded from the inbox. Previously the UI component dropped `from`, so a configured "From Date" had no effect.
