---
"@trycourier/courier-ui-inbox": patch
---

Report the injected unread count to header factories in preview mode. The count came from the shared datastore, which preview mode deliberately detaches from, so a custom header rendered alongside `previewMessages` always read zero.

The unread count badge and the option menu now use open shadow roots, like every other component. A closed root cannot be read back from the DOM, so screenshot and snapshot tooling silently dropped the unread badge from anything it captured.
