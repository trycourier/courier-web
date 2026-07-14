---
"@trycourier/courier-ui-core": minor
"@trycourier/courier-ui-toast": patch
---

Toast items now render a visible subtle border in dark mode (the previous default matched the background color, so no border appeared), and the dark-mode hover/active backgrounds are softer, matching the inbox list item's effective hover colors. Adds opaque dark-surface shades `gray[700]`/`gray[800]` to `CourierColors`.
