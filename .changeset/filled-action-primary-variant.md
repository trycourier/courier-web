---
"@trycourier/courier-ui-core": minor
---

Give a filled action the filled button's defaults

`courierActionButtonProps` returned `variant: 'secondary'` for every action that
was not a link, so a filled action and an outlined one took the same defaults.
That was invisible while every action arrived carrying a fill — the send pipeline
substituted the brand's primary when a template named none — and became visible
the moment it stopped: with no fill, `secondary`'s surface made the two
identical, and the style an author picked had no effect.

A filled action is the `primary` variant now and an outlined one the
`secondary`, so each takes the right color, hover and shadow when the action
names none of its own. An action that does name a color is unchanged: it
still becomes the fill for `button` and the outline for `secondary`.
