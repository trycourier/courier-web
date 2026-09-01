---
"@trycourier/courier-ui-core": patch
"@trycourier/courier-ui-inbox": patch
---

Fix three ways a message action rendered wrong once it stopped carrying color

All three were masked while every action arrived with a fill substituted by the send pipeline.
With the action reduced to its style, the defaults underneath it are the whole appearance, and
they were not right.

**An action ignored a system theme flip.** Everything else in the inbox re-reads its theme
through the theme manager's subscription. `CourierButton` styles itself once, in its
constructor, resolving `mode: 'system'` against the theme in force at that moment — and
`themeManager.mode` is the _user's_ setting, which is `'system'` unless an integrator pinned
it. It never overrode `onSystemThemeChange`, so an OS flip left the actions, and only the
actions, wearing the mode that had just ended: a near-black filled button on a dark list, or a
white outlined one. It now restyles on the flip, and a button pinned to `light` or `dark` still
ignores the OS.

**An outlined action had no visible outline.** Its border was `colors.border` — the hairline
rows are separated with — which is about 1.3:1 against the surface the same button is filled
with, in either mode. An outlined action was indistinguishable from a borderless one unless the
template gave it a color, which templates no longer do. It now uses `gray[600]`, which clears
3:1 against both faces, so one value serves light and dark. `colors.border` itself is unchanged,
so dividers are unaffected.

**A link sat too high beside a taller action.** Not a defect in the rendered inbox — a native
button centers its own content — but the row stretches its actions so their borders line up, so
anything drawn as a `div` rather than a `button` has to say it centers. Noted here because the
theme contract now depends on it.
