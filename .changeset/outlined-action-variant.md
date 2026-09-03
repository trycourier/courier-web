---
"@trycourier/courier-ui-core": minor
---

Give the outlined action a look of its own, and leave the plain button alone

`courierActionButtonProps` returned `variant: 'secondary'` for every action that
was not a link, so a plain action and an outlined one took the same defaults.
That was invisible while every action arrived carrying a fill — the send pipeline
substituted the brand's primary when a template named none — and became visible
the moment it stopped: with no fill, the two were identical and the style an
author picked had no effect.

`style: 'secondary'` now resolves to a new `outlined` variant: the same face as
the plain button, told apart by an edge you can actually see and by sitting flat
where the plain button floats. `colors.border` could not do that job — it is the
divider hairline, 1.26:1 against the face it would outline.

A styleless action takes `primary`, the filled button, which is the weight an
action wants when it is the thing to do on the message.

`secondary` itself is untouched. It is a public variant with users beyond
actions, so the outline got a variant of its own rather than a new meaning for
everyone else's button. An action that names a color of its own is unchanged
too: it still becomes the fill for `button` and the outline for `secondary`.
