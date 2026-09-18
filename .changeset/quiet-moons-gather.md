---
"@trycourier/courier-ui-core": patch
"@trycourier/courier-js": patch
---

Version bump with no functional change, republishing every package through the
repaired release pipeline.

The release job had been failing on every run for reasons unrelated to the code
it publishes (#266), and everything currently on npm went out before that was
fixed. `courier-ui-core` cascades to all eight packages that pin it, and
`courier-js` is the one package that doesn't, so the two together republish the
whole set.
