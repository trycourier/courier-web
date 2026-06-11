---
"@trycourier/courier-js": patch
---

Encode dynamic path segments in REST requests.

`userId`, `token`, and `listId` were interpolated into REST URLs without encoding. Values containing `/`, `?`, `#`, or `..` could alter the request path or query string. These segments are now passed through `encodeURIComponent` in the token and list clients.
