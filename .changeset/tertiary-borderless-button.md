---
"@trycourier/courier-ui-core": minor
---

Render `tertiary` actions as a borderless button

`tertiary` had no look of its own: `outlinedByStyle = style === 'secondary' || style === 'tertiary'`
folded it into the outlined branch, so an author who chose it got an outlined button and no way
to tell the two apart. Email has drawn them differently since the styles were added.

It is now the quietest button in the row — no fill and no outline, just the label in the colour
the action carries. It keeps its padding and a transparent border, so it still reads as a button
and still lines up with a filled or outlined sibling beside it.

Integrators can theme it through a new `borderless` block on the actions theme, alongside the
existing `outlined` and `link`.

This changes what a `tertiary` action looks like. Anything relying on it rendering as outlined
should ask for `secondary`, which is what it was actually getting.
