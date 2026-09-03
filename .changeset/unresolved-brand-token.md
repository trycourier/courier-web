---
"@trycourier/courier-ui-core": patch
---

Ignore a brand token that never resolved, rather than painting with it

The send pipeline fills an action's `background_color` with
`{brand.colors.primary}` whenever the template names no color of its own, and
that token becomes a color only if a brand is configured and resolves. When it
does not, the literal string reaches the kit.

Being neither empty nor a color, it read as an accent the author had chosen.
`secondary` built `1px solid {brand.colors.primary}` from it, the browser
dropped the declaration as invalid, and an outlined action rendered with no
outline and no label color — an unstyled ghost where an outlined button belonged.

An unresolved token is the absence of a color, so it is treated as one and the
look falls back to the kit's own defaults. A color a template actually named is
unaffected.
