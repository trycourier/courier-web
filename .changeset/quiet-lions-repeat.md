---
"@trycourier/courier-ui-core": patch
---

Render the template designer's outlined action as a button rather than a link

The designer has no way to say "outlined" — the content API accepts only `button` and `link` —
so it encodes an outlined inbox button as `style: "link"` carrying a white background, and reads
that pair back as outlined. Taking the style at face value showed an underlined phrase where the
author had configured a button. That pair now renders as the outlined look, on the kit's own
mode-aware defaults. A link written by hand is unaffected: it arrives carrying a real colour,
since the send pipeline substitutes the brand's primary when a template names none.
