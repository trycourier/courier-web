---
"@trycourier/courier-ui-inbox": patch
---

Fix bulk archive and read leaving a message visible in the feed.

`archiveAllMessages`, `readAllMessages`, `archiveReadMessages`, and the socket handler for the `archive-all` / `archive-read` / `mark-all-read` events all chose which messages to mutate by reading the datastore's global message store. Loading a dataset syncs its server results into that store but never overwrites an entry already present, so the global copy of a message can be further along than the copy a dataset is showing — already archived by an earlier archive-all, for instance, while the server still returns it as unarchived and a reload puts it back into the inbox dataset.

Selecting from the global store in that state skipped the message, so its row stayed on screen and repeating the action could never clear it: the same check skipped it every time. Marking all as read appeared to fix it only because that path keys off `read` rather than `archived`.

These operations now collect their candidates from the datasets as well as the global store, preferring a dataset's own copy, so they reconcile whatever is actually rendered.
