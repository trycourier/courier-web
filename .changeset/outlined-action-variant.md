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

The plain button is deliberately unchanged. It stays the `secondary` variant it
has always been, hairline edge and shadow included, because that is the look
every action already in the wild is wearing and adding a style for someone else
is not a reason to restyle all of them. An action that names a color of its own
is unchanged too: it still becomes the fill for `button` and the outline for
`secondary`.
