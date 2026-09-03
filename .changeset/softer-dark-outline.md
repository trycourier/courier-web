---
"@trycourier/courier-ui-core": patch
---

Pitch the outlined action's edge to the mode it is drawn in

One gray cannot read the same on both faces. `gray[600]` is a quiet edge on white at 4.7:1, but
against `black[500]` the same value is 3.8:1 and reads louder than the button it belongs to. Dark
mode steps down to a new `gray[650]` (`#585858`, 2.5:1) — softer than the edge it replaces,
and still well clear of the ~1.3:1 divider hairline that made an outlined action look borderless.
