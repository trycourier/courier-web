---
"@trycourier/courier-ui-core": minor
---

Line the button variants up with the styles that ask for them

`CourierButtonVariants` and Elemental's `action.style` described the same looks in
two vocabularies that crossed over: `style: 'button'` resolved to
`variant: 'secondary'`, and `style: 'tertiary'` to `variant: 'primary'`. Every
reader had to carry the mapping, and the theme blocks — already named for the
styles — read as though they pointed somewhere else.

The mapping is now the obvious one:

| `action.style` | variant |
| --- | --- |
| `button` | `primary` |
| `secondary` | `secondary` |
| `tertiary` | `tertiary` |
| `link` | `link` |

`primary` is the default an action renders as when it names no style, which is why
it is also `CourierButton`'s default variant.

**No look changed.** Verified against the template designer's built stylesheet:
all four styles, both modes, base and hover and active, zero differences.

`outlined` is gone, having existed only for the length of this branch. What it
drew is now `secondary`.
