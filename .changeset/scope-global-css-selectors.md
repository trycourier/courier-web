---
"@trycourier/courier-ui-core": patch
"@trycourier/courier-ui-toast": patch
"@trycourier/courier-ui-preferences": patch
---

Scope all injected global CSS selectors to their component tags so they can no longer leak into and clobber host-app styles (C-18926).

- **courier-ui-core**: the inbox empty/error state (`CourierInfoState`) was injecting a bare, global `.container` rule into the page; now scoped to `courier-info-state`. Also scoped the `.courier-checkbox*` and `.courier-radio*` selectors.
- **courier-ui-toast**: renamed the generic global keyframes `show` / `hide` / `auto-dismiss` to `courier-toast-*` so they can't collide with a host app's `@keyframes`.
- **courier-ui-preferences**: scoped all `.courier-*` class selectors (preferences root, section, topic, toggle, channel-routing, digest-schedule) to their component tags.
