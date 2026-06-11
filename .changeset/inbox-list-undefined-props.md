---
"@trycourier/courier-ui-inbox": patch
---

Guard inbox Custom Element constructors against being invoked without props.

`CourierInboxList`, `CourierInboxHeader`, and `CourierInboxPaginationListItem` are registered as Custom Elements, so the browser can construct them with no arguments (e.g. during `cloneNode()` from DOM snapshot libraries like `dom-to-image`). The constructors previously destructured `props` unconditionally and threw an unhandled `TypeError`. They now return early when `props` is undefined. Fixes #150.
