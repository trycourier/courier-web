---
"@trycourier/courier-ui-core": patch
"@trycourier/courier-ui-preferences": patch
---

Reject dangerous URL schemes in link targets.

The `courier-link` component and the preferences brand logo assigned externally-sourced values straight to an anchor's `href`. A value such as `javascript:alert(1)` would execute when the link was clicked (DOM-based XSS).

Adds a `sanitizeUrl` helper to `@trycourier/courier-ui-core` that only allows `http`, `https`, `mailto`, `tel`, and relative URLs (and strips control characters that browsers would otherwise use to hide a scheme). Both link sinks now run their href through it; unsafe values render no link rather than a scriptable one.
