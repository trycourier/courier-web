---
"@trycourier/courier-ui-core": minor
---

Name the button variants after the styles that ask for them

`CourierButtonVariants` and Elemental's `action.style` described the same four
looks in two vocabularies that crossed over: `style: 'button'` resolved to
`variant: 'secondary'`, and `style: 'tertiary'` to `variant: 'primary'`. Every
reader had to carry the mapping, and the theme blocks — already named for the
styles — read as though they pointed somewhere else.

The variants are now `button`, `secondary`, `tertiary` and `link`: the same four
words as the style, the theme block, and the designer's style picker. The
style-to-variant mapping is an identity.

Nothing about how a button looks changed. `primary` remains as an alias of
`tertiary`, the solid fill it has always drawn; `outlined` is gone, having
existed only for the length of this branch.
