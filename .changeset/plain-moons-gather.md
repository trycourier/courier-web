---
"@trycourier/courier-ui-toast": patch
---

Auto-dismiss now counts down only the toast on top of the stack. A burst of toasts used to run every countdown in parallel and expire together, so only the newest one was ever readable — toasts behind the top one now freeze mid-countdown, progress bar included, and pick up where they left off when they surface, draining the stack one at a time. Dismissed toasts also fade out with a slight shrink instead of blinking out in place.
