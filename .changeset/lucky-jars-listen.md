---
"@trycourier/courier-js": patch
"@trycourier/courier-ui-core": patch
"@trycourier/courier-ui-preferences": patch
---

Version bump only, so every package moves to a version the registry has not seen. No functional change.

These three sat at versions already on npm while the rest of the packages released, and `changeset publish` attempts every package on each run — the already-published ones come back rejected and take the whole Release run down with them.
