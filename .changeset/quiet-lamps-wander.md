---
"@trycourier/courier-ui-toast": patch
---

Toast hover-to-pause now covers the whole stack: a new toast arriving on top of a hovered one no longer resumes its countdown, toasts queued behind the top one stay frozen while it's being read, and custom toast items pause too.
