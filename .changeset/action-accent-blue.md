---
"@trycourier/courier-ui-core": minor
---

Draw a message action in an accent that does not invert between light and dark

Every action look was built from `colors.primary` — the mode's ink, near-black in light and
white in dark. That is right for body text and wrong for an action: the same action was a black
button in one mode and a white one in the other, so the button a template author picks in the
designer was not the button that arrived in a dark inbox. With no colour left on the action
itself, that default is the whole appearance, and it disagreed with itself.

The four looks now lean on one accent, `#2563EB`, added to the theme as `colors.accent`:

- `button` — a blue fill under a white label, the same in both modes. Hover and press step
  through the blues rather than toward the middle of the ink scale.
- `secondary` — the accent as the outline and the label, over the surface. The hover wash stays
  neutral: it sits behind the label rather than replacing it.
- `tertiary` — the accent as the label, nothing else.
- `link` — already rested at the link colour, which is the same blue. Unchanged.

Where the accent is drawn _on_ the surface rather than under white text it has the opposite
contrast problem, so `colors.accentText` lifts it to `#60A5FA` in dark mode — the value a link
already rested at. The fill itself does not move.

`courier-info-state`'s button keeps the ink outline it has today. It is the SDK's own chrome
rather than one of the looks a template can ask for, so it takes the accent swap back out.

A theme still outranks all of this, and an action's own Elemental styling still outranks the
theme's absence — this only changes what is drawn when nothing has said otherwise.
